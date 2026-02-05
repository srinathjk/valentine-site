/* Valentine PRO+++ — Bigger Countdown, No Nickam, Floating 7 photos from /img (1.jpg..7.jpg) */
(()=> {
 // ====== Utility ======
 const TAU = Math.PI * 2;
 const $ = sel => document.querySelector(sel);
 const $$ = sel => Array.from(document.querySelectorAll(sel));
 const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
 const rn = (a,b) => Math.random()* (b-a)+a;
 // ====== Theme & Sound ======
 const palettes = [
 {p1:'#ff4d94',p2:'#ff9ecf',p3:'#ffd1e8',bg:'#0e0a1a',bg2:'#1a1230'},
 {p1:'#ff8e6e',p2:'#ffd6a5',p3:'#fff3b0',bg:'#0a0f1a',bg2:'#172437'},
 {p1:'#6ef3ff',p2:'#b6f0ff',p3:'#e5fbff',bg:'#0a0b1a',bg2:'#12203a'},
 {p1:'#b16cff',p2:'#dba9ff',p3:'#f4e2ff',bg:'#120a1a',bg2:'#1f0e32'}
 ];
 function applyTheme(t){ const r = document.documentElement; r.style.setProperty('--p1', t.p1); r.style.setProperty('--p2', t.p2); r.style.setProperty('--p3', t.p3); r.style.setProperty('--bg', t.bg); r.style.setProperty('--bg2', t.bg2); }
 $('#themeBtn')?.addEventListener('click', () => applyTheme(palettes[(Math.random()*palettes.length)|0]));
 let audioCtx = null, soundOn = true;
 function ping(freq = 660){ if (!soundOn) return; if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)(); const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0; o.connect(g); g.connect(audioCtx.destination); o.start(); const t = audioCtx.currentTime; g.gain.linearRampToValueAtTime(0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35); o.stop(t + 0.4); }
 $('#soundBtn')?.addEventListener('click', () => { soundOn = !soundOn; $('#soundBtn').textContent = soundOn ? '🔈' : '🔇'; ping(520); });
 // ====== Background Hearts (bg canvas) ======
 const bg = document.getElementById('bg');
 const bctx = bg.getContext('2d');
 let bw, bh, bdpr;
 function bResize(){ bdpr = Math.min(2, window.devicePixelRatio||1); bw = bg.width = Math.floor(innerWidth*bdpr); bh = bg.height = Math.floor(innerHeight*bdpr); bg.style.width = innerWidth+'px'; bg.style.height = innerHeight+'px'; }
 addEventListener('resize', bResize, {passive:true}); bResize();
 function drawHeart(ctx, x, y, s, color, rot=0, a=1){ ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.scale(s,s); ctx.globalAlpha = a; ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0,-0.35); ctx.bezierCurveTo(0.5,-1.1,1.6,-0.05,0,0.9); ctx.bezierCurveTo(-1.6,-0.05,-0.5,-1.1,0,-0.35); ctx.closePath(); ctx.fill(); ctx.restore(); }
 const floaters = Array.from({length:150}, () => ({ x: rn(0,bw), y: rn(0,bh), vx: rn(-0.15,0.15)*bdpr, vy: -rn(0.08,0.4)*bdpr, s: rn(6,14)*bdpr, rot: rn(0,TAU), rv: rn(-0.004,0.004), a: rn(0.25,0.6), c: Math.random()<0.6?'#ff4d94':'#ff9ecf' }));
 const bursts = [];
 function fireworks(x,y){ const n = 42, d = bdpr; const parts = []; for (let i=0;i<n;i++){ const ang = i/n*TAU + rn(-0.12,0.12); const sp = rn(1.2,3.2)*d; parts.push({x:x*d,y:y*d,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,g:0.02*d,life: rn(70,130),s:rn(5,12)*d,rot:rn(0,TAU),rv:rn(-0.06,0.06),c: Math.random()<0.5?'#ff6aa6':'#ffd1e8'}); } bursts.push(parts); ping(720); }
 addEventListener('click', e => { if (!drawMode) fireworks(e.clientX,e.clientY); });
 const trail = [];
 addEventListener('pointermove', e => { if (!drawMode) trail.push({x:e.clientX*bdpr,y:e.clientY*bdpr,s:rn(4,8)*bdpr,life:40}); });
 function bgTick(){ bctx.clearRect(0,0,bw,bh); for (const p of floaters){ p.x += p.vx; p.y += p.vy; p.rot += p.rv; if (p.y < -30*bdpr){ p.x = rn(0,bw); p.y = bh+rn(0,60)*bdpr; p.a = rn(0.25,0.6);} drawHeart(bctx,p.x,p.y,p.s,p.c,p.rot,p.a); } for (let b = bursts.length-1; b>=0; b--){ const parts = bursts[b]; for (let i=parts.length-1;i>=0;i--){ const q = parts[i]; q.x += q.vx; q.y += q.vy; q.vy += q.g; q.rot += q.rv; q.life--; const a = Math.max(0, Math.min(1, q.life/120)); drawHeart(bctx,q.x,q.y,q.s,q.c,q.rot,a); if (q.life<=0) parts.splice(i,1);} if (!parts.length) bursts.splice(b,1); } for (let i=trail.length-1; i>=0; i--){ const t = trail[i]; t.y -= 0.6*bdpr; t.life--; const a = Math.max(0,t.life/40); drawHeart(bctx,t.x,t.y,t.s,'#ffd1e8',0,a); if (t.life<=0) trail.splice(i,1); } requestAnimationFrame(bgTick); } bgTick();
 // ====== FX Canvas: Ripples + Sparkles + Draw mode ======
 const fx = document.getElementById('fx');
 const fctx = fx.getContext('2d');
 let fw, fh;
 function fResize(){ const d = Math.min(2, window.devicePixelRatio||1); fw = fx.width = Math.floor(innerWidth*d); fh = fx.height = Math.floor(innerHeight*d); fx.style.width = innerWidth+'px'; fx.style.height = innerHeight+'px'; }
 addEventListener('resize', fResize, {passive:true}); fResize();
 const ripples = []; // {x,y,r,max,alpha}
 addEventListener('dblclick', e => { const d = Math.min(2, window.devicePixelRatio||1); ripples.push({x:e.clientX*d,y:e.clientY*d,r:8,max:Math.hypot(fw,fh)/3,alpha:0.65}); ping(640); });
 const titleEl = $('.title');
 function titleBox(){ const r = titleEl?.getBoundingClientRect(); const d = Math.min(2, window.devicePixelRatio||1); if (!r) return {x:fw/2,y:fh*0.2,w:0,h:0,d}; return {x:r.left*d,y:r.top*d,w:r.width*d,h:r.height*d,d}; }
 let drawMode = false; const drawBtn = $('#drawBtn');
 drawBtn?.addEventListener('click', ()=>{ drawMode = !drawMode; drawBtn.textContent = drawMode ? '✍️ Draw: On' : '✍️ Draw: Off'; ping(drawMode?700:520); });
 let drawing = false;
 addEventListener('pointerdown', e => { if (drawMode){ drawing = true; addHeartStroke(e); }});
 addEventListener('pointerup', ()=> drawing=false);
 addEventListener('pointermove', e => { if (drawMode && drawing) addHeartStroke(e); });
 function addHeartStroke(e){ const d = Math.min(2, window.devicePixelRatio||1); drawHearts(e.clientX*d, e.clientY*d); }
 const garlands = []; // transient drawn hearts
 function drawHearts(x,y){ for (let i=0;i<4;i++){ garlands.push({x:x+rn(-14,14),y:y+rn(-14,14),s:rn(4,10),life:60,c: Math.random()<0.5?'#ff6aa6':'#ffd1e8',rot:rn(0,TAU)}); }}
 function fxTick(){ fctx.clearRect(0,0,fw,fh); for (let i=ripples.length-1;i>=0;i--){ const rp = ripples[i]; fctx.beginPath(); fctx.arc(rp.x,rp.y,rp.r,0,TAU); fctx.strokeStyle = `rgba(255,255,255,${rp.alpha})`; fctx.lineWidth = 2; fctx.stroke(); rp.r += 6; rp.alpha *= 0.96; if (rp.r>rp.max || rp.alpha<0.02) ripples.splice(i,1); } const tb = titleBox(); if (Math.random()<0.15){ garlands.push({x: tb.x + tb.w*rn(0.2,0.8), y: tb.y + tb.h*rn(0.2,0.9), s: rn(3,7), life: 40, c:'#ffd1e8', rot:rn(0,TAU)}); } for (let i=garlands.length-1;i>=0;i--){ const g = garlands[i]; drawHeart(fctx,g.x,g.y,g.s,g.c,g.rot, Math.max(0,g.life/60)); g.life--; if (g.life<=0) garlands.splice(i,1); } requestAnimationFrame(fxTick); } fxTick();
 // ====== Countdown (bigger chip in Hero) ======
 const countdownEl = $('#countdown');
 function nextValentine(){ const now = new Date(); let year = now.getFullYear(); const val = new Date(year,1,14,0,0,0); if (now > val) year++; return new Date(year,1,14,0,0,0); }
 function updateCountdown(){ const now = new Date(); const target = nextValentine(); const diff = target - now; if (diff <= 0){ countdownEl.textContent = "It’s today — Happy Valentine’s Day!"; return; } const sec = Math.floor(diff/1000)%60; const min = Math.floor(diff/1000/60)%60; const hr = Math.floor(diff/1000/60/60)%24; const day = Math.floor(diff/1000/60/60/24); countdownEl.textContent = `${day}d ${hr}h ${min}m ${sec}s`; }
 updateCountdown(); setInterval(updateCountdown, 1000);
 // ====== Particle Name (canvas #particles) ======
 const pc = document.getElementById('particles');
 const pctx = pc.getContext('2d');
 let pw = 960, ph = 360, pdpr;
 function pResize(){ pdpr = Math.min(2, window.devicePixelRatio||1); const r = pc.getBoundingClientRect(); pw = pc.width = Math.floor(r.width*pdpr); ph = pc.height = Math.floor(360*pdpr*(r.width/960)); }
 addEventListener('resize', pResize, {passive:true}); pResize();
 const off = document.createElement('canvas'); const octx = off.getContext('2d');
 function textPoints(txt){ const W = Math.floor(pw*0.9), H = Math.floor(ph*0.7); off.width=W; off.height=H; octx.clearRect(0,0,W,H); octx.fillStyle='#fff'; let size=Math.floor(Math.min(W/(txt.length*0.6), H*0.8)); octx.font=`900 ${size}px system-ui`; const m=octx.measureText(txt); const tx=(W-m.width)/2; const ty=(H+size*0.35)/2; octx.fillText(txt,tx,ty); const gap=Math.max(6,Math.floor(size/12)); const pts=[]; const data=octx.getImageData(0,0,W,H).data; for (let y=0;y<H;y+=gap){ for (let x=0;x<W;x+=gap){ const idx=(y*W+x)*4+3; if (data[idx]>128){ pts.push({x:x+(pw*0.05),y:y+(ph*0.15)}); } } } return pts; }
 let targets = textPoints('Aishwarya');
 let particles = targets.map(t => ({ x: rn(0,pw), y: rn(0,ph), vx:0, vy:0, tx:t.x, ty:t.y, s: rn(3.5,6.5), rot: rn(0,TAU), c: Math.random()<0.6? getComputedStyle(document.documentElement).getPropertyValue('--p1') : getComputedStyle(document.documentElement).getPropertyValue('--p2') }));
 let tighten = 0.12; // springiness
 $('#tightenBtn')?.addEventListener('click', ()=>{ tighten = clamp(tighten+0.02,0.05,0.25); ping(620); });
 $('#loosenBtn')?.addEventListener('click', ()=>{ tighten = clamp(tighten-0.02,0.03,0.25); ping(520); });
 
 // === Wire up Heart Fireworks button ===
 document.getElementById('burstBtn')?.addEventListener('click', () => {
   fireworks(innerWidth / 2, innerHeight * 0.35);
 });
