export const REFERENCE_LOCAL_BUDGET=4194304;
export const REFERENCE_WHOLE_BUDGET=96*1024*1024;
export function referenceSelectionProfile(whole,budget=REFERENCE_LOCAL_BUDGET){
 if(typeof whole!=='boolean'||!Number.isSafeInteger(budget)||!(whole?[REFERENCE_LOCAL_BUDGET,REFERENCE_WHOLE_BUDGET]:[REFERENCE_LOCAL_BUDGET]).includes(budget))throw Error('Invalid explicit reference budget');
 return Object.freeze({id:whole?'whole':'local',maxRawBytes:budget,maxEntries:whole?526:16,timeoutMs:whole&&budget>REFERENCE_LOCAL_BUDGET?120000:30000});
}
