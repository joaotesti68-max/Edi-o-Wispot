/* Wispot LP · Black Friday
   Needs (in this order, before this file):
   https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
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
  const WIFI='{{WIFI_DATA}}',LOGO='{{LOGO_DATA}}';

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
      boxes.forEach(b=>{b.querySelectorAll('[data-u]').forEach(el=>{const t=pad(v[el.dataset.u]);if(el.textContent!==t)el.textContent=t});
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

  /* ---------- particle field: one cloud that reshapes for each section ----------
     Dots are white over blue pages and blue over white/gray pages; the color is picked per pixel,
     so a dot crossing a page edge changes color right at the edge. */
  const gl=(function(){
    const canvas=page.querySelector('.wbf-gl');
    if(!canvas||!window.THREE)return null;
    let renderer;
    try{renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true,powerPreference:'high-performance'})}catch(e){return null}
    renderer.setClearColor(0x000000,0);
    const mobile=()=>innerWidth<900;
    const N=mobile()?4200:9000;
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(40,1,.1,100);cam.position.set(0,0,10);
    let W=1,H=1,PR=1,halfH=Math.tan(THREE.MathUtils.degToRad(20))*10,halfW=halfH;

    const pos=new Float32Array(N*3),seed=new Float32Array(N),alpha=new Float32Array(N),k=new Float32Array(N);
    for(let i=0;i<N;i++){seed[i]=Math.random();k[i]=.025+Math.random()*.05;alpha[i]=0;
      pos[i*3]=(Math.random()*2-1)*8;pos[i*3+1]=-6-Math.random()*4;pos[i*3+2]=(Math.random()*2-1)*2}
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    geo.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));
    geo.setAttribute('aAlpha',new THREE.BufferAttribute(alpha,1));
    const V4=()=>new THREE.Vector4(1,1,1,0);
    const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,
      uniforms:{uTime:{value:0},uPR:{value:1},uSize:{value:2.4},uOpacity:{value:1},uE:{value:new THREE.Vector3(-1,-1,-1)},uC0:{value:V4()},uC1:{value:V4()},uC2:{value:V4()},uC3:{value:V4()}},
      vertexShader:`attribute float aSeed;attribute float aAlpha;uniform float uTime,uPR,uSize;varying float vA;
        void main(){vec3 p=position;p.x+=sin(uTime*.7+aSeed*40.)*.03;p.y+=cos(uTime*.6+aSeed*31.)*.03;
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
          gl_PointSize=uSize*uPR*(.6+aSeed*.85)*(10./-mv.z);
          vA=aAlpha*(.75+.25*sin(uTime*2.2+aSeed*60.));}`,
      fragmentShader:`uniform float uOpacity;uniform vec3 uE;uniform vec4 uC0,uC1,uC2,uC3;varying float vA;
        void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=smoothstep(.5,.15,d);
          float y=gl_FragCoord.y;vec4 c=uC0;if(y<uE.x)c=uC1;if(y<uE.y)c=uC2;if(y<uE.z)c=uC3;
          gl_FragColor=vec4(c.rgb,a*vA*uOpacity*c.a);}`});
    const pts=new THREE.Points(geo,mat);scene.add(pts);

    /* page color under each band of the screen */
    const DOT={'t-blue':[1,1,1,.92],'t-white':[.145,.659,.878,.85],'t-gray':[.32,.73,.9,.95]};
    const pages=[...page.querySelectorAll(':scope>.ticker,:scope>section,:scope>footer')].map(el=>({el,c:DOT[['t-blue','t-white','t-gray'].find(t=>el.classList.contains(t))||'t-gray']}));
    function bands(){
      const vis=[];for(const p of pages){const r=p.el.getBoundingClientRect();if(r.bottom>0&&r.top<H)vis.push([r.bottom,p.c])}
      const U=mat.uniforms,cs=[U.uC0,U.uC1,U.uC2,U.uC3],e=[-1,-1,-1];
      for(let i=0;i<4;i++){const v=vis[Math.min(i,vis.length-1)];if(v)cs[i].value.set(...v[1])}
      for(let i=0;i<3&&i<vis.length-1;i++)e[i]=(H-vis[i][0])*PR;
      U.uE.value.set(e[0],e[1],e[2]);
    }

    /* shapes: points sampled from a 2D drawing, alpha = keep probability */
    function sample(draw,n,S){
      S=S||256;const c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');
      draw(x,S);
      const d=x.getImageData(0,0,S,S).data,cand=[];
      for(let y=0;y<S;y++)for(let xx=0;xx<S;xx++){const a=d[(y*S+xx)*4+3];if(a>8)cand.push(xx,y,a)}
      const out=new Float32Array(n*3);if(!cand.length)return out;
      let i=0,guard=0;const m=cand.length/3;
      while(i<n&&guard<n*60){guard++;const j=(Math.random()*m|0)*3;if(Math.random()*255>cand[j+2])continue;
        out[i*3]=((cand[j]+Math.random())/S)*2-1;out[i*3+1]=1-((cand[j+1]+Math.random())/S)*2;out[i*3+2]=(Math.random()*2-1)*.1;i++}
      for(;i<n;i++){const j=(Math.random()*m|0)*3;out[i*3]=cand[j]/S*2-1;out[i*3+1]=1-cand[j+1]/S*2;out[i*3+2]=0}
      return out;
    }
    const fit=(x,S,im,w)=>{const h=w*im.height/im.width;x.drawImage(im,(S-w)/2,(S-h)/2,w,h)};
    const SH={};
    SH.bag=sample((x,S)=>{const s=S/256;x.lineJoin='round';x.lineCap='round';
      x.fillStyle='rgba(255,255,255,.2)';x.strokeStyle='#fff';x.lineWidth=10*s;
      x.beginPath();x.moveTo(58*s,92*s);x.lineTo(198*s,92*s);x.lineTo(210*s,228*s);x.lineTo(46*s,228*s);x.closePath();x.fill();x.stroke();
      x.lineWidth=12*s;x.beginPath();x.arc(128*s,94*s,38*s,Math.PI,0);x.stroke();
      x.fillStyle='#fff';x.font=`600 ${92*s}px Outfit,Montserrat,Arial,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('%',128*s,164*s)},N);
    SH.pct=sample((x,S)=>{const s=S/256;x.fillStyle='#fff';x.font=`600 ${230*s}px Outfit,Montserrat,Arial,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('%',128*s,136*s)},N);
    SH.field=(()=>{const o=new Float32Array(N*3);for(let i=0;i<N;i++){o[i*3]=(Math.random()*2-1);o[i*3+1]=(Math.random()*2-1);o[i*3+2]=(Math.random()*2-1)*2.2}return o})();
    /* the Wispot Wi-Fi icon and the logo come from the brand files */
    SH.wifi=sample((x,S)=>{const s=S/256;x.strokeStyle='#fff';x.lineCap='round';x.lineWidth=26*s;
      [[96,1.25,1.75],[56,1.27,1.73]].forEach(([r,a,b])=>{x.beginPath();x.arc(128*s,176*s,r*s,Math.PI*a,Math.PI*b);x.stroke()});
      x.fillStyle='#fff';x.beginPath();x.arc(128*s,196*s,17*s,0,7);x.fill()},N);
    SH.icon=SH.wifi;
    function load(src,cb){if(!src||src.indexOf('data:')!==0)return;const im=new Image();im.onload=()=>cb(im);im.src=src}
    load(WIFI,im=>{SH.wifi=sample((x,S)=>fit(x,S,im,S*.96),N);if(cur==='wifi')place()});
    load(LOGO,im=>{SH.icon=sample((x,S)=>fit(x,S,im,S*.98),N,320);if(cur==='icon')place()});

    /* where each shape sits: opposite the text on desktop, centered and lighter on phones */
    const LAYOUT={
      bag:{x:.5,y:0,s:.8,op:1},
      wifi:{x:-.48,y:.02,s:.9,op:1},
      pct:{x:.52,y:0,s:.82,op:1},
      field:{x:0,y:0,s:1,op:.5},
      icon:{x:0,y:.52,s:.8,op:1,my:.66}
    };
    const tgt=new Float32Array(N*3);let cur='waves',opT=1;
    function place(){
      if(cur==='waves')return;
      const L=LAYOUT[cur],src=SH[cur],m=mobile(),F=cur==='field';
      const sc=(m?Math.min(halfW*.95,halfH*.62):Math.min(halfH*.88,halfW*.5))*L.s*(cur==='icon'?(m?1:1.5):1);
      const cx=m?0:L.x*halfW,cy=m?(L.my!==undefined?L.my*halfH:halfH*.08):L.y*halfH;
      for(let i=0;i<N;i++){tgt[i*3]=cx+src[i*3]*(F?halfW*1.1:sc);tgt[i*3+1]=cy+src[i*3+1]*(F?halfH*1.1:sc);tgt[i*3+2]=src[i*3+2]*(F?1:sc*.8)}
      opT=(m&&cur!=='icon'?.55:1)*L.op;
    }
    function set(name){if(name===cur||(!SH[name]&&name!=='waves'))return;cur=name;place();if(name==='waves')opT=1}

    function size(){
      W=innerWidth;H=innerHeight;PR=Math.min(2,devicePixelRatio||1);
      renderer.setPixelRatio(PR);renderer.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix();
      halfW=halfH*cam.aspect;mat.uniforms.uPR.value=PR;mat.uniforms.uSize.value=mobile()?2.3:2.5;place();
    }
    size();addEventListener('resize',size);

    let mx=0,my=0;addEventListener('pointermove',e=>{mx=e.clientX/W*2-1;my=e.clientY/H*2-1},{passive:true});
    let t0=performance.now(),last=t0,running=true;
    document.addEventListener('visibilitychange',()=>{running=!document.hidden;if(running){last=performance.now();requestAnimationFrame(loop)}});
    function loop(now){
      if(!running)return;
      const dt=Math.min(.1,(now-last)/1000);last=now;const t=(now-t0)/1000;
      mat.uniforms.uTime.value=t;
      mat.uniforms.uOpacity.value+=(opT-mat.uniforms.uOpacity.value)*Math.min(1,dt*3);
      if(cur==='waves'){
        /* the opening: Wi-Fi waves rising from the bottom of the blue cover, every dot a visitor */
        const m=mobile(),R=halfW*1.25+halfH,ox=m?0:-halfW*.1,oy=-halfH*1.1;
        for(let i=0;i<N;i++){const s=seed[i],ring=(i%12)/12;
          const r=((ring+t*.04+s*.01)%1)*R;const a=Math.PI*(.14+.72*((i*.618034)%1));
          tgt[i*3]=ox+Math.cos(a)*r;tgt[i*3+1]=oy+Math.sin(a)*r*.8;tgt[i*3+2]=(s-.5)*1.2;
          const fade=Math.min(1,r/(R*.08))*(1-r/R);
          alpha[i]+=((.15+.85*fade)*(.45+s*.55)-alpha[i])*Math.min(1,dt*6);
        }
      }else{
        for(let i=0;i<N;i++)alpha[i]+=((.55+seed[i]*.45)-alpha[i])*Math.min(1,dt*3);
      }
      const fr=dt*60*(cur==='waves'?2.2:1);
      for(let i=0;i<N;i++){const kk=1-Math.pow(1-k[i],fr);for(let j=i*3;j<i*3+3;j++)pos[j]+=(tgt[j]-pos[j])*kk}
      geo.attributes.position.needsUpdate=true;geo.attributes.aAlpha.needsUpdate=true;
      const sway=(cur==='waves'||cur==='icon')?0:Math.sin(t*.35)*.12;
      pts.rotation.y+=((reduce?0:sway+mx*.1)-pts.rotation.y)*.04;
      pts.rotation.x+=((reduce?0:my*.05)-pts.rotation.x)*.04;
      bands();
      renderer.render(scene,cam);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return {set};
  })();

  /* which section owns the middle of the screen decides the shape */
  const secs=[...page.querySelectorAll('[data-shape]')];
  function pick(){
    if(!gl)return;const y=innerHeight*.5;let s=secs[0];
    for(const el of secs){const r=el.getBoundingClientRect();if(r.top<=y)s=el}
    gl.set(s.dataset.shape);
  }
  addEventListener('scroll',pick,{passive:true});addEventListener('resize',pick);pick();

  if(!HAS)return;
  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll (desktop) */
  let lenis=null;
  if(window.Lenis&&!reduce){
    lenis=new Lenis({lerp:.1,smoothWheel:true});
    lenis.on('scroll',()=>{ScrollTrigger.update();pick()});
    gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  }
  page.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const el=document.querySelector(a.getAttribute('href'));if(!el)return;e.preventDefault();
    if(lenis)lenis.scrollTo(el,{offset:-16,duration:1.4});else el.scrollIntoView({behavior:reduce?'auto':'smooth'});
  }));
  if(reduce)return;

  /* hero intro */
  const intro=page.querySelectorAll('.hero h1,.hero .lede,.hero .deal,.hero .count');
  gsap.from(intro,{y:30,opacity:0,duration:1,ease:'power3.out',stagger:.09,delay:.1,clearProps:'transform,opacity'});
  gsap.from('#wbf-lead',{y:40,opacity:0,duration:1.1,ease:'power3.out',delay:.3,clearProps:'transform,opacity'});

  /* reveals */
  const rv=page.querySelectorAll('.split .rule,.split h2,.split p,.steps li,.perks li,.split .btn,.clients .head>*,.final h2,.final .count,.final .btn');
  rv.forEach(el=>el.classList.add('rv'));
  const show=b=>gsap.to(b,{opacity:1,y:0,duration:.9,ease:'power3.out',stagger:.08,overwrite:true});
  ScrollTrigger.batch(rv,{start:'top 88%',onEnter:show,onEnterBack:show,onLeave:show});
  /* anything already on screen at load */
  ScrollTrigger.refresh();
})();
