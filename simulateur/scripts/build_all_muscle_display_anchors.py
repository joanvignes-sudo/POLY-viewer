#!/usr/bin/env python3
"""Build provisional muscle-to-skeleton *visual* anchors for every displayed muscle.

Does not infer entheses or bone physiology from geometry. The two muscle ends
are PCA extrema; corresponding target candidates are nearest sampled Z-Anatomy
vertices within anatomically broad *display regions*, not proven insertions.

Dependencies: numpy, scipy. Originals are never rewritten.
"""
from __future__ import annotations
import argparse
import gzip
import hashlib
import json
from pathlib import Path
from collections import Counter, defaultdict
import numpy as np
from scipy.spatial import cKDTree
from scipy.spatial.transform import Rotation

BASE=Path(__file__).resolve().parents[1]
FILE_NAMES=("forearm-motor-reference.json.gz","hand-muscles-reference.json.gz","skeleton-source-206.json.gz")
REGIONS={
 "arm_shoulder":{"arm","shoulder","thorax"},
 "forearm":{"arm","hand"},
 "hand":{"hand","arm"},
 "thigh":{"leg","pelvis"},
 "leg":{"leg","foot"},
 "foot":{"foot","leg"},
 "trunk":{"cranium","face","spine","hyoid","thorax","pelvis","shoulder"},
}
BOUNDS_MM_NOTE="POLY normalized display units, NOT millimetres; distances are graphics diagnostics."
LIMIT=0.26  # if a proxy bone is farther, no visual tether is authorized

def read_gz(path):
    raw=path.read_bytes()
    return json.loads(gzip.decompress(raw)),hashlib.sha256(raw).hexdigest()

def place(points,part,atlas,fit,layer):
    d=part.get("placement") or atlas.get("placement") or atlas.get("illustrative_placement")
    a=(points-np.array(d["source_origin"]))*d["scale"]
    c,s=np.cos(d["rotation_x_rad"]),np.sin(d["rotation_x_rad"])
    p=np.column_stack((a[:,0]+d["target_origin"][0],
                       c*a[:,2]+s*a[:,1]+d["target_origin"][1],
                       s*a[:,2]-c*a[:,1]+d["target_origin"][2]))
    al=part.get("illustrative_alignment") or atlas.get("illustrative_alignment",{}).get(part.get("side","R"))
    if al:
        p=Rotation.from_quat(al["quaternion"]).apply(p-np.array(al["source_wrist_proxy"]))*al["scale"]+np.array(al["target_wrist_proxy"])
    p+=np.array(part.get("illustrative_offset",[0,0,0]))
    if layer=="hand":region="hand"
    elif part.get("reference_deformation")=="rigid_foot":region="foot"
    else:region=part.get("region") or "forearm"
    t=fit.get("groups",{}).get(part.get("side","")+":"+region)
    if t:p=(p-np.array(t["source_center"]))*t["scale"]+np.array(t["target_center"])
    return p,region

def tip(verts,upper):
    y=verts[:,1];q=np.ptp(y)
    return np.mean(verts[y>=y.max()-q*.08 if upper else y<=y.min()+q*.08],axis=0)

def quat(u,v):
    a=u/np.linalg.norm(u);b=v/np.linalg.norm(v)
    z=np.r_[np.cross(a,b),1+a@b]
    if np.linalg.norm(z)<1.e-8:return Rotation.identity()
    return Rotation.from_quat(z/np.linalg.norm(z))

def arm_rest(skeleton):
    bones={m["bone_id"]:m for m in skeleton["meshes"]}
    out={}
    for side in ("R","L"):
        upper=np.asarray(bones[f"BONE:humerus_{side}"]["positions"]).reshape(-1,3)
        lower=np.concatenate([np.asarray(bones[f"BONE:{n}_{side}"]["positions"]).reshape(-1,3) for n in ("radius","ulna")])
        shoulder,elbow,wrist=tip(upper,True),tip(upper,False),tip(lower,False)
        sign=-1 if side=="R" else 1
        target_shoulder=np.array([sign*.36,2.85,0])
        target_elbow=np.array([sign*.63,2.27,.03])
        target_wrist=np.array([sign*.9,1.78,.05])
        q_upper=quat(elbow-shoulder,target_elbow-target_shoulder)
        reached_elbow=q_upper.apply(elbow-shoulder)+target_shoulder
        q_fore=quat(wrist-elbow,target_wrist-target_elbow)
        out[side]=(shoulder,elbow,target_shoulder,reached_elbow,q_upper,q_fore)
    return out

def rest_vertices(m,original,rest):
    side=m.get("side")
    if side not in rest:return original
    shoulder,elbow,target_shoulder,reached_elbow,q_upper,q_fore=rest[side]
    bid=m["bone_id"]
    if bid.startswith("BONE:humerus_"):
        return q_upper.apply(original-shoulder)+target_shoulder
    if bid.startswith(("BONE:radius_","BONE:ulna_")) or m.get("region")=="hand":
        return q_fore.apply(original-elbow)+reached_elbow
    return original

def tips(points):
    # PCA end vertices, in actual display space; using only two is a visual proxy.
    p=points
    axis=np.linalg.eigh(np.cov(p,rowvar=False))[1][:,-1]
    if axis[1]<0:axis=-axis
    proj=p@axis
    a=int(np.argmin(proj));b=int(np.argmax(proj))
    return [a,b]

