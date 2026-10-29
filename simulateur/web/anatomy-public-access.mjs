import {localResearchAvailable} from './publication-context.mjs';
if(!localResearchAvailable(location.href))for(const a of document.querySelectorAll('a[href]')){const u=new URL(a.href);if(/\/(body-region-lab|reference-region-lab|skeleton-region-lab)\.html$/.test(u.pathname)){a.href='travaux.html#local';a.textContent='Atelier local · consulter sa disponibilité →';}}
