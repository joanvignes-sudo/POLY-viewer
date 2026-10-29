export function localResearchAvailable(url){const u=new URL(url);return ['127.0.0.1','localhost','[::1]'].includes(u.hostname)&&u.searchParams.get('public')!=='1';}
