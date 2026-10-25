const expected={"thermal-matrix-t31.json": "fe6c23e2534835fc72ff1d3a5809a672e46cb401fd0ef5daceca29930c3a7c19", "calculation-register-t31.json": "28a7da0e7e4c34404adb9fea6c8dbd52af6787cc5ad289485beb5f3b6d2efdb0", "thermal-matrix-pair-t31.json": "91defb0fd9948a26619aee807a3f07b6ed18e398c28eca711f432cfe342427d1"};

const section=document.getElementById('thermal-calculation-reception');

if(section){

 const status=document.createElement('p');status.setAttribute('role','status');status.id='thermal-matrix-download-status';section.append(status);

 for(const link of section.querySelectorAll('a[download],button[data-file]'))link.addEventListener('click',async event=>{

  event.preventDefault();const name=link.getAttribute('data-file')||link.getAttribute('href');if(!expected[name])return;

  status.textContent='Préparation du fichier…';

  try{

   const response=await fetch(name,{cache:'no-store',signal:AbortSignal.timeout(10000)});

   if(!response.ok)throw Error('Fichier indisponible.');

   const bytes=await response.arrayBuffer();

   const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');

   if(sha!==expected[name])throw Error('Le fichier ne correspond pas à la version reçue.');

   const url=URL.createObjectURL(new Blob([new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes)],{type:'application/json'}));

   const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);

   status.textContent='Fichier vérifié et transmis au navigateur.';

  }catch(e){status.textContent='Téléchargement impossible : '+e.message;}

 });

}

