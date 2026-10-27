/* Pro Advanced LP · Certificação TPN
   Needs (in this order, before this file):
   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
   https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
   https://unpkg.com/lenis@1.1.13/dist/lenis.min.js
   Without them the page still works, just without the scroll motion. */
(function(){
  /* ---------- RD Station settings (the same as the current TPN page) ---------- */
  const RD={
    publicToken:'8642f7d78d8931170d08ae3c51495718',   // token público da conta Pro Advanced
    conversion:'lp-tpn',                              // identificador da conversão
    thanks:'',                                        // página de obrigado; vazio = mensagem no próprio formulário
    liveHosts:['proadvanced.com.br','rdstation.com','lp.rdstation.com.br']
  };

  const page=document.getElementById('ptpn');if(!page)return;
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
    const form=document.getElementById('ptpn-lead');if(!form)return;
    const msg=form.querySelector('.form-msg'),btn=form.querySelector('button[type=submit]');
    const live=RD.liveHosts.some(h=>location.hostname===h||location.hostname.endsWith('.'+h));
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
      if(!live){say('Prévia: tudo certo com o preenchimento. Na página publicada no RD Station, o lead é enviado para a conversão "lp-tpn".','ok');return}
      btn.disabled=true;say('Enviando…');
      const payload={conversion_identifier:RD.conversion,name:form.name.value.trim(),email,company_name:form.company.value.trim(),
        cf_cargoselecao:form.cf_cargoselecao.value,
        traffic_source:utm('utm_source'),traffic_medium:utm('utm_medium'),traffic_campaign:utm('utm_campaign'),traffic_value:utm('utm_term'),
        client_tracking_id:trackId()};
      try{
        const r=await fetch('https://api.rd.services/platform/conversions?api_key='+RD.publicToken,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_type:'CONVERSION',event_family:'CDP',payload})});
        if(!r.ok)throw new Error(r.status);
        if(RD.thanks){location.href=RD.thanks;return}
        form.reset();btn.disabled=false;say('Recebemos seus dados. Um especialista da Pro Advanced vai entrar em contato.','ok');
      }catch(err){
        btn.disabled=false;say('Não conseguimos enviar agora. Tente de novo em alguns segundos.','bad');
      }
    });
  })();

  /* ---------- YouTube: load the player only on click ---------- */
  page.querySelectorAll('.yt[data-yt]').forEach(b=>b.addEventListener('click',()=>{
    const f=document.createElement('iframe');f.src=`https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0`;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title='Vídeo sobre a Certificação TPN';
    b.replaceChildren(f);b.style.cursor='default';
  },{once:true}));

  if(!HAS||reduce)return;
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

  /* hero in */
  gsap.from('.hero .tag,.hero h1,.hero .lead,.hero .ticks li',{y:26,opacity:0,duration:.9,ease:'power3.out',stagger:.08,delay:.1,clearProps:'transform,opacity'});
  gsap.from('.fcard',{y:36,opacity:0,duration:1,ease:'power3.out',delay:.25,clearProps:'transform,opacity'});

  /* reveals */
  const rv=page.querySelectorAll('.sec .kicker,.sec h2,.sec .lead,.seal-card,.player,.grid>li,.cta .btn');
  rv.forEach(el=>el.classList.add('rv'));
  const show=b=>gsap.to(b,{opacity:1,y:0,duration:.8,ease:'power3.out',stagger:.08,overwrite:true});
  ScrollTrigger.batch(rv,{start:'top 90%',onEnter:show,onEnterBack:show,onLeave:show});
  gsap.from('.seal-ck',{strokeDasharray:60,strokeDashoffset:60,duration:.8,ease:'power2.out',scrollTrigger:{trigger:'.seal-card',start:'top 80%'}});
  ScrollTrigger.refresh();
})();
