/* Wispot LP · Black Friday
   Needs (in this order, before this file):
   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
   https://unpkg.com/lenis@1.1.13/dist/lenis.min.js
   Without them the page still works, just without motion. */
(function(){
  /* ---------- RD Station settings ---------- */
  const RD={
    publicToken:'94ef559c92f7b1764c0d7755f063425a',             // token público (o mesmo da LP "Monetize seu Wi-Fi")
    conversion:'black-friday-wispot-2026',                      // identificador da conversão
    thanks:'https://material.wispot.com.br/obrigado?event=leadBlackFriday',
    liveHosts:['wispot.com.br','rdstation.com','lp.rdstation.com.br'] // só envia leads quando a página está publicada
  };

  const page=document.getElementById('wbf');if(!page)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS=!!(window.gsap&&window.ScrollTrigger);

  /* ---------- full width inside RD Station's 960px column ---------- */
  function bleed(){
    const st=page.style;st.setProperty('margin-left','0px','important');st.setProperty('width','auto','important');
    const left=page.getBoundingClientRect().left,w=document.documentElement.clientWidth;
    st.setProperty('width',w+'px','important');st.setProperty('max-width',w+'px','important');st.setProperty('margin-left',(-left)+'px','important');
  }
  bleed();addEventListener('resize',()=>{bleed();if(window.ScrollTrigger)ScrollTrigger.refresh()});addEventListener('load',bleed);

  /* ---------- countdown ---------- */
  (function(){
    const end=Date.parse(page.dataset.end||'');const boxes=page.querySelectorAll('[data-count]');if(!boxes.length||isNaN(end))return;
    const pad=n=>String(n).padStart(2,'0');
    function tick(){
      let s=Math.max(0,Math.floor((end-Date.now())/1000));
      const v={d:Math.floor(s/86400),h:Math.floor(s%86400/3600),m:Math.floor(s%3600/60),s:s%60};
      boxes.forEach(b=>{b.querySelectorAll('[data-u]').forEach(el=>{const t=pad(v[el.dataset.u]);if(el.textContent!==t){el.textContent=t;if(!reduce){el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick')}}});
        if(!s){b.classList.add('over');const k=b.querySelector('.count-k');if(k)k.textContent='Oferta encerrada'}});
      if(s)setTimeout(tick,1000-Date.now()%1000);
    }
    tick();
  })();

  /* ---------- form → RD Station conversion ---------- */
  (function(){
    const form=document.getElementById('wbf-lead');if(!form)return;
    const msg=form.querySelector('.form-msg'),btn=form.querySelector('button[type=submit]');
    const live=RD.liveHosts.some(h=>location.hostname===h||location.hostname.endsWith('.'+h));
    const freeMail=/@(gmail|hotmail|outlook|yahoo|bol|uol|live|icloud)\./i;
    function say(t,cls){msg.className='form-msg'+(cls?' '+cls:'');msg.textContent=t}
    function utm(k){try{return new URLSearchParams(location.search).get(k)||undefined}catch(e){return undefined}}
    function trackId(){try{const m=document.cookie.match(/(?:^|; )rdtrk=([^;]+)/);return m?JSON.parse(decodeURIComponent(m[1])).id:undefined}catch(e){return undefined}}
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      form.querySelectorAll('.field').forEach(f=>f.classList.remove('err'));
      if(form.website.value)return; // bot
      const miss=[...form.querySelectorAll('[required]')].find(el=>!el.value.trim());
      if(miss){miss.closest('.field').classList.add('err');say('Preencha todos os campos marcados com *.','bad');miss.focus();return}
      const email=form.email.value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){form.email.closest('.field').classList.add('err');say('Confira o e-mail: falta o @ ou o domínio.','bad');form.email.focus();return}
      if(freeMail.test(email)){form.email.closest('.field').classList.add('err');say('Use o e-mail da sua empresa, não um e-mail pessoal.','bad');form.email.focus();return}
      if(!live){say('Prévia: tudo certo com o preenchimento. Na página publicada no RD Station, o lead é enviado e a pessoa vai para a página de obrigado.','ok');return}
      btn.disabled=true;say('Enviando…');
      const payload={conversion_identifier:RD.conversion,email,company_name:form.company.value.trim(),
        cf_numero_de_funcionarios:form.cf_numero_de_funcionarios.value,cf_segmento_da_empresa:form.cf_segmento_da_empresa.value,
        traffic_source:utm('utm_source'),traffic_medium:utm('utm_medium'),traffic_campaign:utm('utm_campaign'),traffic_value:utm('utm_term'),
        client_tracking_id:trackId()};
      try{
        const r=await fetch('https://api.rd.services/platform/conversions?api_key='+RD.publicToken,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_type:'CONVERSION',event_family:'CDP',payload})});
        if(!r.ok)throw new Error(r.status);
        say('Recebemos seus dados. Redirecionando…','ok');
        location.href=RD.thanks;
      }catch(err){
        btn.disabled=false;say('Não conseguimos enviar agora. Tente de novo em alguns segundos.','bad');
      }
    });
  })();

  /* ---------- client logos: fill the loop twice so it wraps seamlessly ---------- */
  (function(){
    const t=page.querySelector('.ctrack');if(!t||!t.children.length)return;
    const base=[...t.children];const per=Math.max(1,Math.ceil(8/base.length));
    for(let r=1;r<per*2;r++)base.forEach(c=>{const k=c.cloneNode(true);k.querySelector('img').alt='';k.setAttribute('aria-hidden','true');t.appendChild(k)});
  })();

  /* ---------- coupon notches sit on the dashed line ---------- */
  const coupon=page.querySelector('.coupon'),cpHead=page.querySelector('.cp-head');
  function notch(){if(coupon&&cpHead)coupon.style.setProperty('--cut',cpHead.offsetHeight+'px')}
  notch();addEventListener('resize',notch);if(document.fonts)document.fonts.ready.then(notch);

  /* ---------- crossing tapes: drift on their own, speed up with the scroll ---------- */
  const tapes=[...page.querySelectorAll('.tape .tk')].map((el,i)=>{el.innerHTML+=el.innerHTML;return {el,x:0,dir:i?1:-1}});
  let lastY=scrollY,vel=0;
  function tapeLoop(){
    const y=scrollY;vel+=((y-lastY)-vel)*.12;lastY=y;
    tapes.forEach(t=>{const w=t.el.scrollWidth/2||1;t.x+=t.dir*(reduce?0:(.6+Math.min(14,Math.abs(vel))*.5));if(t.x<-w)t.x+=w;if(t.x>0)t.x-=w;t.el.style.transform=`translate3d(${t.x}px,0,0)`});
    requestAnimationFrame(tapeLoop);
  }
  tapes.forEach(t=>{if(t.dir>0)t.x=-(t.el.scrollWidth/2)});
  requestAnimationFrame(tapeLoop);

  /* ---------- manifesto: words light up as it crosses the screen ---------- */
  (function(){
    const mf=page.querySelector('[data-fill]');if(!mf)return;
    const wrap=n=>{if(n.nodeType===3){const f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p))f.appendChild(document.createTextNode(p));else{const s=document.createElement('span');s.className='wd';s.textContent=p;f.appendChild(s)}});n.replaceWith(f)}else[...n.childNodes].forEach(wrap)};
    [...mf.childNodes].forEach(wrap);
    const words=[...mf.querySelectorAll('.wd')];
    if(reduce){words.forEach(w=>w.classList.add('on'));return}
    function upd(){const r=mf.getBoundingClientRect(),h=innerHeight;const p=Math.min(1,Math.max(0,(h*.85-r.top)/(r.height+h*.35)));const n=Math.round(p*words.length*1.05);words.forEach((w,i)=>w.classList.toggle('on',i<n))}
    addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
  })();

  /* ---------- scratch card ---------- */
  (function(){
    const card=page.querySelector('[data-scratch]');if(!card)return;
    const cv=card.querySelector('canvas'),x=cv.getContext('2d'),after=page.querySelector('[data-after]');
    let W=0,H=0,DPR=1,done=false,down=false,last=null,moves=0;
    function paint(){
      DPR=Math.min(2,devicePixelRatio||1);W=card.clientWidth;H=card.clientHeight;if(!W)return;
      cv.width=W*DPR;cv.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);x.globalCompositeOperation='source-over';
      x.fillStyle='#050608';x.fillRect(0,0,W,H);
      x.strokeStyle='rgba(37,168,224,.5)';x.lineWidth=3;x.lineCap='round';
      for(let yy=18;yy<H;yy+=38)for(let xx=(yy/38%2)*26+14;xx<W;xx+=52){x.beginPath();x.arc(xx,yy+8,10,Math.PI*1.2,Math.PI*1.8);x.stroke();x.beginPath();x.arc(xx,yy+8,4,Math.PI*1.25,Math.PI*1.75);x.stroke()}
      x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';
      x.font=`900 ${Math.round(W*.085)}px Montserrat,Arial,sans-serif`;x.fillText('RASPE AQUI',W/2,H/2-6);
      x.font=`700 ${Math.round(W*.03)}px "Space Mono",monospace`;x.fillStyle='#25a8e0';x.fillText('BLACK FRIDAY WISPOT',W/2,H/2+W*.065);
    }
    function pt(e){const r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
    function scratch(p){x.globalCompositeOperation='destination-out';x.strokeStyle='#000';x.globalAlpha=1;x.lineWidth=Math.max(36,W*.1);x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo((last||p).x,(last||p).y);x.lineTo(p.x,p.y);x.stroke();last=p;if(++moves%8===0)check()}
    function check(){
      const d=x.getImageData(0,0,cv.width,cv.height).data;let clear=0,n=0;
      for(let i=3;i<d.length;i+=4*97){n++;if(d[i]<40)clear++}
      if(clear/n>.5)reveal();
    }
    function reveal(){if(done)return;done=true;card.classList.add('done');if(after)after.hidden=false;confetti()}
    function confetti(){
      if(reduce)return;const cols=['#25a8e0','#ffffff','#050608','#0b91c1'];
      for(let i=0;i<46;i++){const s=document.createElement('i');const a=Math.random()*Math.PI*2,v=120+Math.random()*220;
        s.style.cssText=`position:absolute;left:50%;top:50%;width:${6+Math.random()*8}px;height:${10+Math.random()*10}px;background:${cols[i%4]};z-index:5;pointer-events:none;border:1px solid #050608`;
        card.appendChild(s);
        s.animate([{transform:'translate(-50%,-50%) rotate(0)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*v}px),calc(-50% + ${Math.sin(a)*v+120}px)) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:1100+Math.random()*700,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'}).onfinish=()=>s.remove()}
    }
    cv.addEventListener('pointerdown',e=>{if(done)return;down=true;last=null;cv.setPointerCapture(e.pointerId);scratch(pt(e))});
    cv.addEventListener('pointermove',e=>{if(down&&!done)scratch(pt(e))});
    const up=()=>{down=false;last=null;if(!done)check()};
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    /* keyboard and screen-reader users get the prize without scratching */
    cv.tabIndex=0;cv.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal()}});
    paint();addEventListener('resize',()=>{if(!done)paint()});if(document.fonts)document.fonts.ready.then(()=>{if(!done&&!moves)paint()});
  })();

  if(!HAS)return;
  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  let lenis=null;
  if(window.Lenis&&!reduce){
    lenis=new Lenis({lerp:.1,smoothWheel:true});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  }
  page.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));if(!el)return;e.preventDefault();
    if(lenis)lenis.scrollTo(el,{offset:-16,duration:1.2});else el.scrollIntoView({behavior:reduce?'auto':'smooth'});
  }));
  if(reduce)return;

  /* hero: giant lines slam up, then the rest */
  const tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('.giant .w',{yPercent:110,duration:1.1,stagger:.12})
    .from('.sticker',{scale:0,rotate:-160,duration:.9,ease:'back.out(1.8)'},'-=.5')
    .from('.hero .kicker,.hero .lede,.hero .deal,.hero .count',{y:24,opacity:0,duration:.8,stagger:.08,clearProps:'transform,opacity'},'-=.7')
    .from('.coupon',{y:80,rotate:8,opacity:0,duration:1,ease:'back.out(1.4)',clearProps:'transform,opacity'},.25);

  /* section reveals */
  const pop=(sel,vars)=>page.querySelectorAll(sel).forEach(el=>gsap.from(el,Object.assign({scrollTrigger:{trigger:el,start:'top 88%'},duration:.9,ease:'power3.out',clearProps:'transform,opacity'},vars)));
  pop('.sc-copy>*',{y:40,opacity:0,stagger:.08});
  pop('.scard',{scale:.6,rotate:-14,opacity:0,ease:'back.out(1.6)'});
  pop('.how h2,.how-head p',{y:50,opacity:0});
  page.querySelectorAll('.cards li').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%'},y:120,rotate:i%2?4:-4,opacity:0,duration:.9,delay:i*.08,ease:'back.out(1.3)',clearProps:'opacity,rotate'}));
  pop('.rc-copy>*',{y:40,opacity:0,stagger:.08});
  /* the receipt prints out */
  const rc=page.querySelector('.receipt');
  if(rc)gsap.fromTo(rc,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 -20px 0)',ease:'none',scrollTrigger:{trigger:rc,start:'top 85%',end:'top 30%',scrub:.6}});
  pop('.final h2',{y:60,opacity:0});
  pop('.final .count-n span',{y:50,opacity:0,stagger:.08,ease:'back.out(1.6)'});
  ScrollTrigger.refresh();
})();