$('#morphBtn')?.addEventListener('click', ()=>{
 const opts = ['Aishwarya','A ❤ S','Aishwarya ❤'];
 const pick = opts[(Math.random()*opts.length)|0];
 targets = textPoints(pick);
 particles.length = targets.length;
 for (let i=0;i<targets.length;i++){
 if (!particles[i]) particles[i] = {x: rn(0,pw), y: rn(0,ph), vx:0, vy:0, s: rn(3.5,6.5), rot: rn(0,TAU), c: Math.random()<0.6? getComputedStyle(document.documentElement).getPropertyValue('--p1') : getComputedStyle(document.documentElement).getPropertyValue('--p2') };
 particles[i].tx = targets[i].x; particles[i].ty = targets[i].y;
 }
 fireworks(innerWidth/2, innerHeight*0.3);
 });
 function pTick(){ pctx.clearRect(0,0,pw,ph); for (const p of particles){ const ax = (p.tx - p.x) * tighten; const ay = (p.ty - p.y) * tighten; p.vx += ax; p.vy += ay; p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy; p.rot += 0.02; drawHeart(pctx, p.x, p.y, p.s, p.c, p.rot, 1);} requestAnimationFrame(pTick); } pTick();
 // ====== Constellation (DOM) ======
 const constel = $('#constellation');
 const nodes = Array.from({length: 36}, () => ({x: rn(6,94), y: rn(8,92), vx: rn(-0.15,0.15), vy: rn(-0.12,0.12)}));
 const nodeEls = nodes.map(()=>{ const el = document.createElement('div'); el.className='node'; constel.appendChild(el); return el; });
 const links = [];
 function updateConstellation(){ const rect = constel.getBoundingClientRect(); nodes.forEach((n,i)=>{ n.x += n.vx; n.y += n.vy; if (n.x<3||n.x>97) n.vx*=-1; if (n.y<5||n.y>95) n.vy*=-1; const el = nodeEls[i]; el.style.left = (n.x*rect.width/100)+'px'; el.style.top = (n.y*rect.height/100)+'px'; }); links.splice(0).forEach(l => l.remove()); for (let i=0;i<nodes.length;i++){ for (let j=i+1;j<nodes.length;j++){ const a = nodes[i], b = nodes[j]; const dx = a.x - b.x, dy = a.y - b.y; const d = Math.hypot(dx,dy); if (d < 14){ const line = document.createElement('div'); line.className='link'; const ang = Math.atan2((b.y-a.y),(b.x-a.x)); const len = d*rect.width/100; Object.assign(line.style, { left: (a.x*rect.width/100)+'px', top: (a.y*rect.height/100)+'px', width: len+'px', transform: `rotate(${ang}rad)`}); constel.appendChild(line); links.push(line); if (d < 7){ const h = document.createElement('div'); h.className='small-heart'; h.style.left = ((a.x+b.x)/2*rect.width/100)+'px'; h.style.top = ((a.y+b.y)/2*rect.height/100)+'px'; constel.appendChild(h); links.push(h); } } } } requestAnimationFrame(updateConstellation); } updateConstellation();
 // ====== Poem Modal (random per click) ======
 const modal = $('#modal'), poemBox = $('#poem');
 const poems = [
 [ 'In a sky of ordinary days, you arrived like dawn.', 'Every small thing learned your name — even the quiet.', 'Tea turned bright, rain started to sparkle.', 'And my heart chose the simplest truth: you.' ],
 [ 'You said hello and the room kept the echo.', 'I found my favorite place was beside your smile.', 'Time stopped checking the clock when you laughed.', 'Since then, even small minutes feel like fireworks.' ],
 [ 'If stars could write, they would write your name.', 'If rain could sing, it would hum your tune.', 'If days could choose a color, they’d pick your eyes.', 'And my heart would still choose you, twice.' ],
 [ 'Somewhere between tea and sunsets, I fell for you.', 'Between questions and quiet, we understood.', 'Between ordinary and magic, you appeared.', 'Now every road looks like home if you’re there.' ]
 ];
 let poemOrder = []; function refillPoemOrder(){ poemOrder = [...poems.keys()]; for (let i=poemOrder.length-1;i>0;i--){ const j=(Math.random()* (i+1))|0; [poemOrder[i],poemOrder[j]]=[poemOrder[j],poemOrder[i]]; } }
 refillPoemOrder();
 function openPoem(){ if (!poemOrder.length) refillPoemOrder(); const idx = poemOrder.pop(); const lines = poems[idx]; modal.hidden = false; poemBox.innerHTML = ''; let i=0; ping(540); const iv = setInterval(()=>{ if (i >= lines.length){ clearInterval(iv); return; } const line = document.createElement('div'); line.className='line'; line.textContent = lines[i++]; poemBox.appendChild(line); requestAnimationFrame(()=> line.classList.add('show')); }, 700); }
 function closePoem(){ modal.hidden = true; }
 $('#poemBtn')?.addEventListener('click', openPoem); $('#closeModal')?.addEventListener('click', closePoem); modal?.addEventListener('click', closePoem);
 
 // === Secret: type "love" to trigger a surprise ===
 (() => {
   const seq = ['l','o','v','e'];
   let idx = 0;
   window.addEventListener('keydown', (e) => {
     const k = e.key?.toLowerCase?.() || '';
     if (k === seq[idx]) {
       idx++;
       if (idx === seq.length) {
         idx = 0;
         try { openPoem(); } catch (e) { fireworks(innerWidth/2, innerHeight*0.3); }
         ping(800);
       }
     } else {
       idx = (k === 'l') ? 1 : 0;
     }
   });
 })();

