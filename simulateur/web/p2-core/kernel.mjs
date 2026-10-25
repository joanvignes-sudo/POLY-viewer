// All times are integer synthetic ticks. No physiological interpretation.
const copy = x => structuredClone(x);
const tick = x => { if (!Number.isSafeInteger(x) || x < 0) throw Error('Invalid synthetic tick'); };
export class Kernel {
  constructor(definitions, state = {}) {
    this.definitions = copy(definitions);
    const ids = definitions.map(d => d.id);
    if (new Set(ids).size !== ids.length) throw Error('Duplicate definition');
    for (const d of definitions) for (const link of d.next ?? []) {
      if (!ids.includes(link.target)) throw Error('Unknown target');
      tick(link.delay);
      if (link.feedback && link.delay === 0) throw Error('Feedback requires delay');
    }
    this.state = copy(state); this.now = 0; this.sequence = 0;
    this.events = []; this.trace = [];
  }
  schedule(definitionId, at, parents = []) {
    tick(at);
    if (at < this.now || !this.definitions.some(d => d.id === definitionId)) throw Error('Invalid schedule');
    if (parents.some(id => !this.events.some(e => e.id === id))) throw Error('Unknown parent');
    const event = {id: `e${this.sequence}`, sequence: this.sequence++, definitionId, at, parents: [...parents], status: 'pending'};
    this.events.push(event); return event.id;
  }
  cancel(id) {
    if (!this.events.some(e => e.id === id)) throw Error('Unknown instance');
    const invalid = new Set([id]);
    let changed;
    do { changed = false; for (const e of this.events) if (!invalid.has(e.id) && e.parents.some(p => invalid.has(p))) { invalid.add(e.id); changed = true; } } while (changed);
    for (const e of this.events) if (invalid.has(e.id) && e.status === 'pending') {
      e.status = e.id === id ? 'cancelled' : 'invalidated';
      this.trace.push({time: this.now, id: e.id, status: e.status});
    }
    // Completed effects are retained; cancellation is not rollback.
  }
  run(until, maxEvents = 1000) {
    tick(until);
    if (until < this.now || !Number.isSafeInteger(maxEvents) || maxEvents < 1) throw Error('Invalid execution bound');
    let count = 0;
    for (;;) {
      const e = this.events.filter(e => e.status === 'pending' && e.at <= until).sort((a,b) => a.at-b.at || a.sequence-b.sequence)[0];
      if (!e) { this.now = until; return {bounded: false, count}; }
      if (count === maxEvents) return {bounded: true, count};
      count++; this.now = e.at;
      const d = this.definitions.find(d => d.id === e.definitionId);
      const parentsReady = e.parents.every(id => this.events.find(p => p.id === id)?.status === 'completed');
      const allowed = Object.entries(d.when ?? {}).every(([k,v]) => this.state[k] === v);
      e.status = !parentsReady ? 'invalidated' : !allowed ? 'skipped' : 'completed';
      if (e.status === 'completed') Object.assign(this.state, copy(d.set ?? {}));
      this.trace.push({time: this.now, id: e.id, definitionId: d.id, parents: [...e.parents], status: e.status, state: copy(this.state)});
      if (e.status === 'completed') for (const link of d.next ?? []) this.schedule(link.target, this.now + link.delay, [e.id]);
    }
  }
  save() { return JSON.stringify({version: 1, kind: 'synthetic-only', definitions: this.definitions, state: this.state, now: this.now, sequence: this.sequence, events: this.events, trace: this.trace}); }
  static resume(json) {
    const s = JSON.parse(json);
    if (s.version !== 1 || s.kind !== 'synthetic-only') throw Error('Unsupported checkpoint');
    const k = new Kernel(s.definitions, s.state);
    tick(s.now); tick(s.sequence);
    Object.assign(k, {now: s.now, sequence: s.sequence, events: copy(s.events), trace: copy(s.trace)});
    return k;
  }
}
