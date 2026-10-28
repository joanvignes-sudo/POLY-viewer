// Build geometry incrementally without blocking the main thread for an entire catalogue.
// This defers *construction*, not the binary download, and does not reduce total mesh size.
export async function buildInBudget(items,visit,{budgetMs=7,now=()=>performance.now(),yieldControl=()=>new Promise(resolve=>setTimeout(resolve,0)),onProgress=()=>{}}={}){
 if(!Array.isArray(items)||typeof visit!=='function'||typeof onProgress!=='function'||typeof now!=='function'||typeof yieldControl!=='function')throw TypeError('Batch scheduler contract');
 if(!Number.isFinite(budgetMs)||budgetMs<=0||budgetMs>100)throw RangeError('Invalid frame budget');
 let done=0;
 const total=items.length;
 while(done<total){
  const started=now();
  do{
   await visit(items[done],done);
   done++;
  }while(done<total&&now()-started<budgetMs);
  onProgress(done,total);
  if(done<total)await yieldControl();
 }
 if(total===0)onProgress(0,0);
 return {completed:done,total};
}