// ====== Heartfelt Questions (ends with proposal) ======
 const questions = [
 'Do you know how your smile turns minutes into memories? ',
 'Do you feel how quiet becomes music when we are together? ',
 'Can I be the reason your tea tastes like celebration? ',
 'Will you be my Valentine?'
 ];
 const qText = $('#qText'); const nextQ = $('#nextQ'); const yesQ = $('#yesQ'); const laterQ = $('#laterQ');
 let qIndex = 0; function showQuestion(){ qText.classList.remove('type'); qText.textContent = ''; const txt = questions[qIndex]; let i=0; qText.classList.add('type'); const iv = setInterval(()=>{ qText.textContent = txt.slice(0, ++i); if (i>=txt.length){ clearInterval(iv); if (qIndex === questions.length-1){ nextQ.hidden = true; yesQ.hidden = false; laterQ.hidden = false; } else { nextQ.hidden = false; yesQ.hidden = true; laterQ.hidden = true; } } }, 18); }
 nextQ?.addEventListener('click', ()=>{ qIndex = Math.min(questions.length-1, qIndex+1); showQuestion(); ping(600); });
 yesQ?.addEventListener('click', ()=>{ fireworks(innerWidth/2, innerHeight*0.35); qText.textContent = 'You just made my day. 💖'; yesQ.hidden = true; laterQ.hidden = true; ping(840); });
 laterQ?.addEventListener('click', ()=>{ qText.textContent = 'No rush — I’ll keep asking with a smile. 😊'; yesQ.hidden = true; laterQ.hidden = true; ping(500); });
 showQuestion();
 // ====== Compliment Spinner ======
 const compliments = [ 'You are my favorite coincidence.', 'Every day looks better on you.', 'You make tea taste like celebration.', 'You glow in every color.', 'You ask the loveliest questions.', 'You turn quiet into music.', 'Even the rain wants your autograph.' ];
 const slot = $('#slot'); const spinBtn = $('#spinBtn');
 spinBtn?.addEventListener('click', ()=>{ let spins = 18 + (Math.random()*6)|0; const iv = setInterval(()=>{ slot.style.filter='blur(6px)'; slot.textContent = compliments[(Math.random()*compliments.length)|0]; spins--; if (spins<=0){ clearInterval(iv); slot.style.filter='blur(0)'; ping(600);} }, 90); });
 // ====== Floating Photos from /img/1.jpg..7.jpg ======
 const floatPhotos = $('#floatPhotos');
 function addPhoto(src){
 const wrap = document.createElement('div'); wrap.className = 'photo-wrap';
 wrap.style.left = Math.floor(rn(6, 80)) + '%';
 wrap.style.top = Math.floor(rn(8, 60)) + '%';
 wrap.style.setProperty('--dur', rn(5.5, 8.5) + 's');
 wrap.style.setProperty('--rot', rn(-5, 5) + 'deg');
 for (let i=0;i<3;i++){
 const h = document.createElement('div'); h.className = 'heart-float';
 h.style.left = rn(10, 90) + '%';
 h.style.top = rn(10, 90) + '%';
 h.style.setProperty('--bdur', rn(2.6, 4.2) + 's');
 wrap.appendChild(h);
 }
 const img = document.createElement('img'); img.className='photo'; img.alt = 'Our photo'; img.src = src;
 wrap.appendChild(img);
 floatPhotos.appendChild(wrap);
 }
 const expected = Array.from({length:7}, (_,i)=>`img/${i+1}.jpg`);
 expected.forEach(src => { const img = new Image(); img.onload = () => addPhoto(src); img.src = src; });
 
 // ====== Static 10-image Gallery (grid) ======
 const gallery10 = document.getElementById('gallery10');
 if (gallery10){
   const sources10 = Array.from({length:20}, (_,i)=>`img/${i+1}.jpg`);
   function addCard(src){
     const card=document.createElement('div'); card.className='card10';
     const inner=document.createElement('div'); inner.className='inner';
     const img=document.createElement('img'); img.alt='Photo'; img.loading='lazy'; img.src=src; inner.appendChild(img);
     const cap=document.createElement('div'); cap.className='cap'; cap.textContent='❤';
     card.appendChild(inner); card.appendChild(cap);
     gallery10.appendChild(card);
   }
   sources10.forEach(src=>{ const t=new Image(); t.onload=()=> addCard(src); t.src=src; });
 }

})();



