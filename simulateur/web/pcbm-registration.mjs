// PCBM — mathematical audit of candidate 3D registrations.
// A passing numerical audit is NOT proof of anatomical identity or independent replication.
// Matrices are 4x4 ROW-MAJOR, applied to COLUMN vectors [x,y,z,1], coordinates in mm.
const check=(x,msg)=>{if(!x)throw Error('PCBM registration: '+msg)};
const sha=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const vector=x=>Array.isArray(x)&&x.length===3&&x.every(Number.isFinite)&&x.every(n=>Math.abs(n)<1e8);
const unit='mm';
const close=(a,b,eps=1e-9)=>Math.abs(a-b)<=eps;
function determinant(a){
 return a[0]*(a[5]*a[10]-a[6]*a[9])-a[1]*(a[4]*a[10]-a[6]*a[8])+a[2]*(a[4]*a[9]-a[5]*a[8]);
}
export function verifyAffine4(matrix){
 check(Array.isArray(matrix)&&matrix.length===16&&matrix.every(Number.isFinite),'matrix must contain 16 finite numbers');
 check(close(matrix[12],0)&&close(matrix[13],0)&&close(matrix[14],0)&&close(matrix[15],1),'matrix must be affine row-major');
 const d=determinant(matrix);
 check(Math.abs(d)>1e-10&&Number.isFinite(d),'degenerate spatial transformation');
 const rowBound=Math.max(...[0,1,2].map(i=>Math.abs(matrix[i*4])+Math.abs(matrix[i*4+1])+Math.abs(matrix[i*4+2])));
 check(Number.isFinite(rowBound)&&rowBound>0&&rowBound<1e4,'unbounded spatial scale');
 return Object.freeze({determinant:d,max_row_sum:rowBound,orientation:d>0?'preserved':'reversed'});
}
export function applyPCBMMatrix(matrix,p){
 verifyAffine4(matrix);check(vector(p),'point must contain three finite coordinates in mm');
 return [0,1,2].map(i=>matrix[i*4]*p[0]+matrix[i*4+1]*p[1]+matrix[i*4+2]*p[2]+matrix[i*4+3]);
}
function tetraVolume(a,b,c,d){
 const u=b.map((v,i)=>v-a[i]),v=c.map((x,i)=>x-a[i]),w=d.map((x,i)=>x-a[i]);
 return Math.abs(u[0]*(v[1]*w[2]-v[2]*w[1])-u[1]*(v[0]*w[2]-v[2]*w[0])+u[2]*(v[0]*w[1]-v[1]*w[0]));
}
function hasIndependent3DGeometry(points){
 // A well-conditioned non-coplanar held-out sample covers a true 3D volume.
 const n=points.length;
 let diameter=0;
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)diameter=Math.max(diameter,Math.hypot(...points[i].map((v,k)=>v-points[j][k])));
 if(diameter<=1e-6)return false;
 for(let a=0;a<n-3;a++)for(let b=a+1;b<n-2;b++)for(let c=b+1;c<n-1;c++)for(let d=c+1;d<n;d++){
  if(tetraVolume(points[a],points[b],points[c],points[d])>1e-6*diameter**3)return true;
 }
 return false;
}
export function auditPCBMRegistration({registration,from,to,sources}){
 const t=registration;
 check(from&&to&&from.id!==to.id&&from.unit===unit&&to.unit===unit,'frames must be distinct explicit millimetric frames');
 check(t?.status==='independently_validated'&&t.from_frame===from.id&&t.to_frame===to.id,'unqualified source or destination frame');
 check(t.matrix_convention==='row_major_column_vector'&&t.error_unit==='mm','matrix convention or uncertainty unit missing');
 check(Number.isFinite(t.error_bound)&&t.error_bound>=0&&t.error_bound<1e6,'missing finite error bound');
 check(typeof t.method==='string'&&t.method.length>=12,'registration method undocumented');
 check(t.review?.status==='HUMAN_APPROVED'&&typeof t.review.reviewer_id==='string'&&t.review.reviewer_id.length>2&&
  typeof t.review.date==='string'&&/^\d{4}-\d\d-\d\d$/.test(t.review.date),'human review attestation absent');
 check(sha(t.fit_dataset_sha256)&&sha(t.validation_dataset_sha256)&&t.fit_dataset_sha256!==t.validation_dataset_sha256,
  'fit and held-out datasets must have distinct checksums');
 check(Array.isArray(t.source_ids)&&t.source_ids.length>0&&t.source_ids.every(id=>sources?.has(id)),'registration provenance absent');
 check(Array.isArray(t.holdout_landmarks)&&t.holdout_landmarks.length>=4&&t.holdout_landmarks.length<=24,'at least four held-out landmarks required');
 const affine=verifyAffine4(t.matrix4x4),ids=new Set(),a=[],b=[];
 let sumSquares=0,maxResidual=0;
 for(const point of t.holdout_landmarks){
  check(typeof point.id==='string'&&point.id.length>0&&!ids.has(point.id),'landmark identifier missing or repeated');ids.add(point.id);
  check(vector(point.from_xyz_mm)&&vector(point.to_xyz_mm),'landmark coordinates must be finite millimetres');
  a.push(point.from_xyz_mm);b.push(point.to_xyz_mm);
  const projected=applyPCBMMatrix(t.matrix4x4,point.from_xyz_mm);
  const residual=Math.hypot(...projected.map((v,i)=>v-point.to_xyz_mm[i]));
  sumSquares+=residual**2;maxResidual=Math.max(maxResidual,residual);
 }
 check(hasIndependent3DGeometry(a)&&hasIndependent3DGeometry(b),'held-out landmarks are coplanar or degenerate');
 check(maxResidual<=t.error_bound+1e-8,'independent landmark residual exceeds claimed bound');
 return Object.freeze({
  numerical_check:'passed_not_anatomical_proof',landmarks:ids.size,
  held_out_rms_mm:Math.sqrt(sumSquares/ids.size),held_out_max_mm:maxResidual,
  claimed_error_bound_mm:t.error_bound,orientation:affine.orientation,
  source_frame:from.id,target_frame:to.id,fit_dataset_sha256:t.fit_dataset_sha256,
  validation_dataset_sha256:t.validation_dataset_sha256,reviewer_id:t.review.reviewer_id,
  // Coordinates and errors have been checked, NOT the authenticity or independence of uploaded datasets.
  dataset_independence_verified_by_software:false
 });
}
export function composePCBMRegistrations(a,b){
 check(a?.to_frame===b?.from_frame,'consecutive coordinate frames required');
 check(a.specimen_id&&a.specimen_id===b.specimen_id,'cannot compose across specimens');
 check(a.unit==='mm'&&b.unit==='mm'&&a.numerically_audited===true&&b.numerically_audited===true,'only audited millimetric registrations can compose');
 const A=a.matrix4x4,B=b.matrix4x4;const aa=verifyAffine4(A),bb=verifyAffine4(B);
 check(Number.isFinite(a.error_bound_mm)&&a.error_bound_mm>=0&&Number.isFinite(b.error_bound_mm)&&b.error_bound_mm>=0,'missing error bounds');
 const m=new Array(16).fill(0);
 for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)m[r*4+c]+=B[r*4+k]*A[k*4+c];
 verifyAffine4(m);
 // Conservative infinity-norm bound: ||e_total||inf <= ||J_B||inf * ||e_A||inf + ||e_B||inf.
 const e=bb.max_row_sum*a.error_bound_mm+b.error_bound_mm;
 check(Number.isFinite(e)&&e<1e8,'uncertainty propagation overflow');
 return Object.freeze({from_frame:a.from_frame,to_frame:b.to_frame,specimen_id:a.specimen_id,
  unit:'mm',numerically_audited:true,matrix4x4:m,error_bound_mm:e,
  error_semantics:'coordinatewise_max_abs_conservative',
  biological_time:null,landmark_identity_proven:false,
  verification:'algebraic_composition_only',
  notes:'Composed from numerically audited registrations; anatomical suitability requires independent scientific review.'});
}
