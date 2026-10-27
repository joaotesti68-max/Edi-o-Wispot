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

  /* ---------- background: video frames get certified (lock) as the page scrolls ----------
     Exposed frames are dim and leak little dots; a scan beam sweeps across and protects every frame
     whose turn has come. The share of protected frames follows the scroll: about 20% at the top, 100% at the end. */
  (function(){
    const c=page.querySelector('.vault');if(!c)return;const x=c.getContext('2d');
    const pctEl=page.querySelector('[data-pct]'),bar=page.querySelector('[data-bar]');
    let W,H,DPR,cw,ch,gap,cols,rows,cells=[],leaks=[],beam=-.2,goal=.2,shown=0,lastT=performance.now();
    function size(){
      DPR=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;c.width=W*DPR;c.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);
      const m=W<700;cw=m?58:84;ch=m?34:48;gap=m?14:20;cols=Math.ceil(W/(cw+gap))+1;rows=Math.ceil(H/(ch+gap))+2;
      const old=cells;cells=[];
      for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const i=r*cols+k;cells.push({k,r,rank:old[i]?old[i].rank:Math.random(),p:old[i]?old[i].p:0,flash:0,seed:Math.random()})}
    }
    function progress(){const max=document.documentElement.scrollHeight-innerHeight;const pr=max>0?Math.min(1,Math.max(0,scrollY/max)):1;return .2+.8*pr}
    function lock(cx,cy,s,a){x.strokeStyle=`rgba(104,197,219,${a})`;x.lineWidth=1.4;x.beginPath();x.arc(cx,cy-s*.35,s*.32,Math.PI,0);x.stroke();x.fillStyle=`rgba(104,197,219,${a})`;x.fillRect(cx-s*.45,cy-s*.35,s*.9,s*.7)}
    function draw(now){
      const dt=Math.min(.05,(now-lastT)/1000);lastT=now;
      goal=progress();
      if(!reduce){beam+=dt*.16;if(beam>1.25)beam=-.25}
      x.clearRect(0,0,W,H);
      const off=reduce?0:(scrollY*.12)%(ch+gap),bx=beam*W;
      for(const e of cells){
        const px=e.k*(cw+gap)-(e.r%2)*(cw+gap)/2,py=e.r*(ch+gap)-off;
        if(py>H||py+ch<0)continue;
        /* the beam certifies the frames whose turn has come */
        if(e.p<1&&e.rank<goal&&(reduce||Math.abs(px+cw/2-bx)<cw)){if(e.p===0)e.flash=1;e.p=1}
        if(e.flash>0)e.flash=Math.max(0,e.flash-dt*1.6);
        if(e.p){
          x.fillStyle=`rgba(43,163,219,${.03+e.flash*.18})`;x.fillRect(px,py,cw,ch);
          x.strokeStyle=`rgba(43,163,219,${.2+e.flash*.45})`;x.lineWidth=1;x.strokeRect(px+.5,py+.5,cw-1,ch-1);
          lock(px+cw/2,py+ch/2+2,ch*.3,.24+e.flash*.5);
        }else{
          x.strokeStyle='rgba(201,214,228,.06)';x.lineWidth=1;x.strokeRect(px+.5,py+.5,cw-1,ch-1);
          x.fillStyle='rgba(201,214,228,.025)';for(let l=py+6;l<py+ch-4;l+=6)x.fillRect(px+5,l,(cw-10)*(.4+.6*((e.seed*97+l)%1)),1.5);
          if(!reduce&&Math.random()<dt*.35*e.seed)leaks.push({x:px+Math.random()*cw,y:py+Math.random()*ch,vx:(Math.random()-.5)*30,vy:-12-Math.random()*26,life:1});
        }
      }
      /* leaking dots from exposed frames */
      for(let i=leaks.length-1;i>=0;i--){const l=leaks[i];l.x+=l.vx*dt;l.y+=l.vy*dt;l.life-=dt*.7;if(l.life<=0){leaks.splice(i,1);continue}
        x.fillStyle=`rgba(249,109,100,${.42*l.life})`;x.fillRect(l.x,l.y,2,2)}
      if(leaks.length>160)leaks.splice(0,leaks.length-160);
      /* scan beam */
      if(!reduce&&beam>-.1&&beam<1.1){const g=x.createLinearGradient(bx-120,0,bx+4,0);g.addColorStop(0,'rgba(43,163,219,0)');g.addColorStop(1,'rgba(104,197,219,.14)');x.fillStyle=g;x.fillRect(bx-120,0,124,H);x.fillStyle='rgba(104,197,219,.4)';x.fillRect(bx,0,1.5,H)}
      /* meter */
      const vis=cells.filter(e=>{const py=e.r*(ch+gap)-off;return py<H&&py+ch>0});
      const real=vis.length?vis.filter(e=>e.p).length/vis.length:0;shown+=(real-shown)*Math.min(1,dt*4);
      const pct=Math.round(shown*100)+'%';if(pctEl&&pctEl.textContent!==pct){pctEl.textContent=pct;if(bar)bar.style.width=pct}
      requestAnimationFrame(draw);
    }
    size();addEventListener('resize',size);requestAnimationFrame(draw);
  })();

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