// === Robust re-binders for Morph/Tighten/Loosen (in case earlier listeners didn't attach) ===
(function(){
  function bind(){
    try {
      var morphBtn = document.getElementById('morphBtn');
      if (morphBtn && !morphBtn.__bound) {
        morphBtn.addEventListener('click', function(){
          try {
            var opts = ['Aishwarya','A ❤ N','Aishwarya ❤'];
            var pick = opts[(Math.random()*opts.length)|0];
            targets = textPoints(pick);
            particles.length = targets.length;
            for (var i=0;i<targets.length;i++){
              if (!particles[i]) particles[i] = {x: rn(0,pw), y: rn(0,ph), vx:0, vy:0, s: rn(3.5,6.5), rot: rn(0,TAU), c: Math.random()<0.6? getComputedStyle(document.documentElement).getPropertyValue('--p1') : getComputedStyle(document.documentElement).getPropertyValue('--p2') };
              particles[i].tx = targets[i].x; particles[i].ty = targets[i].y;
            }
            fireworks(innerWidth/2, innerHeight*0.3);
          } catch(err){ console.error('Morph handler error:', err); }
        });
        morphBtn.__bound = true;
      }

      var tightenBtn = document.getElementById('tightenBtn');
      if (tightenBtn && !tightenBtn.__bound){
        tightenBtn.addEventListener('click', function(){
          try { tighten = clamp(tighten+0.02, 0.05, 0.25); ping(620); } catch(err){ console.error('Tighten error:', err); }
        });
        tightenBtn.__bound = true;
      }

      var loosenBtn = document.getElementById('loosenBtn');
      if (loosenBtn && !loosenBtn.__bound){
        loosenBtn.addEventListener('click', function(){
          try { tighten = clamp(tighten-0.02, 0.03, 0.25); ping(520); } catch(err){ console.error('Loosen error:', err); }
        });
        loosenBtn.__bound = true;
      }
    } catch(e){ console.error('Bind error', e); }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind, {once:true});
  } else {
    bind();
  }
})();
