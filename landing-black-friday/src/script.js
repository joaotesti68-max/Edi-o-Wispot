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
      if(freeMail.test(email)){form.email.closest('.field').classList.add('err');say('Use o e-mail da sua empresa, não um e-mail pessoal.','bad');form.email.focus();return}
      if(!live){say('Prévia: tudo certo com o preenchimento. Na página publicada no RD Station, o lead é enviado e a pessoa vai para a página de obrigado.','ok');return}
      btn.disabled=true;say('Enviando…');
      const payload={conversion_identifier:RD.conversion,email,mobile_phone:'+55'+phone,company_name:form.company.value.trim(),
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
    .from('.hero .kicker,.hero .lede,.hero .deal,.hero .deal-sub,.hero .count',{y:24,opacity:0,duration:.8,stagger:.08,clearProps:'transform,opacity'},'-=.7')
    .from('.coupon',{y:60,opacity:0,duration:1,ease:'power3.out',clearProps:'transform,opacity'},.25);

  /* section reveals */
  const pop=(sel,vars)=>page.querySelectorAll(sel).forEach(el=>gsap.from(el,Object.assign({scrollTrigger:{trigger:el,start:'top 88%'},duration:.9,ease:'power3.out',clearProps:'transform,opacity'},vars)));
  pop('.mf-more>*',{y:30,opacity:0,stagger:.1});
  pop('.how h2,.how-head p',{y:40,opacity:0});
  page.querySelectorAll('.cards li').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 92%'},y:60,opacity:0,duration:.9,delay:i*.08,ease:'power3.out',clearProps:'transform,opacity'}));
  pop('.offer h2',{y:40,opacity:0});
  page.querySelectorAll('.eq>*').forEach((el,i)=>gsap.from(el,{scrollTrigger:{trigger:'.eq',start:'top 85%'},y:40,scale:.9,opacity:0,duration:.7,delay:i*.1,ease:'back.out(1.5)',clearProps:'transform,opacity'}));
  pop('.final h2',{y:60,opacity:0});
  pop('.final .count-n span',{y:50,opacity:0,stagger:.08,ease:'back.out(1.6)'});
  ScrollTrigger.refresh();
})();
