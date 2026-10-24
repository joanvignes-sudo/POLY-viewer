export function mountAtlasEmbed(frame){
 function apply(){
  const doc=frame.contentDocument;if(!doc?.documentElement)return;
  doc.documentElement.dataset.polyEmbedded='atelier';
  if(!doc.getElementById('poly-atelier-avatar-layout')){const css=doc.createElement('link');css.id='poly-atelier-avatar-layout';css.rel='stylesheet';css.href='poly-atelier-avatar.css';doc.head.append(css);}
  doc.defaultView.scrollTo(0,0);
 }
 frame.addEventListener('load',apply);
 if(frame.contentDocument?.readyState==='complete')apply();
}
