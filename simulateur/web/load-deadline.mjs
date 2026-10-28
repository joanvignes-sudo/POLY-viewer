// Wall-clock network/loading guard; unrelated to any biological clock.
export function startLoadDeadline(controller,{timeoutMs=30000,schedule=setTimeout,cancel=clearTimeout}={}){
 if(!controller?.signal||typeof controller.abort!=='function'||!Number.isSafeInteger(timeoutMs)||timeoutMs<1)throw Error('Invalid load deadline');
 let expired=false,disposed=false,timer;
 const dispose=()=>{if(disposed)return;disposed=true;cancel(timer);controller.signal.removeEventListener('abort',dispose);};
 if(controller.signal.aborted)return {expired:()=>false,dispose(){}};
 timer=schedule(()=>{if(disposed)return;expired=true;controller.abort(Object.assign(Error('Loading exceeded '+timeoutMs+' ms'),{code:'POLY_LOAD_TIMEOUT'}));},timeoutMs);
 controller.signal.addEventListener('abort',dispose,{once:true});
 return {expired:()=>expired,dispose};
}
