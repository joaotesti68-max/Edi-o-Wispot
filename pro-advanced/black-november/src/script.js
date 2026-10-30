/* Pro Advanced LP · Black November 2026
   Needs (in this order, before this file):
   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
   https://unpkg.com/lenis@1.1.13/dist/lenis.min.js
   Without them the page still works, just without the scroll motion. */
(function(){
  /* ---------- RD Station settings ---------- */
  const RD={
    publicToken:'8642f7d78d8931170d08ae3c51495718',   // token público da conta Pro Advanced
    conversion:'black-november-2026',                 // identificador da conversão
    thanks:'',                                        // página de obrigado; vazio = mensagem no próprio formulário
    liveHosts:['proadvanced.com.br','rdstation.com','lp.rdstation.com.br']
  };

  const page=document.getElementById('pbn');if(!page)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS=!!(window.gsap&&window.ScrollTrigger);

  /* ---------- full width inside RD Station's 960px column ---------- */
  function bleed(){
    const st=page.style;st.setProperty('margin-left','0px','important');st.setProperty('width','auto','important');
    const left=page.getBoundingClientRect().left,w=document.documentElement.clientWidth;
    st.setProperty('width',w+'px','important');st.setProperty('max-width',w+'px','important');st.setProperty('margin-left',(-left)+'px','important');
  }
  bleed();addEventListener('resize',()=>{bleed();if(window.ScrollTrigger)ScrollTrigger.refresh()});addEventListener('load',bleed);

  /* ---------- form → RD Station conversion ---------- */
  (function(){
    const form=document.getElementById('pbn-lead');if(!form)return;
    const msg=form.querySelector('.form-msg'),btn=form.querySelector('button[type=submit]');
    const live=RD.liveHosts.some(h=>location.hostname===h||location.hostname.endsWith('.'+h));
    function say(t,cls){msg.className='form-msg'+(cls?' '+cls:'');msg.textContent=t}
    function utm(k){try{return new URLSearchParams(location.search).get(k)||undefined}catch(e){return undefined}}
    function trackId(){try{const m=document.cookie.match(/(?:^|; )rdtrk=([^;]+)/);return m?JSON.parse(decodeURIComponent(m[1])).id:undefined}catch(e){return undefined}}
    /* phone mask: (11) 99999-9999 */
    form.mobile_phone.addEventListener('input',()=>{const d=form.mobile_phone.value.replace(/\D/g,'').slice(0,11);
      form.mobile_phone.value=d.length>10?`(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`:d.length>6?`(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d});
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      form.querySelectorAll('.field').forEach(f=>f.classList.remove('err'));
      if(form.website.value)return; // bot
      const miss=[...form.querySelectorAll('[required]')].find(el=>!el.value.trim());
      if(miss){miss.closest('.field').classList.add('err');say('Preencha todos os campos marcados com *.','bad');miss.focus();return}
      const phone=form.mobile_phone.value.replace(/\D/g,'');
      if(phone.length<10||phone.length>11){form.mobile_phone.closest('.field').classList.add('err');say('Confira o telefone: coloque o DDD e o número.','bad');form.mobile_phone.focus();return}
      const email=form.email.value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){form.email.closest('.field').classList.add('err');say('Confira o e-mail: falta o @ ou o domínio.','bad');form.email.focus();return}
      if(!live){say('Prévia: tudo certo com o preenchimento. Na página publicada no RD Station, o lead é enviado para a conversão "black-november-2026".','ok');return}
      btn.disabled=true;say('Enviando…');
      const payload={conversion_identifier:RD.conversion,name:form.name.value.trim(),email,mobile_phone:'+55'+phone,company_name:form.company.value.trim(),
        cf_cargoselecao:form.cf_cargoselecao.value,
        traffic_source:utm('utm_source'),traffic_medium:utm('utm_medium'),traffic_campaign:utm('utm_campaign'),traffic_value:utm('utm_term'),
        client_tracking_id:trackId()};
      try{
        const r=await fetch('https://api.rd.services/platform/conversions?api_key='+RD.publicToken,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_type:'CONVERSION',event_family:'CDP',payload})});
        if(!r.ok)throw new Error(r.status);
        if(RD.thanks){location.href=RD.thanks;return}
        form.reset();btn.disabled=false;say('Recebemos seus dados. Nossa equipe vai entrar em contato para agendar o seu diagnóstico.','ok');
      }catch(err){
        btn.disabled=false;say('Não conseguimos enviar agora. Tente de novo em alguns segundos.','bad');
      }
    });
  })();

  /* ---------- countdown to the end of requests (30/11) ---------- */
  (function(){
    const end=Date.parse(page.dataset.end||''),box=page.querySelector('[data-count]');if(!box||isNaN(end))return;
    const pad=n=>String(n).padStart(2,'0');
    (function tick(){let s=Math.max(0,Math.floor((end-Date.now())/1000));
      const v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
      box.querySelectorAll('[data-u]').forEach(el=>{const t=pad(v[el.dataset.u]);if(el.textContent!==t)el.textContent=t});
      if(!s){box.classList.add('over');box.querySelector('.count-k').textContent='Campanha encerrada';return}
      setTimeout(tick,1000-Date.now()%1000)})();
  })();

  /* ---------- hero radar: the sweep finds attention points (red) and turns them blue ---------- */
  (function(){
    const c=page.querySelector('.radar');if(!c)return;const x=c.getContext('2d');let S=0,pts=[],a=0,last=performance.now(),vis=true;
    function size(){const r=c.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);S=r.width;c.width=c.height=S*d;x.setTransform(d,0,0,d,0,0);
      pts=Array.from({length:26},()=>{const rr=.12+Math.random()*.82,th=Math.random()*Math.PI*2;return{r:rr,th,ok:0,seen:0,born:Math.random()*6}})}
    size();addEventListener('resize',size);
    new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(c);
    function draw(now){
      const dt=Math.min(.05,(now-last)/1000);last=now;
      if(vis&&S){const R=S/2,cx=R,cy=R;x.clearRect(0,0,S,S);
        x.strokeStyle='rgba(201,214,228,.10)';x.lineWidth=1;
        for(let k=1;k<=4;k++){x.beginPath();x.arc(cx,cy,R*k/4.2,0,7);x.stroke()}
        for(let k=0;k<5;k++){const t=k/5*Math.PI*2-Math.PI/2;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(t)*R*.95,cy+Math.sin(t)*R*.95);x.stroke()}
        if(!reduce)a=(a+dt*.9)%(Math.PI*2);
        const g=x.createConicGradient?x.createConicGradient(a-1.1,cx,cy):null;
        if(g){g.addColorStop(0,'rgba(43,163,219,0)');g.addColorStop(.17,'rgba(43,163,219,.28)');g.addColorStop(.175,'rgba(43,163,219,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,R*.95,0,7);x.fill()}
        x.strokeStyle='rgba(104,197,219,.85)';x.lineWidth=1.5;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*R*.95,cy+Math.sin(a)*R*.95);x.stroke();
        for(const p of pts){
          p.born-=dt;if(p.born>0)continue;
          const d=((a-p.th)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
          if(d<.08){if(!p.seen)p.seen=1;else if(!p.ok)p.ok=1}
          if(p.ok&&d>Math.PI*1.9&&Math.random()<.004){p.ok=0;p.seen=0;p.th=Math.random()*Math.PI*2;p.r=.12+Math.random()*.82}
          if(!p.seen)continue;
          const px=cx+Math.cos(p.th)*p.r*R*.95,py=cy+Math.sin(p.th)*p.r*R*.95,col=p.ok?'104,197,219':'249,109,100',fade=Math.max(.35,1-d/5);
          x.fillStyle=`rgba(${col},${fade})`;x.beginPath();x.arc(px,py,p.ok?3:4,0,7);x.fill();
          if(!p.ok){x.strokeStyle=`rgba(${col},${fade*.5})`;x.beginPath();x.arc(px,py,9,0,7);x.stroke()}
        }
        x.fillStyle='rgba(104,197,219,.9)';x.beginPath();x.arc(cx,cy,4,0,7);x.fill();
      }
      if(!reduce)requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- risk statement: words light up as it crosses the screen ---------- */
  (function(){
    const mf=page.querySelector('[data-fill]');if(!mf)return;
    const wrap=n=>{if(n.nodeType===3){const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p))f.appendChild(document.createTextNode(p));else{const s=document.createElement('span');s.className='wd';s.textContent=p;f.appendChild(s)}});n.replaceWith(f)}else[...n.childNodes].forEach(wrap)};
    [...mf.childNodes].forEach(wrap);
    const words=[...mf.querySelectorAll('.wd')];
    if(reduce){words.forEach(w=>w.classList.add('on'));return}
    function upd(){const r=mf.getBoundingClientRect(),h=innerHeight;const p=Math.min(1,Math.max(0,(h*.85-r.top)/(r.height+h*.3)));const n=Math.round(p*words.length*1.05);words.forEach((w,i)=>w.classList.toggle('on',i<n))}
    addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
  })();

  /* ---------- dial: five sectors, one per assessed area ---------- */
  const dial=page.querySelector('.dial'),list=[...page.querySelectorAll('.fr-list li')],num=page.querySelector('.d-num');
  const secs=[];
  if(dial){const g=dial.querySelector('.d-secs'),ns='http://www.w3.org/2000/svg';
    for(let k=0;k<5;k++){const a0=k/5*Math.PI*2-Math.PI/2+.03,a1=(k+1)/5*Math.PI*2-Math.PI/2-.03,R=100,r=34;
      const P=(rr,aa)=>`${(Math.cos(aa)*rr).toFixed(2)} ${(Math.sin(aa)*rr).toFixed(2)}`;
      const p=document.createElementNS(ns,'path');p.setAttribute('d',`M${P(r,a0)} L${P(R,a0)} A${R} ${R} 0 0 1 ${P(R,a1)} L${P(r,a1)} A${r} ${r} 0 0 0 ${P(r,a0)}Z`);p.setAttribute('class','d-sec');g.appendChild(p);secs.push(p)}}
  function dialAt(n){secs.forEach((s,i)=>{s.classList.toggle('on',i<n);s.classList.toggle('cur',i===n-1)});list.forEach((l,i)=>l.classList.toggle('on',i<n));if(num)num.textContent=n+'/5'}

  if(!HAS||reduce){dialAt(5);return}
  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  let lenis=null;
  if(window.Lenis){
    lenis=new Lenis({lerp:.1,smoothWheel:true});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  }
  page.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));if(!el)return;e.preventDefault();
    if(lenis)lenis.scrollTo(el,{offset:-90,duration:1.2});else el.scrollIntoView({behavior:'smooth'});
  }));

  /* hero: the campaign name slams up, then the rest */
  const tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('.mega .ln>span',{yPercent:105,duration:1,stagger:.1})
    .from('.hero h1,.hero .lead,.hero .count',{y:20,opacity:0,duration:.6,stagger:.08,clearProps:'transform,opacity'},'-=.5')
    .from('.fcard',{y:40,opacity:0,duration:.8,clearProps:'transform,opacity'},.2);

  /* dial: pinned on desktop, the five areas light up one by one */
  const mm=gsap.matchMedia();
  mm.add('(min-width:961px)',()=>{
    ScrollTrigger.create({trigger:'.fronts',start:'top top',end:'+=160%',pin:'.fr-pin',onUpdate:s=>dialAt(Math.min(5,Math.floor(s.progress*5.6))),onLeaveBack:()=>dialAt(0)});
  });
  mm.add('(max-width:960px)',()=>{
    list.forEach((li,i)=>ScrollTrigger.create({trigger:li,start:'top 70%',onEnter:()=>dialAt(Math.max(i+1,secs.filter(s=>s.classList.contains('on')).length)),onLeaveBack:()=>dialAt(i)}));
  });

  /* deal facts and blocks */
  const rv=page.querySelectorAll('.deal p,.qa-grid>*,.vs-grid>div,.vs-foot,.path li,.final h2,.final-row>*,.more-grid>*');
  rv.forEach(el=>el.classList.add('rv'));
  const show=b=>gsap.to(b,{opacity:1,y:0,duration:.5,ease:'power2.out',stagger:.08,overwrite:true});
  ScrollTrigger.batch(rv,{start:'top 90%',onEnter:show,onEnterBack:show,onLeave:show});
  gsap.from('.zero',{yPercent:40,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:'.final',start:'top 70%'},clearProps:'transform,opacity'});
  ScrollTrigger.refresh();
})();
