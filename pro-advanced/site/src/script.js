/* Pro Advanced · site v2 motion (GSAP + ScrollTrigger + Lenis). Static and complete without them. */
(function(){
  const page=document.getElementById('px');if(!page)return;
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=s=>page.querySelector(s),$$=s=>[...page.querySelectorAll(s)];
  const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));
  const BLUE='#3696cd',BLUE2='#20a3d6';

  /* full width when embedded in a narrower column (RD Station blocks) */
  function bleed(){const st=page.style;st.setProperty('margin-left','0px','important');st.setProperty('width','auto','important');
    const left=page.getBoundingClientRect().left,w=document.documentElement.clientWidth;
    if(Math.abs(left)<1&&Math.abs(page.offsetWidth-w)<2){st.removeProperty('width');st.removeProperty('margin-left');return}
    st.setProperty('width',w+'px','important');st.setProperty('max-width',w+'px','important');st.setProperty('margin-left',(-left)+'px','important')}
  bleed();addEventListener('resize',()=>{bleed();window.ScrollTrigger&&ScrollTrigger.refresh()});

  /* nav */
  const nav=$('#px-nav'),bg=$('#px-burger');
  if(bg)bg.addEventListener('click',()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  $$('#px-menu a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');bg&&bg.setAttribute('aria-expanded',false)}));
  let lastY=0;addEventListener('scroll',()=>{const y=scrollY;nav.classList.toggle('hide',y>400&&y>lastY&&!nav.classList.contains('open'));lastY=y},{passive:true});

  /* clock */
  const clk=$('#px-clock');function tick(){if(!clk)return;try{clk.textContent='São Paulo · '+new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour12:false})}catch(e){}}
  tick();setInterval(tick,1000);

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

  /* ---------- pixel mosaic (manual cover) ---------- */
  function Mosaic(cv,o){
    const ctx=cv.getContext('2d');let W,H,cs,gap,cols,rows,mask=null,seed,run=true,mx=-1e4,my=-1e4,t0=performance.now(),img=null;
    function rnd(i){const x=Math.sin(i*91.17+7.3)*43758.5453;return x-Math.floor(x)}
    function build(){const r=cv.getBoundingClientRect(),d=Math.min(1.5,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);
      cs=W<760?22:30;gap=3;cols=Math.ceil(W/cs);rows=Math.ceil(H/cs);seed=new Float32Array(cols*rows);for(let k=0;k<seed.length;k++)seed[k]=rnd(k+1);
      mask=null;if(img&&o.icon){const oc=document.createElement('canvas');oc.width=cols;oc.height=rows;const x=oc.getContext('2d');
        const mob=W<760,size=mob?Math.min(cols*.8,rows*.4):Math.min(rows*.78,cols*.36),cx=mob?cols*.5:cols*.74,cy=mob?rows*.3:rows*.42;
        x.drawImage(img,cx-size/2,cy-size/2,size,size);const a=x.getImageData(0,0,cols,rows).data;mask=new Float32Array(cols*rows);for(let k=0;k<mask.length;k++)mask[k]=a[k*4+3]/255*(mob?.6:1)}}
    cv.parentElement.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
    cv.parentElement.addEventListener('pointerleave',()=>{mx=my=-1e4});
    function frame(now){if(!run)return;requestAnimationFrame(frame);const t=(now-t0)/1000;ctx.clearRect(0,0,W,H);
      const intro=o.intro?clamp(0,1,t/1.6):1;
      for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*cols+i;
        let v=.5+.5*Math.sin(i*.23+t*.6+Math.sin(j*.17+t*.4)*1.8)*Math.cos(j*.19-t*.35);
        v=v*v*.14+(seed[k]>.965?.12+.1*Math.sin(t*2+seed[k]*30):0);
        const dx=i*cs+cs/2-mx,dy=j*cs+cs/2-my,dd=Math.sqrt(dx*dx+dy*dy);if(dd<220)v+=(1-dd/220)*.42;
        if(mask&&mask[k]>0)v+=mask[k]*(.26+.12*Math.sin(t*1.4+seed[k]*12));
        v*=clamp(0,1,intro*1.6-seed[k]*.6);
        if(v<.02)continue;
        ctx.fillStyle=seed[k]>.82&&v>.18?`rgba(32,163,214,${Math.min(1,v*2.2).toFixed(3)})`:`rgba(255,255,255,${Math.min(.6,v).toFixed(3)})`;
        ctx.fillRect(i*cs+gap/2,j*cs+gap/2,cs-gap,cs-gap)}}
    if(o.icon){const im=new Image();im.onload=()=>{img=im;build()};im.src=o.icon}
    build();requestAnimationFrame(frame);addEventListener('resize',build);
    if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!run){run=true;requestAnimationFrame(frame)}}else run=false})).observe(cv);
    return{restart(){t0=performance.now()}};
  }
  const ICON='{{ICON_MASK}}';
  let hero=null;
  if(!reduce){const a=document.getElementById('px-mosaic');if(a)hero=Mosaic(a,{icon:ICON,intro:true});const b=document.getElementById('px-mosaic2');if(b)Mosaic(b,{})}

  const HAS=!!(window.gsap&&window.ScrollTrigger);
  const loader=document.querySelector('.px-load');
  function done(){root.classList.remove('px-preload');loader&&loader.remove()}
  if(!HAS||reduce){done();return}
  gsap.registerPlugin(ScrollTrigger);page.classList.add('gs');
  const EO='expo.out',P4='power4.inOut';

  let lenis=null;
  if(window.Lenis){lenis=new Lenis({duration:1.15,wheelMultiplier:.95});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const tg=id==='#top'?0:document.querySelector(id);if(tg===null||!lenis)return;e.preventDefault();lenis.scrollTo(tg,{offset:id==='#top'?0:-90,duration:1.4})}));

  /* pixel rail progress */
  const rail=document.createElement('div');rail.className='px-rail';rail.setAttribute('aria-hidden','true');rail.innerHTML='<i></i>'.repeat(20);document.body.append(rail);
  const dots=[...rail.children];ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const n=Math.round(s.progress*dots.length);dots.forEach((d,i)=>d.classList.toggle('on',i<n))}});

  /* hero intro */
  const intro=gsap.timeline({paused:true});
  intro.from('#px-h1 .ln>span',{yPercent:110,duration:1.2,ease:EO,stagger:.09},0)
    .from('.px .hero .kick',{x:-30,opacity:0,duration:1,ease:EO},.1)
    .from('.px .hero .row',{y:30,opacity:0,duration:1,ease:EO},.45)
    .from('.px .stat > *',{y:20,opacity:0,duration:.9,ease:EO,stagger:.08},.5)
    .from('.px .nav',{y:-80,opacity:0,duration:1,ease:EO,clearProps:'transform'},.2);

  /* loader: mosaic fills, then wipes column by column */
  if(root.classList.contains('px-preload')&&loader){
    try{sessionStorage.setItem('px-intro','1')}catch(e){}
    lenis&&lenis.stop();
    const cv=document.getElementById('px-lcv'),x=cv.getContext('2d'),pct=document.getElementById('px-lpct');
    const d=Math.min(1.5,devicePixelRatio||1),W=innerWidth,H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0);
    const cs=W<760?24:40,cols=Math.ceil(W/cs),rows=Math.ceil(H/cs),ord=Array.from({length:cols*rows},(_,k)=>((k*7919)%997)/997);
    const st={p:0,w:0};
    function draw(){x.clearRect(0,0,W,H);for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*cols+i;if(ord[k]>st.p)continue;if(i/cols<st.w*1.25-ord[k]*.25)continue;
      x.fillStyle=ord[k]>.85?BLUE2:'rgba(255,255,255,'+(.08+ord[k]*.22).toFixed(2)+')';x.fillRect(i*cs+2,j*cs+2,cs-4,cs-4)}}
    gsap.timeline({onComplete:()=>{done();lenis&&lenis.start();ScrollTrigger.refresh()}})
      .to(st,{p:1,duration:1.6,ease:'power2.inOut',onUpdate(){draw();pct.textContent=String(Math.round(st.p*100)).padStart(2,'0')}})
      .to('.px-load .t',{y:-30,opacity:0,duration:.5,ease:'power3.in'},'+=.1')
      .to(st,{w:1,duration:.9,ease:'power2.in',onUpdate:draw},'<')
      .to(loader,{opacity:0,duration:.35})
      .add(()=>{hero&&hero.restart();intro.play()},'-=.9');
  }else{done();intro.play()}

  /* chapter headers: numeral counts up, title clips in, rule draws */
  $$('.chap').forEach(ch=>{
    const n=ch.querySelector('.num span'),h=ch.querySelector('h2'),r=ch.querySelector('.rule'),sm=ch.querySelector('small');
    const target=+n.dataset.n,o={v:0};
    const tl=gsap.timeline({scrollTrigger:{trigger:ch,start:'top 82%'}});
    tl.from(ch.querySelector('.num'),{yPercent:40,opacity:0,duration:1.1,ease:EO},0)
      .to(o,{v:target,duration:1,ease:'power2.out',onUpdate(){n.textContent=String(Math.round(o.v)).padStart(2,'0')}},0)
      .from(sm,{x:-20,opacity:0,duration:.8,ease:EO},.1)
      .fromTo(h,{clipPath:'inset(0 0 100% 0)',letterSpacing:'.14em'},{clipPath:'inset(0 0 0% 0)',letterSpacing:'.01em',duration:1.2,ease:EO},.15)
      .from(r,{scaleX:0,duration:1,ease:P4},.3);
  });
  $$('.px .intro').forEach(p=>gsap.from(p,{y:24,opacity:0,duration:1,ease:EO,scrollTrigger:{trigger:p,start:'top 90%'}}));
  gsap.to('.px .hero .wrap',{y:-60,ease:'none',scrollTrigger:{trigger:'.px .hero',start:'top top',end:'bottom top',scrub:true}});

  /* solutions rows */
  gsap.from('.px .rowi',{x:-50,opacity:0,duration:1,ease:EO,stagger:.08,scrollTrigger:{trigger:'.px .rows',start:'top 85%'}});

  /* why: active step + line-art */
  (function(){
    const steps=$$('#px-steps li'),groups=$$('#px-art g.f'),num=$('#px-artn'),lbl=$('#px-artl');let cur=-1;
    groups.forEach(g=>g.querySelectorAll('path,line,rect,circle').forEach(el=>{if(el.getAttribute('stroke')==='none')return;try{const L=el.getTotalLength();el.style.strokeDasharray=L;el.dataset.l=L}catch(e){}}));
    const loops=[
      gsap.to('#px-art .sweep',{rotation:360,svgOrigin:'0 0',duration:4,ease:'none',repeat:-1,paused:true}),
      gsap.to('#px-art .pulse',{keyframes:[{x:-120,y:-80},{x:0,y:0},{x:130,y:70},{x:0,y:0},{x:0,y:140},{x:0,y:0},{x:120,y:-80},{x:0,y:0}],duration:5,ease:'power1.inOut',repeat:-1,paused:true}),
      gsap.fromTo('#px-art .fit',{strokeDashoffset:0},{strokeDashoffset:-80,duration:2,ease:'none',repeat:-1,paused:true}),
      gsap.to('#px-art .link',{y:-10,duration:1.4,ease:'sine.inOut',yoyo:true,repeat:-1,paused:true}),
      gsap.to('#px-art .ck',{opacity:.35,duration:.9,ease:'sine.inOut',yoyo:true,repeat:-1,paused:true}),
      gsap.to('#px-art g[data-i="5"] circle',{scale:1.6,svgOrigin:'150 -130',duration:.9,ease:'sine.inOut',yoyo:true,repeat:-1,paused:true})
    ];
    function show(i){if(i===cur)return;const prev=cur;cur=i;
      steps.forEach((s,k)=>s.classList.toggle('on',k===i));
      num.textContent=String(i+1).padStart(2,'0')+' / 06';lbl.textContent=steps[i].querySelector('h3').textContent;
      if(prev>=0){gsap.to(groups[prev],{opacity:0,duration:.35});loops[prev].pause()}
      const g=groups[i];gsap.set(g,{opacity:1});
      g.querySelectorAll('[data-l]').forEach(el=>gsap.fromTo(el,{strokeDashoffset:+el.dataset.l},{strokeDashoffset:0,duration:1.3,ease:'power2.inOut',delay:Math.random()*.25,onComplete(){if(el.classList.contains('fit'))el.style.strokeDasharray='10 10'}}));
      g.querySelectorAll('[stroke="none"]').forEach(el=>gsap.fromTo(el,{opacity:0},{opacity:1,duration:.5,delay:.8}));
      loops[i].play();
    }
    steps.forEach((s,i)=>s.addEventListener('click',()=>show(i)));show(0);
    const mm=gsap.matchMedia();
    mm.add('(min-width: 901px)',()=>{const ts=steps.map((s,i)=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:x=>x.isActive&&show(i)}));return()=>ts.forEach(t=>t.kill())});
    gsap.from(steps,{y:30,opacity:0,duration:1,ease:EO,stagger:.08,scrollTrigger:{trigger:'#px-steps',start:'top 85%'}});
    gsap.from('.px .art',{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:P4,scrollTrigger:{trigger:'.px .art',start:'top 85%'}});
  })();

  /* years: count + year ticks */
  (function(){const n=$('#px-27'),o={v:0},bars=$('#px-bars');
    for(let y=1999;y<=2026;y++){const i=document.createElement('i');i.style.setProperty('--h',((y-1999)%5===0||y===2026?100:55)+'%');bars.append(i)}
    const ticks=[...bars.children];
    ScrollTrigger.create({trigger:'.px .years',start:'top 75%',once:true,onEnter:()=>{gsap.to(o,{v:27,duration:2.2,ease:'power3.out',onUpdate(){n.textContent=Math.round(o.v)}});
      gsap.from(ticks,{scaleY:0,duration:.6,ease:'power2.out',stagger:.03});ticks.forEach((t,i)=>gsap.delayedCall(.3+i*.06,()=>t.classList.add('on')))}});
    gsap.from('.px .big27',{xPercent:-12,opacity:0,duration:1.4,ease:EO,scrollTrigger:{trigger:'.px .years',start:'top 80%'}});
  })();

  /* segments: pixel fill from the pointer */
  $$('.tile').forEach(t=>{if(t.classList.contains('wide'))return;
    const cv=document.createElement('canvas');t.prepend(cv);const x=cv.getContext('2d');let W,H,ox=0,oy=0,st={r:0},tw=null;const cs=14;
    function size(){const r=t.getBoundingClientRect(),d=Math.min(1.5,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
    function draw(){x.clearRect(0,0,W,H);if(st.r<=0)return;for(let j=0;j*cs<H;j++)for(let i=0;i*cs<W;i++){const cx=i*cs+cs/2,cy=j*cs+cs/2,d=Math.hypot(cx-ox,cy-oy),n=(Math.sin(i*12.9+j*78.2)*43758.5)%1;
      if(d<st.r-Math.abs(n)*40){x.fillStyle=Math.abs(n)>.8?BLUE2:BLUE;x.fillRect(i*cs,j*cs,cs-1,cs-1)}}}
    t.addEventListener('pointerenter',e=>{size();const r=t.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;tw&&tw.kill();tw=gsap.to(st,{r:Math.hypot(W,H)+60,duration:.6,ease:'power2.out',onUpdate:draw})});
    t.addEventListener('pointerleave',e=>{const r=t.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;tw&&tw.kill();tw=gsap.to(st,{r:0,duration:.45,ease:'power2.in',onUpdate:draw})});
  });
  gsap.from('.px .tile',{opacity:0,y:30,duration:.9,ease:EO,stagger:{each:.05,grid:'auto',from:'start'},scrollTrigger:{trigger:'#px-tiles',start:'top 85%'}});

  /* cases: stacking cards shrink as the next one arrives */
  (function(){const cs=$$('.cs');
    cs.forEach(c=>{const p=c.querySelector('.pix'),on=(p.dataset.on||'').split(',').map(Number);for(let i=0;i<64;i++){const s=document.createElement('i');if(on.includes(i))s.className='on';p.append(s)}
      gsap.from(p.children,{scale:0,duration:.4,ease:'back.out(2)',stagger:{each:.012,from:'random'},scrollTrigger:{trigger:c,start:'top 80%'}})});
    const mm=gsap.matchMedia();
    mm.add('(min-width: 761px)',()=>{const tw=cs.slice(0,-1).map((c,i)=>gsap.to(c,{scale:.94,ease:'none',scrollTrigger:{trigger:cs[i+1],start:'top 85%',end:'top 30%',scrub:true}}));return()=>tw.forEach(t=>{t.scrollTrigger&&t.scrollTrigger.kill();t.kill();})});
  })();

  /* partners grid */
  gsap.from('#px-logos > div',{opacity:0,scale:.85,duration:.7,ease:EO,stagger:{each:.035,from:'random'},scrollTrigger:{trigger:'#px-logos',start:'top 85%'}});
  gsap.from('.px .verde',{y:30,opacity:0,duration:1,ease:EO,scrollTrigger:{trigger:'.px .verde',start:'top 90%'}});

  /* blog rows: image reveals */
  $$('.px .bl a').forEach(a=>{gsap.from(a.querySelector('.im'),{clipPath:'inset(0 100% 0 0)',duration:1.1,ease:P4,scrollTrigger:{trigger:a,start:'top 88%'}});gsap.from(a.querySelectorAll('h3,p,.go'),{y:20,opacity:0,duration:.9,ease:EO,stagger:.06,scrollTrigger:{trigger:a,start:'top 88%'}})});

  /* contact + footer */
  gsap.from('.px .fbox',{clipPath:'inset(100% 0 0 0)',duration:1.3,ease:P4,scrollTrigger:{trigger:'.px .fbox',start:'top 85%'}});
  gsap.from('.px .info > div',{y:24,opacity:0,duration:.9,ease:EO,stagger:.1,scrollTrigger:{trigger:'.px .info',start:'top 88%'}});
  (function(){const u=$('#px-url');if(!u)return;u.innerHTML=[...u.textContent].map(c=>'<span>'+c+'</span>').join('');
    gsap.from(u.children,{yPercent:100,opacity:0,duration:.9,ease:EO,stagger:.03,scrollTrigger:{trigger:u,start:'top 95%'}})})();

  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ScrollTrigger.refresh());
  addEventListener('load',()=>ScrollTrigger.refresh());
})();
