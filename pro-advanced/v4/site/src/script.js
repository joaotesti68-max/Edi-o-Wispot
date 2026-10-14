/* Pro Advanced · v4 "Campo de Dados": a single data route runs the whole page. A lit head follows the
   scroll, pulling a train of pixels that unpacks into each section's figure (solution icons, shield, 27,
   and the Pro symbol at the end of the route).
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
    SHAPES.lock=sample(44,44,(x,w)=>{x.scale(w/54,w/54);const body=new Path2D('M14 24h26a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V27a3 3 0 0 1 3-3z');
      x.fillStyle='rgba(255,255,255,.3)';x.fill(body);x.strokeStyle='#fff';x.lineWidth=2.4;x.lineJoin='round';x.lineCap='round';x.stroke(body);
      x.stroke(new Path2D('M18 24v-7a9 9 0 0 1 18 0v7'));x.lineWidth=3;x.stroke(new Path2D('M27 33v7'));x.beginPath();x.arc(27,33,2.6,0,Math.PI*2);x.fillStyle='#fff';x.fill()},true);
    SHAPES['27']=sample(88,40,(x,w,h)=>{x.fillStyle='#fff';x.font='700 '+(h*1.12)+'px Montserrat, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('27',w/2,h*.56)});
  }
  const SYM='{{ICON_MASK}}';

  /* ---------- the route: one data trace that runs the whole page ---------- */
  function Route(cv){
    const x=cv.getContext('2d');let low=innerWidth<760;
    let W,H,D,sx=new Float32Array(0),sy=new Float32Array(0),SL=0,STEP=4,nodes=[],headS=0,run=true,boxes=[],solI=0,key='',ready=false;
    const NP=low?700:1200,NF=low?220:420,P=[],F=[];
    function size(){low=innerWidth<760;D=Math.min(low?1.25:1.5,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0)}
    size();
    const docY=el=>{const r=el.getBoundingClientRect();return{l:r.left,r:r.right,t:r.top+scrollY,b:r.bottom+scrollY,w:r.width,h:r.height}};
    /* build an orthogonal, chamfered path from the layout */
    function build(){
      const wrap=$('.px main .wrap');if(!wrap)return;const wr=wrap.getBoundingClientRect(),g=parseFloat(getComputedStyle(wrap).paddingLeft)||20;
      const lane=Math.max(8,wr.left+g*.5),right=Math.min(W-8,W-lane);
      const pts=[[right,0]];nodes=[];
      const go=(px,py)=>{const L=pts[pts.length-1];if(py<L[1])py=L[1];if(px!==L[0]&&py!==L[1])pts.push([L[0],py]);pts.push([px,py])};
      const hero=$('.px .hero');const hb=hero?docY(hero).b:H;
      go(right,hb-40);
      /* stations in document order: section labels on the lane, figure boxes as detours */
      const st=[];
      $$('.px main .head .lab,.px .years .lab').forEach(l=>{const r=docY(l);if(r.h)st.push({type:'lab',y:r.t+r.h/2,el:l,lx:r.l})});
      boxes.forEach(b=>{const r=docY(b);if(!r.w)return;let top=r.t,bot=r.b;const wrapEl=b.closest('.fxwrap'),grid=b.closest('.sol-grid');if(grid&&wrapEl&&getComputedStyle(wrapEl).position==='sticky'){const q=docY(grid);top=q.t;bot=q.b}
        st.push({type:'box',y:top,top,bot,cx:r.l+r.w/2,el:b})});
      st.sort((a,b)=>a.y-b.y);
      let cur=lane,first=true;
      for(const s of st){
        if(s.type==='lab'){const L=pts[pts.length-1];if(s.y<L[1])continue;
          if(first){go(right,s.y-90);go(lane,s.y-90);first=false}
          go(lane,s.y);nodes.push({x:lane,y:s.y,lx:s.lx,s:0});cur=lane}
        else{const L=pts[pts.length-1];const ty=Math.max(L[1]+24,s.top-34);if(first){go(right,ty);first=false}
          go(L[0],ty);go(s.cx,ty);go(s.cx,s.bot+(s.bot>docY(s.el).b+5?18:30));
          const last=s===st[st.length-1];if(!last)go(lane,pts[pts.length-1][1]);cur=last?s.cx:lane}}
      /* chamfer corners, then sample by arc length */
      const c=[pts[0]];for(let i=1;i<pts.length-1;i++){const a=pts[i-1],b=pts[i],n=pts[i+1];const r=Math.min(18,Math.hypot(b[0]-a[0],b[1]-a[1])/2,Math.hypot(n[0]-b[0],n[1]-b[1])/2);
        const d1=[Math.sign(b[0]-a[0]),Math.sign(b[1]-a[1])],d2=[Math.sign(n[0]-b[0]),Math.sign(n[1]-b[1])];
        if(d1[0]===d2[0]&&d1[1]===d2[1]){c.push(b);continue}c.push([b[0]-d1[0]*r,b[1]-d1[1]*r]);c.push([b[0]+d2[0]*r,b[1]+d2[1]*r])}
      c.push(pts[pts.length-1]);
      const ax=[],ay=[];for(let i=0;i<c.length-1;i++){const a=c[i],b=c[i+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);const n=Math.max(1,Math.round(len/STEP));for(let k=0;k<n;k++){ax.push(a[0]+(b[0]-a[0])*k/n);ay.push(a[1]+(b[1]-a[1])*k/n)}}
      ax.push(c[c.length-1][0]);ay.push(c[c.length-1][1]);sx=Float32Array.from(ax);sy=Float32Array.from(ay);SL=(sx.length-1)*STEP;
      for(let i=1;i<sy.length;i++)if(sy[i]<sy[i-1])sy[i]=sy[i-1];
      nodes.forEach(n=>n.s=sAtY(n.y));ready=true}
    function sAtY(y){let lo=0,hi=sy.length-1;if(y<=sy[0])return 0;if(y>=sy[hi])return hi*STEP;while(lo<hi){const m=(lo+hi)>>1;if(sy[m]<y)lo=m+1;else hi=m}return lo*STEP}
    function at(s,o){s=clamp(0,SL,s);const f=s/STEP,i=Math.min(sx.length-2,f|0),u=f-i;o=o||[0,0,0,0];
      o[0]=sx[i]+(sx[i+1]-sx[i])*u;o[1]=sy[i]+(sy[i+1]-sy[i])*u;let dx=sx[i+1]-sx[i],dy=sy[i+1]-sy[i];const l=Math.hypot(dx,dy)||1;o[2]=-dy/l;o[3]=dx/l;return o}
    for(let i=0;i<NP;i++)P.push({x:W*.9,y:H*.5,tx:0,ty:0,sz:0,tsz:0,a:0,ta:0,r:Math.random(),k:Math.random(),wait:0});
    for(let i=0;i<NF;i++)F.push({s:Math.random(),v:40+Math.random()*120,o:(Math.random()-.5)*6,r:Math.random()});
    function refresh(){boxes=$$('.fxbox[data-shape]');build()}
    let rt=0;const later=()=>{clearTimeout(rt);rt=setTimeout(()=>{size();refresh()},120)};
    addEventListener('resize',later);if('ResizeObserver' in window)new ResizeObserver(later).observe($('.px main'));
    document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run){last=performance.now();requestAnimationFrame(loop)}});
    const sym={shape:null};const im=new Image();im.onload=()=>{sym.shape=sample(48,48,(c,w,h)=>c.drawImage(im,0,0,w,h))};im.src=SYM;
    function pickActive(){let best=null,bd=1e9;for(const b of boxes){const r=b.getBoundingClientRect();if(r.width<4||r.bottom<0||r.top>H)continue;const d=Math.abs(r.top+r.height/2-H/2);if(d<bd&&d<H*.6){bd=d;best={el:b,r}}}return best}
    function shapeOf(el){const s=el.dataset.shape;return s==='sol'?SHAPES.sol&&SHAPES.sol[solI]:s==='symbol'?sym.shape:SHAPES[s]}
    const tmp=[0,0,0,0],t0=performance.now();let last=t0;
    function seg(s0,s1,style,w){if(s1<=s0)return;const i0=Math.max(0,s0/STEP|0),i1=Math.min(sx.length-1,Math.ceil(s1/STEP));const Y=scrollY;
      x.strokeStyle=style;x.lineWidth=w;x.beginPath();let on=false;
      for(let i=i0;i<=i1;i++){const yy=sy[i]-Y;if(yy<-40||yy>H+40){on=false;continue}if(!on){x.moveTo(sx[i],yy);on=true}else x.lineTo(sx[i],yy)}x.stroke()}
    function loop(now){if(!run)return;requestAnimationFrame(loop);const dt=Math.min(.1,(now-last)/1000);last=now;const t=(now-t0)/1000;
      x.clearRect(0,0,W,H);if(!ready)return;const Y=scrollY;
      const target=sAtY(Y+H*.55);headS+=(target-headS)*(1-Math.exp(-dt*4.5));
      /* the trace: whole route faint, travelled part lit, a glow just behind the head */
      x.save();x.beginPath();x.rect(0,0,W,H);for(const b of boxes){const r=b.getBoundingClientRect();if(r.width&&r.bottom>0&&r.top<H)x.rect(r.left+r.width,r.top,-r.width,r.height)}x.clip('evenodd');
      seg(0,SL,'rgba(104,197,219,.13)',1);
      seg(0,headS,'rgba(104,197,219,.55)',1.4);
      seg(Math.max(0,headS-420),headS,'rgba(104,197,219,.14)',6);x.restore();
      /* data packets circulating along the route */
      for(const f of F){f.s=(f.s+f.v*dt/SL)%1;const s=f.s*SL;at(s,tmp);const yy=tmp[1]-Y;if(yy<-10||yy>H+10)continue;
        const lit=s<headS;x.fillStyle=lit?'rgba(104,197,219,'+(.45+f.r*.4).toFixed(2)+')':'rgba(201,214,228,'+(.12+f.r*.15).toFixed(2)+')';
        const px=tmp[0]+tmp[2]*f.o,py=yy+tmp[3]*f.o;x.fillRect(px-1.2,py-1.2,2.4,2.4)}
      /* stations */
      for(const n of nodes){const yy=n.y-Y;if(yy<-20||yy>H+20)continue;const on=headS>=n.s-2;
        x.strokeStyle=on?'rgba(104,197,219,.9)':'rgba(104,197,219,.35)';x.lineWidth=1.2;x.strokeRect(n.x-5,yy-5,10,10);
        if(on){x.fillStyle='rgba(104,197,219,.9)';x.fillRect(n.x-2.5,yy-2.5,5,5);x.beginPath();x.moveTo(n.x+6,yy);x.lineTo(n.lx-8,yy);x.strokeStyle='rgba(104,197,219,.5)';x.stroke()}}
      /* the data train: follows the head, unpacks into each section's figure */
      const act=pickActive(),sh=act&&shapeOf(act.el);const k2=act?(act.el.dataset.shape+(act.el.dataset.shape==='sol'?solI:'')):'';
      if(k2!==key){key=k2;for(const p of P)p.wait=t+p.r*.4}
      const M=sh?sh.pts.length:0,cell=sh?act.r.width/sh.gw:0;at(headS,tmp);const hx=tmp[0],hy=tmp[1]-Y;
      const LANES=3,GAP=7,TR=Math.round(low?60:80)*LANES;
      for(let i=0;i<NP;i++){const p=P[i];
        if(t>=p.wait){
          if(sh&&i<M){const q=sh.pts[i];p.tx=act.r.left+q[0]*act.r.width;p.ty=act.r.top+q[1]*sh.gh*cell;p.tsz=cell*.74;p.ta=q[2]*(.8+.2*Math.sin(t*1.6+p.r*30))}
          else{const ii=sh?i-M:i;if(ii<TR){const along=Math.floor(ii/LANES)*GAP,ln=(ii%LANES-1)*4.5;at(headS-along,tmp);p.tx=tmp[0]+tmp[2]*ln;p.ty=tmp[1]-Y+tmp[3]*ln;p.tsz=2.6;p.ta=.85*(1-along/(TR/LANES*GAP))}
            else{p.tx=hx;p.ty=hy;p.tsz=1;p.ta=0}}}
        const e=1-Math.exp(-dt*(4+p.k*6)),e2=1-Math.exp(-dt*7);p.x+=(p.tx-p.x)*e;p.y+=(p.ty-p.y)*e;p.sz+=(p.tsz-p.sz)*e2;p.a+=(p.ta-p.a)*e2;
        if(p.a<.02)continue;x.fillStyle=(p.r>.85?'rgba(255,255,255,':p.r>.4?'rgba(104,197,219,':'rgba(43,163,219,')+p.a.toFixed(3)+')';x.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz)}
      /* the head */
      x.fillStyle='rgba(104,197,219,.18)';x.fillRect(hx-9,hy-9,18,18);x.fillStyle='rgba(104,197,219,.4)';x.fillRect(hx-5.5,hy-5.5,11,11);x.fillStyle='#fff';x.fillRect(hx-3,hy-3,6,6);
    }
    refresh();requestAnimationFrame(loop);
    return{setSol(i){solI=i},refresh}
  }

  const HAS=!!(window.gsap&&window.ScrollTrigger);
  const loader=document.querySelector('.px-load');
  function done(){root.classList.remove('px-preload');loader&&loader.remove()}
  const cv=$('#px-field');
  let field=null;
  const startField=()=>{if(reduce||!cv)return;buildShapes();field=Route(cv)};
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
    .from('#px-h1',{y:50,opacity:0,duration:1.4,ease:EO},.15)
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
  $$('.px main .dec').forEach(h=>{if(h===h1)return;gsap.fromTo(h,{clipPath:'inset(0 100% 0 0)',x:-24},{clipPath:'inset(0 0% 0 0)',x:0,duration:1.3,ease:'power3.out',scrollTrigger:{trigger:h,start:'top 80%'}})});
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
  gsap.from('.px .logos>div',{opacity:0,duration:.8,ease:'power2.out',stagger:{each:.035,from:'random'},scrollTrigger:{trigger:'.px .logos',start:'top 85%'}});
  gsap.from('.px .verde',{y:30,opacity:0,duration:1,ease:EO,scrollTrigger:{trigger:'.px .verde',start:'top 92%'}});
  gsap.from('.px .info>*',{x:-30,opacity:0,duration:1,ease:EO,stagger:.08,scrollTrigger:{trigger:'.px .info',start:'top 88%'}});
  page.querySelector('.px .contact .fbox')&&gsap.from('.px .contact .fbox',{y:70,opacity:0,duration:1.2,ease:EO,clearProps:'transform',scrollTrigger:{trigger:'.px .contact .fbox',start:'top 90%'}});
  ScrollTrigger.addEventListener('refresh',()=>field&&field.refresh());
  ScrollTrigger.refresh();
})();
