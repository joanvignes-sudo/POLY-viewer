// Documentary order only: never scheduled on the synthetic or biological clock.
export class EyeReader {
  constructor(contract) {
    if (contract.id !== 'pilot:eye-light' || contract.mode !== 'documentary' ||
        contract.presentation?.no_biological_time !== true || contract.presentation?.clock !== 'display_only') throw Error('Contrat documentaire incompatible');
    const mechanism = contract.mechanisms.find(m => m.id === 'eye:light-path');
    if (mechanism?.time.kind !== 'unknown' || mechanism.time.value !== null || mechanism.time.unit !== null) throw Error('Temps biologique inconnu requis');
    this.contract = structuredClone(contract);
    this.ids = ['light:arrival', 'light:absorption'];
    for (const id of this.ids) if (!contract.events.some(e => e.id === id)) throw Error('Événement P1 absent');
    this.position = 0;
  }
  select(position) {
    if (!Number.isInteger(position) || position < 0 || position >= this.ids.length) throw Error('Étape documentaire invalide');
    this.position = position; return this.read();
  }
  read() {
    const id = this.ids[this.position];
    const event = this.contract.events.find(e => e.id === id);
    return {contractId: this.contract.id, eventId: id, entityId: event.entity,
      definition: event.definition, biologicalTime: null, clock: 'documentary_order',
      // 0 and 5 are positions in the inherited eight-second display cycle only.
      displayPhase: this.position === 0 ? 0 : 5,
      trace: this.ids.slice(0,this.position+1).map((eventId,i)=>({instanceId:`documentary:${i}`,definitionId:eventId,parent:i?'documentary:0':null,biologicalTime:null,status:'documentary'}))};
  }
  save() { return JSON.stringify({version:1, kind:'poly-documentary-eye', contract:this.contract, position:this.position}); }
  restore(json) {
    const s=JSON.parse(json);
    if (s.version!==1 || s.kind!=='poly-documentary-eye' || JSON.stringify(s.contract)!==JSON.stringify(this.contract)) throw Error('Checkpoint incompatible');
    return this.select(s.position);
  }
}
