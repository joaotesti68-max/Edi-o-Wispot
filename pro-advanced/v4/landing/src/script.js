/* Pro Advanced · v4 "Campo de Dados": one pixel field that carries the page. Data flows as traffic and
   reorganises into the shape each section needs (solution icons, shield, 27, the Pro symbol).
   GSAP/ScrollTrigger/Lenis drive the page; everything stays readable without them. */
(function(){
  const page=document.getElementById('px');if(!page)return;
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $=s=>page.querySelector(s),$$=s=>[...page.querySelectorAll(s)];
  const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));
  const GLYPHS='ABCDEF0123456789#%&*/<>';

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
    const showFb=()=>{if(!host.children.length){host.hidden=true;fb.hidden=false}};
    try{const s=document.createElement('script');s.src='https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';s.async=true;
      s.onload=()=>{try{new RDStationForms('gmk-forms-home-f6a9607991fe0a26527a','null').createForm()}catch(e){}setTimeout(showFb,2500)};s.onerror=showFb;document.head.appendChild(s)}catch(e){showFb()}
    setTimeout(showFb,6000);
    fb.addEventListener('submit',e=>{e.preventDefault();const msg=fb.querySelector('.msg');const miss=[...fb.querySelectorAll('[required]')].find(i=>!i.value.trim());
      if(miss){msg.textContent='Preencha os campos marcados com *.';miss.focus();return}
      msg.textContent='Prévia: o formulário oficial do RD Station aparece aqui na página publicada. Enquanto isso, escreva para contato@proadvanced.com.br.'});
  })();

  /* ---------- shapes, sampled on a pixel grid ---------- */
  const ICONS=[
    'M10 8h34a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zM10 30h34a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V32a2 2 0 0 1 2-2zM14 15h5M14 37h5M27 22v8',
    'M27 5 46 12v13c0 13-8 21-19 25C16 46 8 38 8 25V12zM19 27l6 6 11-12',
    'M10 27a17 17 0 0 1 29-12l4 4M43 9v10H33M44 27a17 17 0 0 1-29 12l-4-4M11 45V35h10',
    'M15 40h26a10 10 0 0 0 1-20 14 14 0 0 0-27-3A11 11 0 0 0 15 40zM27 30v14M21 38l6 6 6-6',
    'M7 9h40a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2zM11 30l9-9 7 6 8-10 8 7M19 47h16M27 39v8',
    'M13 6h28a2 2 0 0 1 2 2v38a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM18 17h18M18 26h18M18 35h11M33 38l4 4 7-8'];
  function sample(gw,gh,draw,dither){const c=document.createElement('canvas');c.width=gw;c.height=gh;const x=c.getContext('2d');draw(x,gw,gh);
    const a=x.getImageData(0,0,gw,gh).data,pts=[];
    for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const v=a[(j*gw+i)*4+3];if(v>110)pts.push([(i+.5)/gw,(j+.5)/gh,1]);else if(dither&&v>20&&(i+j*2)%3===0)pts.push([(i+.5)/gw,(j+.5)/gh,.35])}
    for(let i=pts.length-1;i>0;i--){const k=Math.random()*(i+1)|0;[pts[i],pts[k]]=[pts[k],pts[i]]}
    return{pts,gw,gh}}
  const strokeIcon=d=>(x,w)=>{x.scale(w/54,w/54);x.strokeStyle='#fff';x.lineWidth=3.2;x.lineCap='round';x.lineJoin='round';x.stroke(new Path2D(d))};
  const SHAPES={};
  function buildShapes(){
    SHAPES.sol=ICONS.map(d=>sample(40,40,strokeIcon(d)));
    SHAPES.shield=sample(44,44,(x,w)=>{x.scale(w/54,w/54);const p=new Path2D('M27 4 47 11.5v13.5c0 13.5-8.5 22-20 26.5C15.5 47 7 38.5 7 25V11.5z');
      x.fillStyle='rgba(255,255,255,.3)';x.fill(p);x.strokeStyle='#fff';x.lineWidth=2.4;x.lineJoin='round';x.stroke(p);x.lineWidth=2.8;x.lineCap='round';x.stroke(new Path2D('M18.5 27.5l6 6 11.5-12.5'))},true);
    SHAPES['27']=sample(88,40,(x,w,h)=>{x.fillStyle='#fff';x.font='700 '+(h*1.12)+'px Montserrat, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('27',w/2,h*.56)});
  }
  const SYM='{{ICON_MASK}}';

  /* ---------- the field ---------- */
  function Field(cv){
    const x=cv.getContext('2d');const low=innerWidth<760;const N=low?1300:2600;
    let W,H,D;const P=[];let mx=-1e4,my=-1e4,lens=0,t0=performance.now(),run=true,boxes=[],active=null,solI=0,key='',scrollV=0,lastS=scrollY;
    function size(){D=Math.min(low?1.25:1.5,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0)}
    size();addEventListener('resize',size);
    for(let i=0;i<N;i++){const lane=Math.round(Math.random()*H/14)*14;
      P.push({x:W/2+(Math.random()-.5)*40,y:H/2+(Math.random()-.5)*40,tx:0,ty:0,x0:Math.random()*W,lane,sp:(18+Math.random()*90)*(Math.random()<.5?-1:1),
        k:.05+Math.random()*.07,r:Math.random(),wait:0,sz:2,tsz:2,a:0,ta:.3,w:1,pk:Math.random()<.035})}
    function setBoxes(){boxes=$$('.fxbox[data-shape]')}
    setBoxes();
    if(fine){addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});document.addEventListener('pointerleave',()=>{mx=my=-1e4})}
    document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run)requestAnimationFrame(loop)});
    const sym={shape:null};const im=new Image();im.onload=()=>{sym.shape=sample(48,48,(c,w,h)=>c.drawImage(im,0,0,w,h))};im.src=SYM;
    function pickActive(){let best=null,bd=1e9;
      for(const b of boxes){const r=b.getBoundingClientRect();if(r.width<4||r.bottom<0||r.top>H)continue;const d=Math.abs(r.top+r.height/2-H/2);
        if(d<bd&&d<H*.62){bd=d;best={el:b,r}}}
      return best}
    function shapeOf(el){const s=el.dataset.shape;return s==='sol'?SHAPES.sol&&SHAPES.sol[solI]:s==='symbol'?sym.shape:SHAPES[s]}
    let lastT=performance.now(),fpsN=0,fpsT=0;
    function loop(now){if(!run)return;requestAnimationFrame(loop);const t=(now-t0)/1000,dt=Math.min(.1,(now-lastT)/1000);lastT=now;fpsN++;fpsT+=dt;if(fpsT>1){window.__pxfps=fpsN;fpsN=0;fpsT=0}
      const sv=scrollY-lastS;lastS=scrollY;scrollV+=(sv-scrollV)*.2;
      const act=pickActive(),sh=act&&shapeOf(act.el);const k2=act?(act.el.dataset.shape+(act.el.dataset.shape==='sol'?solI:'')):'';
      if(k2!==key){key=k2;for(const p of P)p.wait=t+p.r*.45}
      const M=sh?sh.pts.length:0,cell=sh?act.r.width/sh.gw:0;
      lens+=((mx>-1e3?1:0)-lens)*(1-Math.exp(-dt*8));
      x.clearRect(0,0,W,H);
      const LR=110,LR2=LR*LR;let glyphs=[];
      for(let i=0;i<N;i++){const p=P[i];
        if(t>=p.wait){
          if(sh&&i<M){const q=sh.pts[i];p.tx=act.r.left+q[0]*act.r.width;p.ty=act.r.top+q[1]*sh.gh*cell;p.tsz=cell*.74;p.ta=q[2]*(.78+.22*Math.sin(t*1.6+p.r*30));p.w=q[2]}
          else{const span=W+60;let sx=((p.x0+t*p.sp*(1+Math.abs(scrollV)*.04))%span+span)%span-30;let ly=((p.lane-scrollY*.18)%(H+28)+H+28)%(H+28)-14;
            if(Math.abs(sx-p.x)>W*.5||Math.abs(ly-p.y)>H*.5){p.x=sx;p.y=ly}
            p.tx=sx;p.ty=ly;p.tsz=p.pk?2.6:1.8+p.r*1.2;p.ta=(sh?.12:.22)+p.r*(sh?.12:.25)+(p.pk?.5:0);p.w=1}}
        const e=1-Math.exp(-dt*(3.2+p.k*40)),e2=1-Math.exp(-dt*7);p.x+=(p.tx-p.x)*e;p.y+=(p.ty-p.y)*e;p.sz+=(p.tsz-p.sz)*e2;p.a+=(p.ta-p.a)*e2;
        let px=p.x,py=p.y;
        if(lens>.01){const dx=px-mx,dy=py-my,dd=dx*dx+dy*dy;if(dd<LR2){const d=Math.sqrt(dd)||1,f=(1-d/LR)*16*lens;px+=dx/d*f;py+=dy/d*f;glyphs.push([px,py,p,1-d/LR]);continue}}
        if(p.a<.02)continue;
        const inShape=sh&&i<M;
        x.fillStyle=inShape?(p.r>.86?'rgba(255,255,255,':p.r>.4?'rgba(104,197,219,':'rgba(43,163,219,')+p.a.toFixed(3)+')':p.pk?'rgba(104,197,219,'+p.a.toFixed(3)+')':'rgba(201,214,228,'+p.a.toFixed(3)+')';
        const s=p.sz;x.fillRect(px-s/2,py-s/2,s,s);
        if(p.pk&&!inShape){x.fillStyle='rgba(104,197,219,'+(p.a*.35).toFixed(3)+')';x.fillRect(px-(p.sp>0?18:-4),py-.5,14,1)}}
      /* inspection lens: data under the cursor shows as hexadecimal */
      if(glyphs.length){x.font='600 11px Montserrat, sans-serif';x.textAlign='center';x.textBaseline='middle';
        for(const [gx,gy,p,f] of glyphs){x.fillStyle='rgba(104,197,219,'+(.35+.65*f).toFixed(3)+')';x.fillText(GLYPHS[(p.r*97+t*6|0)%16],gx,gy)}}
      if(lens>.01){x.strokeStyle='rgba(104,197,219,'+(.35*lens).toFixed(3)+')';x.lineWidth=1;x.beginPath();x.arc(mx,my,LR,0,Math.PI*2);x.stroke();
        x.beginPath();for(const a of [0,1,2,3]){const c=Math.cos(a*Math.PI/2),s=Math.sin(a*Math.PI/2);x.moveTo(mx+c*(LR-8),my+s*(LR-8));x.lineTo(mx+c*(LR+8),my+s*(LR+8))}x.stroke()}
    }
    requestAnimationFrame(loop);
    return{setSol(i){solI=i},refresh:setBoxes}
  }

  /* decrypt effect: scrambled glyphs resolve into the text */
  function decrypt(el,dur){const nodes=[];const walk=n=>n.childNodes.forEach(c=>{if(c.nodeType===3&&c.textContent.trim())nodes.push([c,c.textContent]);else if(c.nodeType===1)walk(c)});walk(el);
    const total=nodes.reduce((s,n)=>s+n[1].length,0);const t0=performance.now();dur=dur||1100;
    el.setAttribute('aria-label',el.textContent);
    (function step(now){const p=clamp(0,1,(now-t0)/dur);let seen=0;
      for(const [n,txt] of nodes){let o='';for(let i=0;i<txt.length;i++){const ch=txt[i],q=(seen+i)/total;o+=(ch===' '||q<p*1.15-.15)?ch:GLYPHS[Math.random()*GLYPHS.length|0]}n.textContent=o;seen+=txt.length}
      if(p<1)requestAnimationFrame(step);else nodes.forEach(([n,txt])=>n.textContent=txt)})(t0)}

  const HAS=!!(window.gsap&&window.ScrollTrigger);
  const loader=document.querySelector('.px-load');
  function done(){root.classList.remove('px-preload');loader&&loader.remove()}
  const cv=$('#px-field');
  let field=null;
  const startField=()=>{if(reduce||!cv)return;buildShapes();field=Field(cv)};
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(startField);

  /* solutions: active item drives the pixel icon */
  const sols=$$('#px-sols li'),soln=$('#px-soln'),soll=$('#px-soll');let solCur=0;
  function setSol(i){if(i===solCur&&sols[i].classList.contains('on'))return;solCur=i;sols.forEach((l,k)=>l.classList.toggle('on',k===i));
    if(soln)soln.textContent=String(i+1).padStart(2,'0')+' / 06';if(soll)soll.textContent=sols[i].querySelector('h3').textContent;field&&field.setSol(i)}
  sols.forEach((l,i)=>l.addEventListener('pointerenter',()=>setSol(i)));

  if(!HAS||reduce){done();return}
  gsap.registerPlugin(ScrollTrigger);
  const EO='expo.out';

  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.15,wheelMultiplier:.95});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const tg=id==='#top'?0:document.querySelector(id);if(tg===null||!lenis)return;e.preventDefault();lenis.scrollTo(tg,{offset:id==='#top'?0:-60,duration:1.6})}));

  /* intro */
  const h1=$('#px-h1');
  const intro=gsap.timeline({paused:true});
  intro.from('.px .top',{yPercent:-100,duration:1,ease:EO,clearProps:'transform'},0)
    .add(()=>h1&&decrypt(h1,1400),.1)
    .from('.px .hero .lab',{opacity:0,x:-20,duration:1,ease:EO},.1);
  [['.px .hero .sub',{y:24,opacity:0,duration:1,ease:EO},.5],['.px .hero .acts>*',{y:24,opacity:0,duration:1,ease:EO,stagger:.08},.6],
   ['.px .hero .meta>span',{y:20,opacity:0,duration:.9,ease:EO,stagger:.08},.8],['.px .hero .ticks li',{x:-24,opacity:0,duration:.9,ease:EO,stagger:.08},.7],
   ['.px .hero .fbox',{y:60,opacity:0,duration:1.2,ease:EO,clearProps:'transform'},.4]].forEach(([s,v,at])=>{if(page.querySelector(s))intro.from(s,v,at)});
  intro.add(()=>$$('.px .hero [data-count]').forEach(b=>{const o={v:0},n=+b.dataset.count;gsap.to(o,{v:n,duration:1.6,ease:'power2.out',onUpdate(){b.textContent=Math.round(o.v)}})}),.8);

  if(root.classList.contains('px-preload')&&loader){
    lenis&&lenis.stop();const hx=document.getElementById('px-lhx'),st=document.getElementById('px-lst'),pct=document.getElementById('px-lpct'),bar=document.getElementById('px-lbar'),o={p:0};
    const msgs=['Estabelecendo conexão segura','Verificando integridade','Acesso autorizado'];
    gsap.timeline({onComplete:()=>{done();lenis&&lenis.start();ScrollTrigger.refresh()}})
      .to(o,{p:1,duration:1.7,ease:'power2.inOut',onUpdate(){const p=o.p;pct.textContent=String(Math.round(p*100)).padStart(2,'0')+'%';bar.style.transform='scaleX('+p+')';
        st.textContent=msgs[p<.45?0:p<.92?1:2];let s='';for(let i=0;i<150;i++)s+=GLYPHS[Math.random()*16|0]+(i%2?' ':'');hx.textContent=s}})
      .to(loader,{opacity:0,duration:.5,ease:'power2.in'},'+=.25')
      .add(()=>intro.play(),'-=.3');
  }else{done();intro.play()}

  /* headings decrypt as they arrive */
  $$('.px main .dec').forEach(h=>{if(h===h1)return;ScrollTrigger.create({trigger:h,start:'top 85%',once:true,onEnter:()=>decrypt(h,1000)})});
  $$('.px main .head .lab,.px .years .lab').forEach(l=>gsap.from(l,{opacity:0,x:-20,duration:1,ease:EO,scrollTrigger:{trigger:l,start:'top 90%'}}));
  $$('.px main .head p,.px .years p').forEach(p=>gsap.from(p,{y:24,opacity:0,duration:1,ease:EO,scrollTrigger:{trigger:p,start:'top 92%'}}));
  gsap.to('.px .hero .wrap',{y:-80,opacity:.15,ease:'none',scrollTrigger:{trigger:'.px .hero',start:'top top',end:'bottom top',scrub:true}});

  /* solutions */
  if(sols.length){
    gsap.from(sols,{x:-40,opacity:0,duration:1,ease:EO,stagger:.07,scrollTrigger:{trigger:'#px-sols',start:'top 85%'},clearProps:'transform'});
    const mm=gsap.matchMedia();
    mm.add('(min-width: 901px)',()=>{const ts=sols.map((l,i)=>ScrollTrigger.create({trigger:l,start:'top 58%',end:'bottom 58%',onToggle:x=>x.isActive&&setSol(i)}));return()=>ts.forEach(t=>t.kill())});
    mm.add('(max-width: 900px)',()=>{let id=0;const st=ScrollTrigger.create({trigger:'#px-solbox',start:'top bottom',end:'bottom top',onToggle:x=>{clearInterval(id);if(x.isActive)id=setInterval(()=>setSol((solCur+1)%6),2600)}});return()=>{clearInterval(id);st.kill()}});
  }
  /* cards and rows */
  const batch=(sel,v)=>ScrollTrigger.batch(sel,{start:'top 92%',once:true,onEnter:b=>gsap.from(b,Object.assign({opacity:0,duration:1,ease:EO,stagger:.07,clearProps:'transform'},v))});
  batch('.px .rs',{y:60});batch('.px .seg',{y:40,scale:.96});batch('.px .post',{y:60});
  batch('.px .file',{x:-60});
  $$('.px .file').forEach(f=>{const h=f.querySelector('h3');let busy=false;f.addEventListener('pointerenter',()=>{if(busy)return;busy=true;decrypt(h,600);setTimeout(()=>busy=false,650)})});
  $$('.px .rs').forEach(f=>{const h=f.querySelector('h3');let busy=false;f.addEventListener('pointerenter',()=>{if(busy)return;busy=true;decrypt(h,500);setTimeout(()=>busy=false,550)})});
  gsap.from('.px .logos>div',{opacity:0,duration:.8,ease:'power2.out',stagger:{each:.035,from:'random'},scrollTrigger:{trigger:'.px .logos',start:'top 85%'}});
  gsap.from('.px .verde',{y:30,opacity:0,duration:1,ease:EO,scrollTrigger:{trigger:'.px .verde',start:'top 92%'}});
  gsap.from('.px .info>*',{x:-30,opacity:0,duration:1,ease:EO,stagger:.08,scrollTrigger:{trigger:'.px .info',start:'top 88%'}});
  page.querySelector('.px .contact .fbox')&&gsap.from('.px .contact .fbox',{y:70,opacity:0,duration:1.2,ease:EO,clearProps:'transform',scrollTrigger:{trigger:'.px .contact .fbox',start:'top 90%'}});
  ScrollTrigger.addEventListener('refresh',()=>field&&field.refresh());
  ScrollTrigger.refresh();
})();