def candidates(bone,region,side):
    # A bounded *visual* search, not anatomical assertions. Many muscles
    # (facial expression, tongue, sphincters) have soft-tissue attachments.
    if bone.get("region") not in REGIONS.get(region,REGIONS["trunk"]):return False
    bone_side=bone.get("side")
    if side in ("L","R"):return bone_side in (side,None)
    return bone_side is None

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--input",type=Path,default=BASE/"data")
    parser.add_argument("--output",type=Path,default=BASE/"data"/"all-muscle-display-anchors.json")
    args=parser.parse_args()
    body,h0=read_gz(args.input/FILE_NAMES[0])
    hand,h1=read_gz(args.input/FILE_NAMES[1])
    skeleton,h2=read_gz(args.input/FILE_NAMES[2])
    fit=json.loads((args.input/"muscle-bone-display-calibration.json").read_text(encoding="utf-8"))
    iface_path=args.input/"muscle-skeleton-interface.json"
    iface=json.loads(iface_path.read_text(encoding="utf-8"))
    documented=defaultdict(list)
    for rel in iface["relations"]["legacy_documented_bone_regions"]:
        for surface_id in rel["source_surface_ids"]:
            documented[surface_id].append({
                "bone_family":rel["bone_family"],
                "evidence_source":rel["source"],
                "anatomical_region_description":rel["anatomical_note"],
                "status":"documented_region_not_3d_enthesis"
            })
    raw_bones=[]
    rest=arm_rest(skeleton)
    for b in skeleton["meshes"]:
        original=np.asarray(b["positions"],np.float64).reshape(-1,3)
        posed=rest_vertices(b,original,rest)
        stride=max(1,len(posed)//2200)
        take=np.arange(0,len(posed),stride,dtype=np.int32)
        raw_bones.append({"record":b,"indices":take,"display":posed[take]})
    search_cache={}
    def search(region,side):
        key=(region,side)
        if key not in search_cache:
            bones=[(i,b) for i,b in enumerate(raw_bones) if candidates(b["record"],region,side)]
            if not bones:search_cache[key]=None
            else:
                p=np.concatenate([b["display"] for _,b in bones])
                bi=np.concatenate([np.full(len(b["indices"]),i) for i,b in bones])
                vi=np.concatenate([b["indices"] for _,b in bones])
                search_cache[key]=(cKDTree(p),bi,vi)
        return search_cache[key]
    records=[]
    for layer,atlas,parts in (
        ("body",body,body["parts"]),
        ("hand",hand,[p for p in hand["parts"] if p.get("kind")=="muscle"]),
    ):
        for part in parts:
            source=np.asarray(part["positions"],np.float64).reshape(-1,3)
            disp,region=place(source,part,atlas,fit,layer)
            ends=tips(disp)
            entries=[]
            pool=search(region,part.get("side"))
            for tip_name,vidx in zip(("first_pca_extreme","second_pca_extreme"),ends):
                m=disp[vidx]
                obj={"role":tip_name,"muscle_vertex_index":vidx,
                     "muscle_display_xyz":[round(float(x),6) for x in m],
                     "candidate_bone_id":None,"bone_source_object":None,"bone_vertex_index":None,
                     "bone_source_xyz":None,"rest_distance":None,
                     "status":"unresolved_no_qualified_bone_target"}
                if pool:
                    kd,bone_ids,vertex_ids=pool
                    gap,j=kd.query(m,k=1)
                    b=raw_bones[int(bone_ids[j])]["record"]
                    obj["rest_distance"]=round(float(gap),6)
                    if gap<=LIMIT:
                        k=int(vertex_ids[j])
                        obj.update(candidate_bone_id=b["bone_id"],bone_source_object=b.get("source_object"),
                                   bone_vertex_index=k,
                                   bone_source_xyz=[round(float(x),7) for x in np.asarray(b["positions"]).reshape(-1,3)[k]],
                                   status="illustrative_bone_surface_proxy_unvalidated")
                entries.append(obj)
            records.append({"id":layer+":"+part["id"],"source_atlas":layer,
                            "source_part_id":part["id"],"side":part.get("side"),
                            "name":part.get("name"),"region":region,
                            "anchors":entries,"documented_bone_regions":documented.get(layer+":"+part["id"],[]),
                            "anatomical_origin_xyz":None,
                            "anatomical_insertion_xyz":None,
                            "tendon_segments_measured":False,
                            "anatomical_registration_validated":False})
    statuses=Counter(a["status"] for r in records for a in r["anchors"])
    out={"schema":"poly.display-muscle-anchor-graph/1",
         "provenance":{"input_files":dict(zip(FILE_NAMES,[h0,h1,h2])),
            "placement":"Existing source display transforms and 0.138 regional visual fit",
            "skeletal_rest":"Existing Z-Anatomy rest presentation adaptation for upper arms",
            "code":"simulateur/scripts/build_all_muscle_display_anchors.py",
            "documentary_interface_sha256":hashlib.sha256(iface_path.read_bytes()).hexdigest()},
         "meaning":"Two PCA endpoint candidates per source muscle; nearest display bone vertex in a broad regional pool is a graphical tether, NOT an anatomical attachment or tendon.",
         "distance_unit":BOUNDS_MM_NOTE,"distance_limit_display_units":LIMIT,
         "documented_insertion_count":0,"validated_attachment_count":0,
         "unknown_muscle_geometry":"TA2 concepts not represented by atlas surfaces are not fabricated.",
         "eligible_muscle_surfaces":len(records),
         "summary":{"muscle_surfaces":len(records),"total_end_candidates":len(records)*2,
                    "statuses":dict(statuses),
                    "two_visual_bone_proxies":sum(all(a["candidate_bone_id"] for a in r["anchors"]) for r in records),
                    "at_least_one_visual_bone_proxy":sum(any(a["candidate_bone_id"] for a in r["anchors"]) for r in records)},
         "records":records}
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(out,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
    print(json.dumps(out["summary"],ensure_ascii=False),flush=True)

if __name__=="__main__":main()
