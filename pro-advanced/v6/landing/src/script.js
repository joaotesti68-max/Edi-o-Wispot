/* Pro Advanced · v6 "A Estrutura": one living cybersecurity world (three.js). The surface holds the
   platform (servers, gateway, backup, cloud, SOC, governance, shield); below it, hanging off a data shaft,
   are levels that only appear once: the time tower, the segment district, the project corridor, the
   partner hub and the archive. At the end the camera rises and the dome flattens into the Pro logo.
   GSAP/ScrollTrigger/Lenis drive the page; it reads fine without them. */
(function(){
  const page=document.getElementById('px');if(!page)return;
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=s=>page.querySelector(s),$$=s=>[...page.querySelectorAll(s)];
  const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));

  /* full width when embedded in a narrower column (RD Station blocks) */
  function bleed(){const st=page.style;st.setProperty('margin-left','0px','important');st.setProperty('width','auto','important');
    const left=page.getBoundingClientRect().left,w=document.documentElement.clientWidth;
    if(Math.abs(left)<1&&Math.abs(page.offsetWidth-w)<2){st.removeProperty('width');st.removeProperty('margin-left');return}
    st.setProperty('width',w+'px','important');st.setProperty('max-width',w+'px','important');st.setProperty('margin-left',(-left)+'px','important')}
  bleed();addEventListener('resize',()=>{bleed();window.ScrollTrigger&&ScrollTrigger.refresh()});

  /* header */
  const nav=$('#px-nav'),bg=$('#px-burger'),prog=$('#px-prog');
  if(bg)bg.addEventListener('click',()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('#px-menu a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');bg&&bg.setAttribute('aria-expanded',false)}));
  let lastY=0;addEventListener('scroll',()=>{const y=scrollY;nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',y>500&&y>lastY&&!nav.classList.contains('open'));lastY=y;
    if(prog)prog.style.transform='scaleX('+clamp(0,1,y/Math.max(1,document.documentElement.scrollHeight-innerHeight))+')'},{passive:true});

  /* RD Station form (same embed as proadvanced.com.br) with a static fallback */
  (function(){
    const host=document.getElementById('gmk-forms-home-f6a9607991fe0a26527a'),fb=document.getElementById('px-fallback');if(!host||!fb)return;
    /* the reserve form appears only if the RD script cannot load (local previews); once RD renders anything, it never shows */
    let rd=false;const hideFb=()=>{rd=true;fb.hidden=true;host.hidden=false;window.ScrollTrigger&&setTimeout(()=>ScrollTrigger.refresh(),60)};
    const showFb=()=>{if(rd||host.children.length)return;host.hidden=true;fb.hidden=false};
    if('MutationObserver' in window)new MutationObserver(()=>{if(host.children.length)hideFb()}).observe(host,{childList:true,subtree:true});
    try{const s=document.createElement('script');s.src='https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';s.async=true;
      s.onload=()=>{rd=true;try{new RDStationForms('gmk-forms-home-f6a9607991fe0a26527a','null').createForm()}catch(e){rd=false;showFb()}};s.onerror=showFb;document.head.appendChild(s)}catch(e){showFb()}
    fb.addEventListener('submit',e=>{e.preventDefault();const msg=fb.querySelector('.msg');const miss=[...fb.querySelectorAll('[required]')].find(i=>!i.value.trim());
      if(miss){msg.textContent='Preencha os campos marcados com *.';miss.focus();return}
      msg.textContent='Prévia: o formulário oficial do RD Station aparece aqui na página publicada. Enquanto isso, escreva para contato@proadvanced.com.br.'});
  })();

  const LOGO3D='{{LOGO_DARK_DATA}}';
  /* ---------- views: every chapter has its own place in the world, nothing repeats ---------- */
  const VIEWS={
    hero:{p:[78,46,72],l:[0,8,0],z:null,name:'Superfície · visão geral',orbit:1},
    sol0:{p:[-1,12,10],l:[-15,3,-8],z:'servers',name:'Infraestrutura de TI'},
    sol1:{p:[53,12,-15],l:[29,6.3,0],z:'gateway',name:'Escudo · Cibersegurança'},
    sol2:{p:[29,10,27],l:[15.5,3,10],z:'backup',name:'Cofre · Backup'},
    sol3:{p:[27,22,6],l:[8,14,-14],z:'cloud',name:'Cloud e Data Center'},
    sol4:{p:[11,15,15],l:[0,6,0],z:'core',name:'SOC · Monitoramento'},
    sol5:{p:[2,10,30],l:[-11,4.5,13.5],z:'gov',name:'Leis · Governança'},
    why:{p:[-74,7,-30],l:[0,12,0],z:'dome',name:'Perímetro · escudo'},
    years:{p:[30,-12,0],l:[0,-16,0],z:'timeline',name:'Linha do tempo · 1999–2026',scrub:1},
    segs:{p:[30,-70,36],l:[0,-88,0],z:'district',name:'Distrito dos segmentos'},
    case0:{p:[-26,-113,18],l:[-40,-123,0],z:'case0',name:'Projeto · Mídia'},
    case1:{p:[-6,-113,18],l:[-20,-123,0],z:'case1',name:'Projeto · Fintech'},
    case2:{p:[14,-113,18],l:[0,-123,0],z:'case2',name:'Projeto · Saúde'},
    case3:{p:[34,-113,18],l:[20,-123,0],z:'case3',name:'Projeto · Varejo'},
    case4:{p:[54,-113,18],l:[40,-123,0],z:'case4',name:'Projeto · Certificação TPN'},
    partners:{p:[40,-146,32],l:[0,-160,0],z:'hub',name:'Hub de integrações',orbit:1},
    blog:{p:[-30,-186,30],l:[0,-196,0],z:'archive',name:'Arquivo de conteúdos'},
    contact:{p:[22,200,.01],l:[22,40,0],z:'logo',name:'A Pro Advanced'}};
  const TAGS={servers:['Infraestrutura','Servidores · rede · storage',[-15,6.2,-8]],gateway:['Cibersegurança','Escudo · firewall · SOC/MDR',[29,11.2,0]],
    backup:['Backup','Cofre · dados protegidos',[16,6.6,9]],cloud:['Cloud','Data center · híbrido',[8,17.5,-14]],core:['SOC','Monitoramento contínuo',[0,10.5,0]],
    gov:['Governança','LGPD · leis · compliance',[-13,8.7,13]],dome:['Escudo','Ameaças bloqueadas no perímetro',[0,31,0]],
    district:['Segmentos','12 setores atendidos',[0,-80,0]],hub:['Parceiros','Integrações tecnológicas',[0,-152,0]],archive:['Blog','Conteúdos e insights',[0,-186,0]],
    case0:['Case 01','Mídia e Entretenimento',[-40,-117,0]],case1:['Case 02','Fintechs',[-20,-117,0]],case2:['Case 03','Saúde',[0,-117,0]],case3:['Case 04','Varejo · LGPD',[20,-117,0]],case4:['Case 05','Certificação TPN',[40,-116,0]]};
  const LEVELS=[['Superfície',0],['Linha do tempo',-40],['Distrito',-88],['Projetos',-123],['Integrações',-160],['Arquivo',-196]];

  /* ---------- the world ---------- */
  function Structure(cv){
    const T=window.THREE;if(!T)return null;let R;
    const low=innerWidth<760;
    try{R=new T.WebGLRenderer({canvas:cv,antialias:!low,alpha:true})}catch(e){return null}
    R.setClearColor(0x000000,0);
    const scene=new T.Scene(),cam=new T.PerspectiveCamera(36,1,.1,900);scene.fog=new T.Fog(0x000c19,60,175);
    const CY=new T.Color('#68c5db'),BL=new T.Color('#2ba3db'),ST=new T.Color('#488ab7'),DP=new T.Color('#045089'),FILL=new T.Color('#08121f');
    const zones={};const Z=n=>zones[n]||(zones[n]={mats:[],op:1,target:1});
    const lm=(z,c,o)=>{const m=new T.LineBasicMaterial({color:c||BL,transparent:true,opacity:o||1,fog:true});m.userData.base=o||1;Z(z).mats.push(m);return m};
    const fill=new T.MeshBasicMaterial({color:FILL,transparent:true,opacity:.72,depthWrite:true,fog:true});
    function box(z,w,h,d,x,y,zz,c,o,parent){const g=new T.BoxGeometry(w,h,d);const m=new T.Mesh(g,fill);m.position.set(x,y+h/2,zz);
      m.add(new T.LineSegments(new T.EdgesGeometry(g),lm(z,c,o)));(parent||scene).add(m);return m}
    function solid(z,g,x,y,zz,c,o,parent){const m=new T.Mesh(g,fill);m.position.set(x,y,zz);m.add(new T.LineSegments(new T.EdgesGeometry(g),lm(z,c,o)));(parent||scene).add(m);return m}
    function line(z,pts,c,o,parent){const g=new T.BufferGeometry().setFromPoints(pts.map(p=>new T.Vector3(...p)));const l=new T.Line(g,lm(z,c,o));(parent||scene).add(l);return l}
    function segs(z,arr,c,o,parent){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(arr,3));const l=new T.LineSegments(g,lm(z,c,o));(parent||scene).add(l);return l}
    const circle=(r,y,n,a0,a1)=>{a0=a0||0;a1=a1===undefined?Math.PI*2:a1;const p=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;p.push([Math.cos(a)*r,y,Math.sin(a)*r])}return p};
    const grid=(z,cx,cy,cz,half,step,c,o)=>{const a=[];for(let i=-half;i<=half;i+=step){a.push(cx+i,cy,cz-half,cx+i,cy,cz+half,cx-half,cy,cz+i,cx+half,cy,cz+i)}return segs(z,a,c,o)};

    /* stars, like the live site background */
    {const n=low?500:1100,p=new Float32Array(n*3);for(let i=0;i<n;i++){const u=Math.random()*2-1,a=Math.random()*Math.PI*2,r=420+Math.random()*120,s=Math.sqrt(1-u*u);p[i*3]=Math.cos(a)*s*r;p[i*3+1]=u*r-60;p[i*3+2]=Math.sin(a)*s*r}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));scene.add(new T.Points(g,new T.PointsMaterial({color:0xc9d6e4,size:1.4,transparent:true,opacity:.55,fog:false,sizeAttenuation:false})))}

    /* ===== surface: the platform ===== */
    grid('ground',0,0,0,44,4,DP,.5);line('ground',circle(19,.02,96),ST,.35);line('ground',circle(24,.02,120),ST,.25);
    const core=new T.Group();scene.add(core);
    solid('core',new T.CylinderGeometry(3.1,3.6,9,6),0,4.5,0,CY,.95,core);solid('core',new T.CylinderGeometry(1.6,1.6,1.2,6),0,9.6,0,CY,.9,core);
    const radar=new T.Group();radar.position.y=10.3;core.add(radar);
    radar.add(new T.Line(new T.BufferGeometry().setFromPoints(circle(4.6,0,64).map(p=>new T.Vector3(...p))),lm('core',CY,.7)));
    {const sw=new T.Mesh(new T.CircleGeometry(4.6,24,0,.7),new T.MeshBasicMaterial({color:BL,transparent:true,opacity:.25,side:T.DoubleSide,depthWrite:false}));sw.rotation.x=-Math.PI/2;radar.add(sw);Z('core').mats.push(sw.material);sw.material.userData.base=.25}
    const bars=[];for(let i=0;i<3;i++){const a=i/3*Math.PI*2+.5,s=box('core',3.2,2,.15,Math.cos(a)*6.4,1.4,Math.sin(a)*6.4,BL,.6);s.lookAt(0,s.position.y,0);for(let k=0;k<5;k++)bars.push(box('core',.32,1,.05,-1.1+k*.55,-.9,.1,CY,.9,s))}
    for(let r=0;r<2;r++)for(let c=0;c<4;c++)box('servers',1.7,5.2,1.3,-19.5+c*2.6,0,-10+r*4,BL,.9);
    const leds=new T.Points(new T.BufferGeometry().setFromPoints((()=>{const p=[];for(let r=0;r<2;r++)for(let c=0;c<4;c++)for(let k=0;k<6;k++)p.push(new T.Vector3(-19.5+c*2.6-.5+(k%2)*.4,1+k*.7,-10+r*4+.68));return p})()),new T.PointsMaterial({color:CY,size:.28,transparent:true,opacity:.9,fog:true}));
    scene.add(leds);Z('servers').mats.push(leds.material);leds.material.userData.base=.9;
    /* backup: a vault with a thick door, combination wheel and bolts */
    box('backup',5.8,5.4,5.2,16,.5,9,BL,.95);for(const [fx,fz] of [[-2.4,-2.1],[2.4,-2.1],[-2.4,2.1],[2.4,2.1]])box('backup',.6,.5,.6,16+fx,0,9+fz,BL,.7);
    box('backup',4.4,4.2,.35,16,1.1,11.75,CY,.95);box('backup',3.6,3.4,.1,16,1.5,11.98,BL,.6);
    for(const y of [1.9,4.2])box('backup',.3,.7,.5,13.7,y,11.6,BL,.9);
    for(const [bx,by] of [[-1.5,1.5],[1.5,1.5],[-1.5,4.6],[1.5,4.6]]){const g=new T.CylinderGeometry(.16,.16,.4,10);const m=solid('backup',g,16+bx,by,12.1,CY,.9);m.rotation.x=Math.PI/2}
    const wheel=new T.Group();wheel.position.set(16,3.2,12.12);scene.add(wheel);
    wheel.add(new T.Line(new T.BufferGeometry().setFromPoints(circle(1.15,0,48).map(p=>new T.Vector3(p[0],p[2],0))),lm('backup',CY,1)));
    wheel.add(new T.Line(new T.BufferGeometry().setFromPoints(circle(.3,0,24).map(p=>new T.Vector3(p[0],p[2],0))),lm('backup',CY,1)));
    {const a=[];for(let i=0;i<6;i++){const an=i/6*Math.PI*2;a.push(Math.cos(an)*.3,Math.sin(an)*.3,0,Math.cos(an)*1.45,Math.sin(an)*1.45,0)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));wheel.add(new T.LineSegments(g,lm('backup',CY,1)))}
    const cloud=new T.Group();cloud.position.set(8,14,-14);scene.add(cloud);
    [[0,0,0,2.6],[2.6,-.4,.6,2],[-2.4,-.5,-.3,1.9],[.5,1.3,-.8,1.7]].forEach(([x,y,z,r])=>solid('cloud',new T.IcosahedronGeometry(r,1),x,y,z,BL,.75,cloud));
    {const l=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(8,11.5,-14),new T.Vector3(8,0,-14)]),new T.LineDashedMaterial({color:BL,dashSize:.5,gapSize:.5,transparent:true,opacity:.6}));l.computeLineDistances();scene.add(l);Z('cloud').mats.push(l.material);l.material.userData.base=.6}
    /* governance: the law — scales of justice beside a stack of law books */
    box('gov',3.2,.5,3.2,-13,0,13,BL,.9);box('gov',1.2,.6,1.2,-13,.5,13,BL,.9);solid('gov',new T.CylinderGeometry(.16,.2,7,10),-13,4.6,13,CY,.95);
    solid('gov',new T.SphereGeometry(.35,10,8),-13,8.25,13,CY,.95);
    const beam=new T.Group();beam.position.set(-13,7.9,13);scene.add(beam);box('gov',7.4,.18,.18,0,-.09,0,CY,1,beam);
    const pans=[];for(const sx of [-3.5,3.5]){const pan=new T.Group();pan.position.set(sx,0,0);beam.add(pan);pans.push(pan);
      pan.add(new T.Line(new T.BufferGeometry().setFromPoints(circle(1.25,-3.2,40).map(p=>new T.Vector3(...p))),lm('gov',CY,1)));
      const d=new T.Mesh(new T.CylinderGeometry(1.25,.7,.35,24,1,true),fill);d.position.y=-3.35;d.add(new T.LineSegments(new T.EdgesGeometry(new T.CylinderGeometry(1.25,.7,.35,24,1,true),30),lm('gov',BL,.8)));pan.add(d);
      const a=[];for(let k=0;k<3;k++){const an=k/3*Math.PI*2;a.push(0,0,0,Math.cos(an)*1.2,-3.2,Math.sin(an)*1.2)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));pan.add(new T.LineSegments(g,lm('gov',BL,.8)))}
    [[2.2,.9,3.2,0,.06],[2,.8,3,0.9,-.08],[2.3,.85,3.1,1.7,.12]].forEach(([w,h,d,y,r])=>{const b=box('gov',w,h,d,-7.6,y,14.6,BL,.9);b.rotation.y=r;
      segs('gov',[-7.6-w/2+.3,y+.1,14.6+d/2+.01,-7.6-w/2+.3,y+h-.1,14.6+d/2+.01,-7.6+w/2-.3,y+.1,14.6+d/2+.01,-7.6+w/2-.3,y+h-.1,14.6+d/2+.01],CY,.7)});
    /* Cibersegurança: a shield standing on the perimeter, guarded by a rotating ring */
    box('gateway',4.4,1,3,29,0,0,BL,.9);
    const shieldG=new T.Group();shieldG.position.set(29,6.3,0);shieldG.rotation.y=Math.PI/2;scene.add(shieldG);
    {const sh=new T.Shape();sh.moveTo(0,4.3);sh.quadraticCurveTo(2.3,3.7,3.6,3.5);sh.lineTo(3.6,.6);sh.quadraticCurveTo(3.5,-2.7,0,-4.4);sh.quadraticCurveTo(-3.5,-2.7,-3.6,.6);sh.lineTo(-3.6,3.5);sh.quadraticCurveTo(-2.3,3.7,0,4.3);
      const g=new T.ExtrudeGeometry(sh,{depth:.8,bevelEnabled:false,curveSegments:16});g.translate(0,0,-.4);const m=new T.Mesh(g,fill);m.add(new T.LineSegments(new T.EdgesGeometry(g,25),lm('gateway',CY,1)));shieldG.add(m);
      const inner=sh.getPoints(40).map(p=>new T.Vector3(p.x*.76,p.y*.76-.1,.42));shieldG.add(new T.Line(new T.BufferGeometry().setFromPoints(inner),lm('gateway',BL,.9)));
      shieldG.add(new T.Line(new T.BufferGeometry().setFromPoints([[-1.6,.1,.45],[-.4,-1.2,.45],[1.9,1.5,.45]].map(p=>new T.Vector3(...p))),lm('gateway',CY,1)))}
    const halo=new T.Group();shieldG.add(halo);
    {const a=[];for(let i=0;i<12;i++){const a0=i/12*Math.PI*2,a1=a0+Math.PI*2/12*.62;for(let k=0;k<6;k++){const u0=a0+(a1-a0)*k/6,u1=a0+(a1-a0)*(k+1)/6;a.push(Math.cos(u0)*5.8,Math.sin(u0)*5.8,0,Math.cos(u1)*5.8,Math.sin(u1)*5.8,0)}}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));halo.add(new T.LineSegments(g,lm('gateway',CY,.85)))}
    const eps=[];
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2+.13,r=19;const b=box('endpoints',.8,.8,2.2,Math.cos(a)*r,0,Math.sin(a)*r,BL,.85);b.rotation.y=-a+Math.PI/2;eps.push(b);
      segs('links',[Math.cos(a)*3.6,.4,Math.sin(a)*3.6,Math.cos(a)*(r-1.2),.4,Math.sin(a)*(r-1.2)],BL,.22)}
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,r=24;const b=box('endpoints',.6,.5,1.3,Math.cos(a)*r,0,Math.sin(a)*r,ST,.7);b.rotation.y=-a+Math.PI/2}
    const PR=29;const fwU={uT:{value:0},uOp:{value:1}};
    {const p=[],ang=[];for(let i=0;i<120;i++){const a=i/120*Math.PI*2;if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<.16)continue;p.push(Math.cos(a)*PR,0,Math.sin(a)*PR,Math.cos(a)*PR,4.2,Math.sin(a)*PR);ang.push(a,a)}
      const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('aA',new T.Float32BufferAttribute(ang,1));
      scene.add(new T.LineSegments(g,new T.ShaderMaterial({uniforms:fwU,transparent:true,depthWrite:false,vertexShader:'attribute float aA;varying float vA;void main(){vA=aA;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader:'uniform float uT,uOp;varying float vA;void main(){float w=pow(.5+.5*sin(vA*3.-uT*1.6),10.);gl_FragColor=vec4(vec3(.17,.64,.86),(.3+.7*w)*uOp);}'})));Z('perimeter').fw=fwU}
    line('perimeter',circle(PR,4.2,160),BL,.6);line('perimeter',circle(PR,0,160),BL,.35);
    /* the dome (flattens into the logo at the end) */
    const domeG=new T.Group();scene.add(domeG);
    {const a=[],R2=31;for(let la=1;la<=8;la++){const ph=la/8*Math.PI/2,y=Math.cos(ph)*R2,r=Math.sin(ph)*R2;for(let i=0;i<64;i++){const a0=i/64*Math.PI*2,a1=(i+1)/64*Math.PI*2;a.push(Math.cos(a0)*r,y,Math.sin(a0)*r,Math.cos(a1)*r,y,Math.sin(a1)*r)}}
      for(let lo=0;lo<24;lo++){const th=lo/24*Math.PI*2;for(let k=0;k<16;k++){const p0=k/16*Math.PI/2,p1=(k+1)/16*Math.PI/2;a.push(Math.cos(th)*Math.sin(p0)*R2,Math.cos(p0)*R2,Math.sin(th)*Math.sin(p0)*R2,Math.cos(th)*Math.sin(p1)*R2,Math.cos(p1)*R2,Math.sin(th)*Math.sin(p1)*R2)}}
      segs('dome',a,BL,.5,domeG)}
    const logoM=new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,fog:false});
    const logo=new T.Mesh(new T.PlaneGeometry(65,65*163/660),logoM);logo.rotation.x=-Math.PI/2;logo.position.set(65*.3765,40,0);scene.add(logo);
    new T.TextureLoader().load(LOGO3D,tx=>{tx.anisotropy=Math.min(8,R.capabilities.getMaxAnisotropy());logoM.map=tx;logoM.needsUpdate=true});

    /* ===== the data shaft: everything below hangs off it ===== */
    segs('shaft',[-1.2,0,-1.2,-1.2,-206,-1.2,1.2,0,1.2,1.2,-206,1.2,-1.2,0,1.2,-1.2,-206,1.2,1.2,0,-1.2,1.2,-206,-1.2],DP,.9);
    grid('ground',0,-.3,0,44,8,DP,.25);

    /* ===== level 1: the time tower (1999 → 2026) ===== */
    const years=[];for(let i=0;i<28;i++){const y=-12-i*2,r=4+i*.36;const l=line('timeline',circle(r,y,72),i%5===0||i===27?CY:BL,.9);years.push(l);
}
    /* ===== level 2: the district of segments ===== */
    grid('district',0,-92,0,24,3,DP,.5);
    const blocks=[];const HS=[6,9,4,7,5,8,10,4,6,7,5,9];
    for(let i=0;i<12;i++){const cx=-13.5+(i%4)*9,cz=-9+Math.floor(i/4)*9;const b=box('district',4.6,HS[i],4.6,cx,-92,cz,BL,.9);blocks.push(b);
      const t=box('district',1.6,.5,1.6,cx,-92+HS[i],cz,CY,.9)}
    /* ===== level 3: corridor of projects (one scale model per case) ===== */
    const CX=[-40,-20,0,20,40],CYv=-126;
    CX.forEach((x,i)=>{segs('case'+i,[x-6,CYv,-6,x+6,CYv,-6,x+6,CYv,-6,x+6,CYv,6,x+6,CYv,6,x-6,CYv,6,x-6,CYv,6,x-6,CYv,-6],BL,.7)});
    segs('corridor',[-48,CYv,-8,48,CYv,-8,-48,CYv,8,48,CYv,8],DP,.6);
    // 0 media: racks + broadcast mast
    for(let k=0;k<3;k++)box('case0',1.6,4.5,1.2,-43+k*2.2,CYv,-1.5,BL,.9);box('case0',.3,8,.3,-36.5,CYv,1.5,CY,.9);
    [1.2,2.2,3.2].forEach(r=>line('case0',circle(r,0,24,-.9,.9).map(p=>[-36.5+p[0],CYv+7.5+p[2]*0,1.5+p[2]]),CY,.8));
    // 1 fintech: vault + shield ring
    solid('case1',new T.CylinderGeometry(3,3,4,24),-20,CYv+2,0,BL,.9);line('case1',circle(4.6,CYv+1,64).map(p=>[p[0]-20,p[1],p[2]]),CY,.8);line('case1',circle(4.6,CYv+3.5,64).map(p=>[p[0]-20,p[1],p[2]]),CY,.5);
    // 2 health/security: monitor wall + scan ring
    for(let k=0;k<3;k++){const s=box('case2',3.2,2.2,.2,-3.4+k*3.4,CYv+1.2,-1,BL,.9);s.rotation.y=(k-1)*-.3}
    const scan=line('case2',circle(5,0,64).map(p=>[p[0],CYv+.2,p[2]]),CY,.9);
    // 3 retail/LGPD: document stacks + check
    for(let s=0;s<3;s++)for(let k=0;k<4;k++)box('case3',2.4,.18,3.2,16+s*3.2,CYv+k*.55,0,BL,.85);
    segs('case3',[18,CYv+3,-1,19,CYv+3,0,19,CYv+3,0,21,CYv+3,-2.2],CY,1);
    // 4 TPN certification: badge on a pedestal
    box('case4',3,2,3,40,CYv,0,BL,.9);const badge=new T.Group();badge.position.set(40,CYv+5.6,0);scene.add(badge);
    badge.add(new T.Line(new T.BufferGeometry().setFromPoints(circle(2.6,0,48).map(p=>new T.Vector3(p[0],p[2],0))),lm('case4',CY,1)));
    badge.add(new T.Line(new T.BufferGeometry().setFromPoints(circle(2,0,48).map(p=>new T.Vector3(p[0],p[2],0))),lm('case4',BL,.8)));
    badge.add(new T.Line(new T.BufferGeometry().setFromPoints([[-1,0,0],[-.2,-.8,0],[1.2,.9,0]].map(p=>new T.Vector3(...p))),lm('case4',CY,1)));
    /* ===== level 4: integration hub (22 partners) ===== */
    const hub=new T.Group();hub.position.y=-160;scene.add(hub);
    solid('hub',new T.CylinderGeometry(2.6,2.6,10,12),0,0,0,BL,.95,hub);
    for(let i=0;i<22;i++){const ring=i%2,a=i/22*Math.PI*2,r=ring?20:14,y=ring?2.5:-2.5;const n=box('hub',1.4,1.4,1.4,Math.cos(a)*r,y-.7,Math.sin(a)*r,i%3?BL:CY,.9,hub);
      segs('hub',[0,y,0,Math.cos(a)*r,y,Math.sin(a)*r],DP,.8,hub)}
    line('hub',circle(14,-2.5,96),ST,.4,hub);line('hub',circle(20,2.5,120),ST,.4,hub);
    /* ===== level 5: archive of contents ===== */
    for(let row=0;row<3;row++)for(let k=0;k<9;k++){const on=row===1&&k>=1&&k<=6;box('archive',.25,6,4,-16+k*4,-200,-10+row*10,on?CY:BL,on?1:.55)}
    grid('archive',0,-200,0,24,4,DP,.4);

    /* data packets: links on the surface, replication arcs, and down the shaft */
    const curves=[];const v3=new T.Vector3();
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2+.13;curves.push(new T.LineCurve3(new T.Vector3(Math.cos(a)*3.6,.4,Math.sin(a)*3.6),new T.Vector3(Math.cos(a)*17.8,.4,Math.sin(a)*17.8)))}
    const arc=(a,b,h)=>new T.QuadraticBezierCurve3(new T.Vector3(...a),new T.Vector3((a[0]+b[0])/2,h,(a[2]+b[2])/2),new T.Vector3(...b));
    [arc([-15,5.4,-8],[16,4.4,9],15),arc([0,9,0],[16,4.4,9],12),arc([-15,5.4,-8],[0,9,0],11),arc([0,10,0],[8,11.4,-14],14),arc([-12,4,13],[0,9,0],9),arc([0,9,0],[29,9.5,0],14)].forEach(c=>{curves.push(c);
      scene.add(new T.Line(new T.BufferGeometry().setFromPoints(c.getPoints(48)),lm('links',BL,.35)))});
    for(let k=0;k<4;k++)curves.push(new T.LineCurve3(new T.Vector3(k<2?-1.2:1.2,0,k%2?1.2:-1.2),new T.Vector3(k<2?-1.2:1.2,-204,k%2?1.2:-1.2)));
    const NPK=low?70:150,pk=new Float32Array(NPK*3),pkS=[];for(let i=0;i<NPK;i++)pkS.push({c:i%curves.length,t:Math.random(),v:(i%curves.length)>=curves.length-4?.05+Math.random()*.05:.12+Math.random()*.3});
    const pkG=new T.BufferGeometry();pkG.setAttribute('position',new T.BufferAttribute(pk,3));scene.add(new T.Points(pkG,new T.PointsMaterial({color:0xffffff,size:.26,transparent:true,opacity:.9,fog:true})));
    /* threats break on the shield */
    const NT=low?40:80,th=new Float32Array(NT*3),thS=[];const rnd=()=>{const a=Math.random()*Math.PI*2,e=Math.random()*.9+.1;return new T.Vector3(Math.cos(a)*Math.cos(e),Math.sin(e),Math.sin(a)*Math.cos(e))};
    for(let i=0;i<NT;i++)thS.push({d:rnd(),r:40+Math.random()*40,v:6+Math.random()*8});
    const thG=new T.BufferGeometry();thG.setAttribute('position',new T.BufferAttribute(th,3));const thM=new T.PointsMaterial({color:0xc9d6e4,size:.32,transparent:true,opacity:0,fog:true});scene.add(new T.Points(thG,thM));
    const hits=[];for(let i=0;i<10;i++){const m=new T.Mesh(new T.RingGeometry(.35,.45,24),new T.MeshBasicMaterial({color:CY,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false}));m.visible=false;scene.add(m);hits.push({m,t:9})}
    let hitI=0;

    const cur={p:new T.Vector3(120,90,130),l:new T.Vector3(0,0,0)},tgt={p:new T.Vector3(),l:new T.Vector3()};
    let view='hero',focus=null,mx=0,my=0,tmx=0,tmy=0,yrsP=0,yrsT=0,flatP=0,flatT=0,segOn=-1,run=true;
    function size(){const w=innerWidth,h=innerHeight;R.setPixelRatio(Math.min(low?1.25:1.6,devicePixelRatio||1));R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<h?52:36;
      if(w>900)cam.setViewOffset(w,h,-w*.19,0,w,h);else cam.clearViewOffset();cam.updateProjectionMatrix()}
    size();addEventListener('resize',size);
    addEventListener('pointermove',e=>{tmx=e.clientX/innerWidth-.5;tmy=e.clientY/innerHeight-.5},{passive:true});
    document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run){last=performance.now();requestAnimationFrame(loop)}});

    const tagsEl=$('#px-tags'),tagEls={};
    Object.keys(TAGS).forEach(k=>{const d=document.createElement('div');d.className='tag';d.innerHTML='<svg width="46" height="46"><path d="M0 46 L30 16 H46" fill="none" stroke="rgba(43,163,219,.8)" stroke-width="1"/></svg><i></i><span><small>'+TAGS[k][1]+'</small>'+TAGS[k][0]+'</span>';tagsEl&&tagsEl.append(d);tagEls[k]=d});
    /* mini-map: surface plan on the left, depth gauge on the right */
    const mc=$('#px-map'),mx2=mc&&mc.getContext('2d'),ml=$('#px-mapl');
    const ZPOS={servers:[-15,-8],gateway:[29,0],backup:[16,9],cloud:[8,-14],core:[0,0],gov:[-12,13]};
    function drawMap(){if(!mx2)return;const S=260,c=105,k=95/34;mx2.clearRect(0,0,S,S);mx2.lineWidth=1.5;
      const surf=cur.l.y>-6;mx2.globalAlpha=surf?1:.35;
      mx2.strokeStyle='rgba(43,163,219,.6)';mx2.beginPath();mx2.arc(c,130,PR*k,0,7);mx2.stroke();
      for(let i=0;i<12;i++){const a=i/12*Math.PI*2+.13;mx2.fillStyle='rgba(201,214,228,.45)';mx2.fillRect(c+Math.cos(a)*19*k-3,130+Math.sin(a)*19*k-3,6,6)}
      Object.entries(ZPOS).forEach(([z,[x,y]])=>{const on=focus===z;mx2.fillStyle=on?'#68c5db':'rgba(201,214,228,.55)';const s=on?16:11;mx2.fillRect(c+x*k-s/2,130+y*k-s/2,s,s);if(on){mx2.strokeStyle='#68c5db';mx2.strokeRect(c+x*k-s,130+y*k-s,s*2,s*2)}});
      if(surf){const px=c+clamp(-36,36,cur.p.x)*k,py=130+clamp(-36,36,cur.p.z)*k,lx=c+cur.l.x*k,ly=130+cur.l.z*k,ang=Math.atan2(ly-py,lx-px);
        mx2.fillStyle='rgba(43,163,219,.25)';mx2.beginPath();mx2.moveTo(px,py);mx2.arc(px,py,60,ang-.38,ang+.38);mx2.closePath();mx2.fill();mx2.fillStyle='#fff';mx2.beginPath();mx2.arc(px,py,6,0,7);mx2.fill()}
      mx2.globalAlpha=1;const gx=238,gy=(y)=>20+(-clamp(-206,0,y))/206*220;
      mx2.strokeStyle='rgba(43,163,219,.5)';mx2.beginPath();mx2.moveTo(gx,20);mx2.lineTo(gx,240);mx2.stroke();
      LEVELS.forEach(([n,y])=>{mx2.fillStyle='rgba(201,214,228,.5)';mx2.fillRect(gx-6,gy(y)-1,12,2)});
      mx2.fillStyle='#68c5db';mx2.fillRect(gx-9,gy(Math.min(0,cur.l.y))-5,18,10)}

    let last=performance.now();const t0=last;
    function loop(now){if(!run)return;requestAnimationFrame(loop);const dt=Math.min(.1,(now-last)/1000);last=now;const t=(now-t0)/1000;
      const V=VIEWS[view];const e=1-Math.exp(-dt*1.8);
      tgt.p.set(...V.p);tgt.l.set(...V.l);
      if(V.orbit){const a=t*.05,c=Math.cos(a),s=Math.sin(a),x=tgt.p.x,z=tgt.p.z;tgt.p.x=x*c-z*s;tgt.p.z=x*s+z*c}
      if(V.scrub){yrsP+=(yrsT-yrsP)*(1-Math.exp(-dt*4));const yy=-12-yrsP*54,a=yrsP*Math.PI*1.2;tgt.l.set(0,yy-2,0);tgt.p.set(Math.cos(a)*30,yy+4,Math.sin(a)*30)}
      cur.p.lerp(tgt.p,e);cur.l.lerp(tgt.l,e);mx+=(tmx-mx)*.04;my+=(tmy-my)*.04;
      cam.position.copy(cur.p);if(view!=='contact'){cam.position.x+=mx*4;cam.position.y-=my*3}cam.lookAt(cur.l);
      scene.fog.far+=((view==='contact'?420:175)-scene.fog.far)*(1-Math.exp(-dt*2));
      for(const k in zones){const zz=zones[k];
        if(!focus)zz.target=k==='dome'?(view==='hero'?.85:.22):k==='timeline'?.15:.75;
        else if(focus==='logo')zz.target=k==='dome'?.9*(1-flatP*.85):(k==='ground'||k==='endpoints'||k==='core'||k==='perimeter')?.45:.1;
        else zz.target=(k===focus||k==='ground'||k==='shaft'||(focus==='dome'&&k==='perimeter')||(focus.startsWith('case')&&k==='corridor'))?1:k==='links'?.5:.22;
        zz.op+=(zz.target-zz.op)*(1-Math.exp(-dt*3));zz.mats.forEach(m=>m.opacity=m.userData.base*zz.op);if(zz.fw)zz.fw.uOp.value=zz.op}
      fwU.uT.value=t;radar.rotation.y=-t*1.4;cloud.rotation.y=Math.sin(t*.3)*.15;cloud.position.y=14+Math.sin(t*.8)*.4;hub.rotation.y=t*.08;badge.rotation.y=t*.6;
      bars.forEach((b,i)=>{b.scale.y=.4+.6*Math.abs(Math.sin(t*1.7+i*1.3))});
      shieldG.rotation.y=Math.PI/2+Math.sin(t*.6)*.22;halo.rotation.z=t*.7;wheel.rotation.z=Math.sin(t*.9)*1.4;
      beam.rotation.z=Math.sin(t*.8)*.1;pans.forEach(p=>p.rotation.z=-beam.rotation.z);
      scan.scale.setScalar(.4+((t*.5)%1)*.9);scan.material.opacity=scan.material.userData.base*zones.case2.op*(1-((t*.5)%1));
      leds.material.opacity=leds.material.userData.base*zones.servers.op*(.55+.45*Math.sin(t*9));
      eps.forEach((b,i)=>b.scale.setScalar(1));
      blocks.forEach((b,i)=>{const on=focus==='district'&&(segOn<0?(Math.floor(t*1.5)%12===i):segOn===i);b.scale.y+=((on?1.25:1)-b.scale.y)*.1;b.children[0].material.opacity=b.children[0].material.userData.base*zones.district.op*(on?1.6:1)});
      /* time tower lights ring by ring */
      const lit=Math.floor((view==='years'?yrsP:view==='segs'||view.startsWith('case')||view==='partners'||view==='blog'?1:0)*28);
      years.forEach((l,i)=>{l.material.opacity=l.material.userData.base*zones.timeline.op*(i<lit?1:.25)});
      /* the dome rises, flattens and becomes the logo */
      flatP+=(flatT-flatP)*(1-Math.exp(-dt*3));const f=flatP,ks=1-f*(1-8/31);domeG.scale.set(ks,Math.max(.012,1-f),ks);domeG.position.y=f*40;
      logoM.opacity=innerWidth>900?clamp(0,1,(f-.55)/.4):0;
      for(let i=0;i<NPK;i++){const s=pkS[i];s.t=(s.t+s.v*dt)%1;curves[s.c].getPoint(s.t,v3);pk[i*3]=v3.x;pk[i*3+1]=v3.y;pk[i*3+2]=v3.z}pkG.attributes.position.needsUpdate=true;
      const thOn=view==='why';thM.opacity+=((thOn?.95:view==='hero'?.2:0)-thM.opacity)*(1-Math.exp(-dt*3));
      for(let i=0;i<NT;i++){const s=thS[i];s.r-=s.v*dt*(thOn?1.6:.7);if(s.r<31.2){const h=hits[hitI++%hits.length];h.m.position.copy(s.d).multiplyScalar(31.2);h.m.lookAt(0,0,0);h.m.visible=true;h.t=0;s.d=rnd();s.r=60+Math.random()*30}
        th[i*3]=s.d.x*s.r;th[i*3+1]=s.d.y*s.r;th[i*3+2]=s.d.z*s.r}thG.attributes.position.needsUpdate=true;
      hits.forEach(h=>{if(h.t>1.2){h.m.visible=false;return}h.t+=dt;const k=h.t/1.2;h.m.scale.setScalar(1+k*2.2);h.m.material.opacity=(1-k)*.45*(thOn?1:0)});
      R.render(scene,cam);
      for(const k in tagEls){const el=tagEls[k],on=k===focus&&innerWidth>900;el.classList.toggle('on',on);if(!on)continue;v3.set(...TAGS[k][2]).project(cam);
        el.style.transform='translate('+((v3.x*.5+.5)*innerWidth).toFixed(1)+'px,'+((-v3.y*.5+.5)*innerHeight).toFixed(1)+'px)'}
      drawMap();
    }
    requestAnimationFrame(loop);
    const mapBox=$('.px .map');mapBox&&mapBox.classList.add('off');
    return{set(v){if(!VIEWS[v]||v===view)return;view=v;focus=VIEWS[v].z;if(ml)ml.textContent=VIEWS[v].name;mapBox&&mapBox.classList.toggle('off',v==='hero')},years(p){yrsT=p},flat(p){flatT=p},seg(i){segOn=i}};
  }

  const HAS=!!(window.gsap&&window.ScrollTrigger);
  const loader=document.querySelector('.px-load');
  function done(){root.classList.remove('px-preload');loader&&loader.remove()}
  const S=reduce?null:Structure($('#px-scene'));

  /* lists that drive the camera */
  const sl=$$('#px-sl li'),cl=$$('#px-cl a');
  function setSol(i){sl.forEach((l,k)=>l.classList.toggle('on',k===i));S&&S.set('sol'+i)}
  function setCase(i){cl.forEach((l,k)=>l.classList.toggle('on',k===i));S&&S.set('case'+i)}
  sl.forEach((l,i)=>l.addEventListener('pointerenter',()=>setSol(i)));
  cl.forEach((l,i)=>l.addEventListener('pointerenter',()=>setCase(i)));
  $$('#px-sg a[data-i]').forEach(a=>{a.addEventListener('pointerenter',()=>S&&S.seg(+a.dataset.i));a.addEventListener('pointerleave',()=>S&&S.seg(-1))});

  if(!HAS||reduce){done();return}
  gsap.registerPlugin(ScrollTrigger);
  const EO='expo.out';

  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.2,wheelMultiplier:.9});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const tg=id==='#top'?0:document.querySelector(id);if(tg===null||!lenis)return;e.preventDefault();lenis.scrollTo(tg,{offset:0,duration:1.8})}));

  /* chapters → camera */
  $$('[data-view]').forEach(sec=>{const v=sec.dataset.view,n=+sec.dataset.n||0;
    if(n){const fn=v==='sol'?setSol:setCase;
      /* natural scroll: the item crossing the middle of the screen is the active one, nothing changes height */
      const items=v==='sol'?sl:cl;
      const pick=()=>{const y=innerHeight*.62;let k=0;items.forEach((it,i)=>{if(it.getBoundingClientRect().top<=y)k=i});fn(k)};
      ScrollTrigger.create({trigger:sec,start:'top 62%',end:'bottom 38%',onUpdate:pick,onToggle:s=>s.isActive&&pick()});}
    else ScrollTrigger.create({trigger:sec,start:'top 55%',end:'bottom 45%',onToggle:s=>s.isActive&&S&&S.set(v)})});
  const ct=$('#contato');if(ct)ScrollTrigger.create({trigger:ct,start:'top 75%',end:'top 5%',scrub:true,onUpdate:s=>S&&S.flat(s.progress),onLeaveBack:()=>S&&S.flat(0)});
  const yrs=$('[data-view="years"]');if(yrs)ScrollTrigger.create({trigger:yrs,start:'top 70%',end:'center 40%',scrub:true,onUpdate:s=>{S&&S.years(s.progress);const tl=$('#px-tl');tl&&tl.style.setProperty('--p',s.progress)}});
  /* whichever chapter holds the reading line is the one in view (re-checked whenever layout changes) */
  function syncView(){if(!S)return;const y=innerHeight*.55;let cur=null;
    $$('[data-view]').forEach(sec=>{const r=sec.getBoundingClientRect();if(r.top<=y&&r.bottom>y)cur=sec});
    if(!cur){S.set('hero');return}const v=cur.dataset.view,n=+cur.dataset.n||0;
    if(n){const items=v==='sol'?sl:cl,fn=v==='sol'?setSol:setCase;let k=0;items.forEach((it,i)=>{if(it.getBoundingClientRect().top<=innerHeight*.62)k=i});fn(k)}else S.set(v)}
  ScrollTrigger.addEventListener('refresh',syncView);
  /* content that loads later (the RD form) changes heights: re-measure the scroll positions */
  if('ResizeObserver' in window){let rt=0,lastH=0;new ResizeObserver(()=>{const h=document.documentElement.scrollHeight;if(Math.abs(h-lastH)<4)return;lastH=h;clearTimeout(rt);rt=setTimeout(()=>ScrollTrigger.refresh(),150)}).observe($('main')||page)}
  S&&S.set('hero');

  /* intro */
  const intro=gsap.timeline({paused:true});
  intro.from('.px .top',{yPercent:-100,duration:1,ease:EO,clearProps:'transform'},0)
    .from('.px .map',{opacity:0,y:20,duration:1,ease:EO},.6);
  [['.px .hero .lab',{opacity:0,x:-20,duration:1,ease:EO},.15],['#px-h1',{y:50,opacity:0,duration:1.4,ease:EO},.2],['.px .hero .lead',{y:24,opacity:0,duration:1,ease:EO},.45],
   ['.px .hero .acts>*',{y:24,opacity:0,duration:1,ease:EO,stagger:.08},.55],['.px .hero .meta>span',{y:20,opacity:0,duration:.9,ease:EO,stagger:.08},.7],
   ['.px .hero .ticks li',{x:-24,opacity:0,duration:.9,ease:EO,stagger:.08},.6],['.px .hero .fbox',{y:60,opacity:0,duration:1.2,ease:EO,clearProps:'transform'},.4]].forEach(([s,v,at])=>{if(page.querySelector(s))intro.from(s,v,at)});
  intro.add(()=>$$('.px .hero [data-count]').forEach(b=>{const o={v:0},n=+b.dataset.count;gsap.to(o,{v:n,duration:1.6,ease:'power2.out',onUpdate(){b.textContent=Math.round(o.v)}})}),.7);
  if(root.classList.contains('px-preload')&&loader){
    lenis&&lenis.stop();const pct=document.getElementById('px-lpct'),bar=document.getElementById('px-lbar'),ls=[...document.querySelectorAll('#px-lls span')],o={p:0};
    gsap.timeline({onComplete:()=>{done();lenis&&lenis.start();ScrollTrigger.refresh()}})
      .to(o,{p:1,duration:1.8,ease:'power2.inOut',onUpdate(){pct.textContent=String(Math.round(o.p*100)).padStart(2,'0')+'%';bar.style.transform='scaleX('+o.p+')';ls.forEach((s,i)=>s.classList.toggle('ok',o.p>(i+1)/(ls.length+.4)))}})
      .to(loader,{opacity:0,duration:.5,ease:'power2.in'},'+=.2')
      .add(()=>intro.play(),'-=.3');
  }else{done();intro.play()}

  /* reading: headings wipe in, lists rise */
  $$('.px main .ch h2').forEach(h=>gsap.fromTo(h,{clipPath:'inset(0 100% 0 0)',x:-24},{clipPath:'inset(0 0% 0 0)',x:0,duration:1.3,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 82%'}}));
  $$('.px main .ch:not(.hero) .lab,.px main .ch:not(.hero) .lead').forEach(l=>gsap.from(l,{opacity:0,y:20,duration:1,ease:EO,scrollTrigger:{trigger:l,start:'top 90%'}}));
  const batch=(sel,v)=>ScrollTrigger.batch(sel,{start:'top 94%',once:true,onEnter:b=>gsap.from(b,Object.assign({opacity:0,duration:.9,ease:EO,stagger:.05,clearProps:'transform,opacity'},v))});
  batch('.px .sl li',{x:-30});batch('.px .rl>div',{y:40});batch('.px .sg a',{y:24});batch('.px .cl a',{x:-30});batch('.px .bl a',{y:30});
  gsap.from('.px .logos>div',{opacity:0,duration:.8,ease:'power2.out',stagger:{each:.03,from:'random'},scrollTrigger:{trigger:'.px .logos',start:'top 88%'}});
  page.querySelector('.px #contato .fbox')&&gsap.from('.px #contato .fbox',{y:60,opacity:0,duration:1.2,ease:EO,clearProps:'transform',scrollTrigger:{trigger:'.px #contato .fbox',start:'top 92%'}});
  ScrollTrigger.refresh();
})();
