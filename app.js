const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const S={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const user=()=>S.get('user',null),isSub=()=>{const u=user();return !!u&&u.plan&&u.plan!=='free'};
const done=()=>S.get('done',[]),favs=()=>S.get('favs',[]);
const byId=id=>LESSONS.find(l=>l.id===id);
const qs=k=>new URLSearchParams(location.search).get(k);
const page=document.body.dataset.page;

/* ---------- procedural mountains ---------- */
function rng(seed){let s=seed;return()=>{s=(s*9301+49297)%233280;return s/233280}}
function hash(str){let h=7;for(const c of str)h=(h*31+c.charCodeAt(0))%100003;return h}
function ridge(w,h,seed,amp,base,n=16){const r=rng(seed);let d=`M0 ${h}L0 ${base}`;for(let i=1;i<=n;i++){const x=w*i/n,y=base-amp*(.25+.75*r())*(i%2?1:.5);d+=`L${x.toFixed(0)} ${y.toFixed(0)}`}return d+`L${w} ${h}Z`}
function trees(w,y,seed,n,sz,fill){const r=rng(seed);let o='';for(let i=0;i<n;i++){const x=r()*w,s=sz*(.6+r()*.8);o+=`<path d="M${x} ${y-s*2.2}l${s*.6} ${s*1.1}h-${s*.3}l${s*.5} ${s*1.1}h-${s*1.6}l${s*.5}-${s*1.1}h-${s*.3}z" fill="${fill}"/>`}return o}
function thumbSvg(key,seed,[c1,c2],w=400,h=225){
 const id='g'+key.replace(/\W/g,'')+seed;
 return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
 <rect width="${w}" height="${h}" fill="url(#${id})"/><circle cx="${w*.74}" cy="${h*.34}" r="${h*.1}" fill="#fff" opacity=".85"/>
 <path d="${ridge(w,h,seed,h*.45,h*.62)}" fill="#fff" opacity=".22"/><path d="${ridge(w,h,seed+7,h*.4,h*.74)}" fill="#071524" opacity=".35"/><path d="${ridge(w,h,seed+13,h*.3,h*.86)}" fill="#071524" opacity=".62"/>${trees(w,h*.97,seed,8,h*.04,'#071524')}</svg>`}
const thumb=l=>thumbSvg(l.id,hash(l.id),CATS[l.cat].hue);

/* ---------- layout ---------- */
/* 4 espaces reliés : Vente (accueil, cours, offre), CRM, Stratégie, Communication */
const NAV=[['index.html','Accueil'],
 ['catalogue.html','Cours',[['catalogue.html','Tous les cours'],['programmes.html','Parcours guidés'],['preparation.html','Prépa physique'],['montagne.html','Vie en montagne'],['materiel.html','Matériel'],['quiz.html','Test de niveau']]],
 ['offre.html','Offre & achat'],['strategie.html','Stratégie'],['communication.html','Communication'],['crm.html','CRM']];
function layout(){
 const cur=location.pathname.split('/').pop()||'index.html',u=user();
 const logo=`<svg viewBox="0 0 32 32"><path d="M2 26 12 8l6 10 3-5 9 13z" fill="#ff9a3c"/><path d="M12 8l3 5-3 2-3-2z" fill="#fff"/></svg>`;
 const fav=document.createElement('link');fav.rel='icon';fav.href='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#071524"/><path d="M4 25 13 9l5 9 3-4 7 11z" fill="#ff9a3c"/><path d="M13 9l2.6 4.6L13 15l-2.6-1.4z" fill="#fff"/></svg>');document.head.appendChild(fav);
 const isOn=(h,ch)=>cur===h||(ch&&ch.some(c=>c[0]===cur));
 $('#hdr').outerHTML=`<header><div class="demo" role="note">🎓 Projet étudiant INSEEC, démo sans vente réelle</div><div class="wrap nav"><a class="logo" href="index.html">${logo}Alpes<span>Progrès</span></a>
 <button class="burger" aria-label="Menu" onclick="document.querySelector('nav ul').classList.toggle('open')">☰</button>
 <nav><ul>${NAV.map(([h,t,ch])=>`<li class="${ch?'dd':''}"><a href="${h}" class="${isOn(h,ch)?'on':''}">${t}${ch?' ▾':''}</a>${ch?`<ul class="sub">${ch.map(([a,b])=>`<li><a href="${a}">${b}</a></li>`).join('')}</ul>`:''}</li>`).join('')}
 <li>${u?`<a class="btn sm" href="espace.html">👤 ${u.name.split(' ')[0]}</a>`:`<a class="btn sm" href="connexion.html">Connexion</a>`}</li></ul></nav></div></header>`;
 const col=(t,a)=>`<div><h4>${t}</h4>${a.map(([h,x])=>`<a href="${h}">${x}</a>`).join('')}</div>`;
 $('#ftr').outerHTML=`<footer><div class="wrap"><div class="cols"><div><a class="logo" href="index.html" style="color:#fff">${logo}Alpes<span>Progrès</span></a><p style="margin-top:14px;max-width:300px">La plateforme pour progresser en ski, se préparer physiquement et protéger la montagne.</p></div>
 ${col('1 · Vente',[['index.html','Accueil'],['catalogue.html','Tous les cours'],['offre.html','Offre & achat'],['apropos.html','FAQ & contact']])}
 ${col('2 · CRM · 3 · Stratégie',[['crm.html','CRM (côté entreprise)'],['strategie.html','Dossier stratégique']])}
 ${col('4 · Communication',[['communication.html','Plan de communication'],['journal.html','Journal'],['legal.html#cgv','CGV'],['legal.html#mentions','Mentions légales']])}</div>
 <div class="legal">© ${new Date().getFullYear()} AlpesProgrès · Projet étudiant INSEEC, démo sans vente réelle : aucun paiement ni compte réel. Le ski comporte des risques : ces conseils ne remplacent pas un enseignement encadré par un moniteur diplômé.</div></div></footer>`;
 const h=$('header'),f=()=>h.classList.toggle('solid',scrollY>40||page!=='home');f();addEventListener('scroll',f,{passive:true});
 const io=window.IO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 $$('.rv').forEach(e=>io.observe(e));
}
function headBg(){$$('.page-head').forEach(p=>p.insertAdjacentHTML('afterbegin',`<svg class="bg" viewBox="0 0 1440 400" preserveAspectRatio="none"><path d="${ridge(1440,400,5,260,300,22)}" fill="#fff" opacity=".07"/><path d="${ridge(1440,400,9,200,350,22)}" fill="#ff7a45" opacity=".12"/></svg>`))}

/* ---------- components ---------- */
const lvlPill=l=>`<span class="pill l${l.level}">${LEVELS[l.level]}</span>`;
function card(l){const d=done().includes(l.id),lock=l.premium&&!isSub();
 return `<a class="card rv" href="cours.html?id=${l.id}"><div class="thumb">${thumb(l)}<span class="tag">${CATS[l.cat].label}</span>${lock?'<span class="lock">🔒 Premium</span>':''}<div class="play"><i>▶</i></div><span class="dur">${l.dur}</span>${d?'<span class="done">✓ Terminé</span>':''}</div>
 <div class="body">${lvlPill(l)}${l.premium?'':'<span class="pill free">Gratuit</span>'}<h3>${l.title}</h3><p>${l.summary}</p></div></a>`}
const showCards=(el,list)=>{el.innerHTML=list.map(card).join('')||'<p>Aucun cours ne correspond.</p>';$$('.rv',el).forEach(e=>setTimeout(()=>e.classList.add('in'),30))};

/* ---------- HOME ---------- */
function home(){
 const w=1440,hgt=900;
 $('#scene').innerHTML=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06142b"/><stop offset=".45" stop-color="#2d2f6b"/><stop offset=".72" stop-color="#d4577e"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient>
 <radialGradient id="sun"><stop offset="0" stop-color="#fff3d0"/><stop offset=".25" stop-color="#ffc27a" stop-opacity=".8"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
 <linearGradient id="snowg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f9ff"/><stop offset="1" stop-color="#b9d3ec"/></linearGradient></defs>
 <rect width="${w}" height="${hgt}" fill="url(#sky)"/><circle cx="1050" cy="520" r="320" fill="url(#sun)"/><circle cx="1050" cy="520" r="46" fill="#fff6dc"/>
 <g data-p=".04"><path d="${ridge(w,hgt,11,260,590,22)}" fill="#7a6aa6" opacity=".85"/></g>
 <g data-p=".08"><path d="${ridge(w,hgt,23,300,680,20)}" fill="#40508c"/></g>
 <g data-p=".12"><path d="${ridge(w,hgt,37,260,760,18)}" fill="#1c2f62"/>${trees(w,790,3,40,16,'#0a1a38')}</g>
 <path d="M0 900V720C300 660 640 740 960 690S1300 640 1440 690V900Z" fill="url(#snowg)"/>
 <path class="track" d="M1010 900C760 840 1180 800 900 748S1060 706 980 690" fill="none" stroke="#7fa3c9" stroke-width="3" stroke-linecap="round"/>
 <path class="track" d="M1022 900C772 842 1192 802 912 752S1072 710 992 692" fill="none" stroke="#7fa3c9" stroke-width="3" stroke-linecap="round"/>
 ${trees(260,900,5,9,34,'#071524')}${trees(300,900,8,9,34,'#071524').replace(/M(\d+(\.\d+)?)/g,(m,x)=>'M'+(+x+1180))}`;
 const layers=$$('#scene g[data-p]');addEventListener('scroll',()=>{if(scrollY<innerHeight)layers.forEach(g=>g.style.transform=`translateY(${scrollY*g.dataset.p}px)`)},{passive:true});
 /* snow */
 const c=$('#snow'),x=c.getContext('2d');if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let f=[];const rs=()=>{c.width=c.offsetWidth;c.height=c.offsetHeight;f=Array.from({length:Math.min(110,c.width/12)},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2.2+.6,v:Math.random()*.8+.3,d:Math.random()*2}))};rs();addEventListener('resize',rs);
  (function t(){x.clearRect(0,0,c.width,c.height);x.fillStyle='rgba(255,255,255,.85)';f.forEach(p=>{p.y+=p.v;p.x+=Math.sin(p.y/40+p.d)*.4;if(p.y>c.height){p.y=-5;p.x=Math.random()*c.width}x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()});requestAnimationFrame(t)})()}
 $('#n-lessons').textContent=LESSONS.length;$('#n-paths').textContent=PATHS.length;
 showCards($('#home-grid'),LESSONS.filter(l=>!l.premium).slice(0,6));
 $('#pillars').innerHTML=Object.entries(CATS).map(([k,c],i)=>`<a class="pillar rv" href="${k==='montagne'?'montagne.html':k==='physique'?'preparation.html':'catalogue.html?cat='+k}">${thumbSvg('p'+k,40+i*9,c.hue,500,480)}<div><h3>${c.label}</h3><p>${c.desc}</p><div class="more">Découvrir →</div></div></a>`).join('');
 $('#home-paths').innerHTML=PATHS.slice(0,3).map(p=>`<a class="card rv" href="programmes.html#${p.id}"><div class="body">${lvlPill({level:p.level})}<span class="pill">${p.lessons.length} cours</span><h3>${p.title}</h3><p>${p.desc}</p></div></a>`).join('');
 nlInit();
}
function nlInit(){const f=$('#nl');if(f)f.onsubmit=e=>{e.preventDefault();f.innerHTML='<p style="color:#fff;font-weight:700">Merci ! (démo : aucun email n’est réellement enregistré)</p>'}}

/* ---------- CATALOGUE ---------- */
function catalogue(){
 let cat=qs('cat')||'all',lvl='all',q='',acc='all';
 const render=()=>{const list=LESSONS.filter(l=>(cat==='all'||l.cat===cat)&&(lvl==='all'||l.level==lvl)&&(acc==='all'||(acc==='free')===!l.premium)&&(l.title+l.summary).toLowerCase().includes(q));$('#count').textContent=list.length+' cours';showCards($('#grid'),list)};
 const bar=(id,items,get,set)=>{const el=$(id);const draw=()=>el.innerHTML=items.map(([k,t])=>`<button class="chip ${get()==k?'on':''}" data-k="${k}">${t}</button>`).join('');draw();el.onclick=e=>{const k=e.target.dataset.k;if(k===undefined)return;set(k);draw();render()}};
 bar('#fc',[['all','Tous les thèmes'],...Object.entries(CATS).map(([k,v])=>[k,v.label])],()=>cat,v=>cat=v);
 bar('#fl',[['all','Tous niveaux'],...Object.entries(LEVELS)],()=>lvl,v=>lvl=v);
 bar('#fa',[['all','Tout'],['free','Gratuits'],['prem','Premium']],()=>acc,v=>acc=v);
 $('#q').oninput=e=>{q=e.target.value.toLowerCase();render()};render();
}

/* ---------- LESSON ---------- */
function lesson(){
 const l=byId(qs('id'));const main=$('#main');
 if(!l){main.innerHTML='<section><div class="wrap center"><h1>Cours introuvable</h1><p><a class="btn" href="catalogue.html">Voir les cours</a></p></div></section>';return}
 document.title=l.title+' — AlpesProgrès';S.set('last',l.id);
 const open=!l.premium||isSub(),isDone=done().includes(l.id),isFav=favs().includes(l.id);
 const mins=parseInt(l.dur)||10,per=Math.floor(mins*60/l.steps.length);
 const ts=i=>{const s=i*per;return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
 const vid=!open?`<div class="ph"><div><div class="play">🔒</div><b>Vidéo réservée aux abonnés</b></div></div>`:l.video?(/\.mp4$/.test(l.video)?`<video controls src="${l.video}"></video>`:`<iframe src="${l.video}" allowfullscreen></iframe>`):`<div class="dp" id="dp"><div class="dp-top"><span class="pill" style="background:rgba(255,255,255,.18);color:#fff">Aperçu animé · maquette de la vidéo</span><span id="dp-n"></span></div><div class="dp-body"><h3 id="dp-t"></h3><p id="dp-d"></p></div><div class="dp-bar"><button id="dp-pp" aria-label="Lecture / pause">⏸</button><div class="bar" id="dp-prog"><i style="width:0"></i></div></div></div>`;
 const idx=LESSONS.filter(x=>x.cat===l.cat),i=idx.indexOf(l),prev=idx[i-1],next=idx[i+1];
 const stepsHtml=l.steps.map((s,k)=>(open||k===0)?`<li><span class="ts">▶ ${ts(k)}</span><b>${s[0]}</b>${s[1]}</li>`:`<li class="lk"><b>${s[0]}</b>Contenu réservé aux abonnés</li>`).join('');
 const lockBox=open?'':`<div class="paywall"><h3>Débloquez ce cours</h3><p>Vidéo, ${l.steps.length} étapes détaillées, erreurs fréquentes, exercices et fiche à imprimer.</p><a class="btn" href="offre.html">Voir les formules</a></div>`;
 const notes=S.get('notes',{});
 main.innerHTML=`<div class="page-head"><div class="wrap"><a class="crumb" href="catalogue.html">← Tous les cours</a><div>${lvlPill(l)}<span class="pill">${CATS[l.cat].label}</span><span class="pill">${l.dur}</span></div><h1 style="margin-top:12px">${l.title}</h1><p class="lead">${l.goal}</p></div></div>
 <section style="padding-top:50px"><div class="wrap layout"><div><div class="player">${thumb(l)}${vid}</div>
 <div class="actions"><button class="btn sm ${isDone?'dark':''}" id="b-done">${isDone?'✓ Terminé':'Marquer comme terminé'}</button><button class="btn sm line" id="b-fav">${isFav?'★ Dans mes favoris':'☆ Ajouter aux favoris'}</button><button class="btn sm line" onclick="print()">🖨 Fiche PDF</button></div>
 <div class="tabs"><button class="tab on" data-t="p1">Décomposition</button><button class="tab" data-t="p2">Exercices</button><button class="tab" data-t="p3">Erreurs &amp; corrections</button><button class="tab" data-t="p4">Mes notes</button></div>
 <div class="panel on" id="p1"><ol class="steps">${stepsHtml}</ol>${lockBox}</div>
 <div class="panel" id="p2">${open?`<div class="box ok"><h3>Exercices à pratiquer</h3><ul>${l.drills.map(e=>`<li>${e}</li>`).join('')}</ul></div>`:lockBox}</div>
 <div class="panel" id="p3">${open?`<div class="box"><h3>Erreurs fréquentes</h3><ul>${l.errors.map(e=>`<li>${e}</li>`).join('')}</ul></div><div class="box ok"><h3>Pour corriger</h3><p>Reprenez les exercices un par un, en travaillant un seul point par descente. Filmez-vous si possible.</p></div>`:lockBox}</div>
 <div class="panel" id="p4"><textarea id="note" placeholder="Vos sensations, points à travailler…">${notes[l.id]||''}</textarea><p class="note" style="text-align:left">Enregistrées automatiquement sur cet appareil.</p></div>
 <div class="pn">${prev?`<a href="cours.html?id=${prev.id}"><small>← Précédent</small><b>${prev.title}</b></a>`:'<span></span>'}${next?`<a href="cours.html?id=${next.id}" style="text-align:right"><small>Suivant →</small><b>${next.title}</b></a>`:'<span></span>'}</div></div>
 <aside class="side"><h3>Fiche mémento</h3><dl><dt>Niveau</dt><dd>${LEVELS[l.level]}</dd><dt>Terrain</dt><dd>${l.terrain}</dd><dt>Durée</dt><dd>${l.dur}</dd><dt>Étapes</dt><dd>${l.steps.length}</dd><dt>Accès</dt><dd>${l.premium?'Premium':'Gratuit'}</dd></dl>
 <h3>Critères de réussite</h3><ul>${l.keys.map(k=>`<li>${k}</li>`).join('')}</ul>
 <h3 style="margin-top:18px">Dans un parcours</h3><ul>${PATHS.filter(p=>p.lessons.includes(l.id)).map(p=>`<li><a href="programmes.html#${p.id}">${p.title}</a></li>`).join('')||'<li>—</li>'}</ul></aside></div></section>`;
 if($('#dp')){let k=0,play=true,t0=Date.now();const D=4500,show=()=>{$('#dp-n').textContent='Étape '+(k+1)+' / '+l.steps.length;$('#dp-t').textContent=l.steps[k][0];$('#dp-d').textContent=l.steps[k][1];t0=Date.now()};show();
  $('#dp-pp').onclick=()=>{play=!play;$('#dp-pp').textContent=play?'⏸':'▶';t0=Date.now()-($('#dp-prog i').style.width.slice(0,-1)/100*D)};
  $('#dp-prog').onclick=e=>{const r=e.currentTarget.getBoundingClientRect(),p=(e.clientX-r.left)/r.width;k=Math.min(l.steps.length-1,Math.floor(p*l.steps.length));show()};
  clearInterval(window.__dpt);const tick=window.__dpt=setInterval(()=>{if(!$('#dp')){clearInterval(tick);return}if(play){const p=(Date.now()-t0)/D;if(p>=1){k=(k+1)%l.steps.length;show()}}$('#dp-prog i').style.width=(play?Math.min(100,(Date.now()-t0)/D*100):parseFloat($('#dp-prog i').style.width)||0)+'%'},100)}
 $$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('on',x===t));$$('.panel').forEach(p=>p.classList.toggle('on',p.id===t.dataset.t))});
 $('#b-done').onclick=()=>{let d=done();d=d.includes(l.id)?d.filter(x=>x!==l.id):[...d,l.id];S.set('done',d);lesson()};
 $('#b-fav').onclick=()=>{let d=favs();d=d.includes(l.id)?d.filter(x=>x!==l.id):[...d,l.id];S.set('favs',d);lesson()};
 $('#note').oninput=e=>{const n=S.get('notes',{});n[l.id]=e.target.value;S.set('notes',n)};
}

/* ---------- PROGRAMMES ---------- */
function programmes(){
 const d=done();
 $('#paths').innerHTML=PATHS.map(p=>{const n=p.lessons.filter(x=>d.includes(x)).length,pc=Math.round(n/p.lessons.length*100);
  return `<div class="path rv" id="${p.id}"><header><div><div>${lvlPill({level:p.level})}<span class="pill">${p.lessons.length} cours</span></div><h2 style="font-size:2.4rem;margin-top:8px">${p.title}</h2><p style="color:var(--muted)">${p.desc}</p></div><div style="min-width:180px"><small>${pc}% terminé</small><div class="bar"><i style="width:${pc}%"></i></div></div></header>
  <ol>${p.lessons.map(id=>{const l=byId(id);return `<li class="${d.includes(id)?'d':''}"><a href="cours.html?id=${id}">${l.title}</a> <span class="pill">${l.dur}</span>${l.premium&&!isSub()?'🔒':''}</li>`}).join('')}</ol></div>`}).join('');
 $$('.rv').forEach(e=>e.classList.add('in'));
}
/* ---------- PRÉPA ---------- */
function prepa(){
 let w=0;const draw=()=>{const p=PLAN[w];$('#weeks').innerHTML=PLAN.map((_,i)=>`<button class="wk ${i===w?'on':''}" data-i="${i}">Semaine ${i+1}</button>`).join('');
  $('#week').innerHTML=`<h3 style="margin-bottom:18px">Semaine ${w+1} · ${p.theme}</h3><div class="sess">${p.sessions.map(([t,ex])=>`<div class="box"><h3>${t}</h3><table>${ex.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table></div>`).join('')}</div>`};
 $('#weeks').onclick=e=>{if(e.target.dataset.i!==undefined){w=+e.target.dataset.i;draw()}};draw();
 $('#exos').innerHTML=EXOS.map(([n,m,t])=>`<div><small>${m}</small><h4 style="margin-top:6px">${n}</h4><p>${t}</p></div>`).join('');
 showCards($('#prepa-grid'),LESSONS.filter(l=>l.cat==='physique'));
}
/* ---------- MONTAGNE ---------- */
function montagne(){
 const ck=S.get('chk',{});const items=['Météo et BRA consultés','Itinéraire communiqué à un proche','DVA, pelle et sonde (hors-piste)','Forfait, assurance et téléphone chargé','Crème solaire, lunettes, eau','Casque ajusté et fixations vérifiées'];
 $('#chk').innerHTML=items.map((t,i)=>`<li><label><input type="checkbox" data-i="${i}" ${ck[i]?'checked':''}><span>${t}</span></label></li>`).join('');
 $('#chk').onchange=e=>{ck[e.target.dataset.i]=e.target.checked;S.set('chk',ck)};
 const R=[['Faible','#4caf50'],['Limité','#c9b21b'],['Marqué','#f08a1e'],['Fort','#d63a14'],['Très fort','#7a0f0f']],T=['Conditions généralement sûres','Prudence sur pentes raides','Danger sur pentes raides, déclenchements possibles','Déclenchements spontanés possibles','Éviter tout hors-piste'];
 $('#risk').innerHTML=R.map(([n,c],i)=>`<div style="background:${c}"><b>${i+1}</b><strong>${n}</strong>${T[i]}</div>`).join('');
 $('#fis').innerHTML=FIS.map(([t,d],i)=>`<div class="rule rv"><i>${i+1}</i><h4>${t}</h4><p>${d}</p></div>`).join('');
 showCards($('#mont-grid'),LESSONS.filter(l=>l.cat==='montagne'));$$('.rv').forEach(e=>e.classList.add('in'));
}
/* ---------- MATÉRIEL ---------- */
function materiel(){
 $('#calc').onsubmit=e=>{e.preventDefault();const h=+$('#h').value,lv=+$('#lv').value,st=+$('#st').value;if(!h)return;
  const base={1:[-15,-10],2:[-10,-5],3:[-5,0],4:[0,5]}[lv],lo=h+base[0]+st,hi=h+base[1]+st;
  $('#res').innerHTML=`<div class="box ok"><h3>${lo}–${hi} cm</h3><p>Longueur de ski indicative. Les chaussures, le réglage des fixations (DIN) et l’affûtage doivent être faits par un professionnel en magasin.</p></div>`};
}
/* ---------- QUIZ ---------- */
function quiz(){
 let i=0,sc=0;const box=$('#quiz');
 const step=()=>{if(i>=QUIZ.length){const lv=sc<=5?1:sc<=10?2:sc<=14?3:4,p=PATHS[{1:0,2:1,3:2,4:3}[lv]];
  S.set('quizLevel',lv);box.innerHTML=`<div class="q center"><div class="eyebrow">Votre niveau</div><h2>${LEVELS[lv]}</h2><p class="lead">Nous vous conseillons le parcours « ${p.title} ».</p><p style="margin-top:24px"><a class="btn" href="programmes.html#${p.id}">Voir le parcours</a> <button class="btn line" onclick="location.reload()">Refaire</button></p></div>`;return}
  const [q,o]=QUIZ[i];box.innerHTML=`<div class="q"><small>Question ${i+1}/${QUIZ.length}</small><div class="bar" style="margin:10px 0 20px"><i style="width:${i/QUIZ.length*100}%"></i></div><h3>${q}</h3>${o.map((t,k)=>`<button class="opt" data-k="${k}">${t}</button>`).join('')}</div>`};
 box.onclick=e=>{if(e.target.dataset.k!==undefined){sc+=+e.target.dataset.k;i++;step()}};step();
}
/* ---------- GLOSSAIRE / JOURNAL ---------- */
function glossaire(){const draw=q=>$('#gl').innerHTML=GLOSS.filter(([t,d])=>(t+d).toLowerCase().includes(q)).map(([t,d])=>`<div><b>${t}</b><p>${d}</p></div>`).join('');$('#q').oninput=e=>draw(e.target.value.toLowerCase());draw('')}
function journal(){const id=qs('id'),a=ARTICLES.find(x=>x.id===id);
 if(a){document.title=a.title;$('#main').innerHTML=`<div class="page-head"><div class="wrap"><a class="crumb" href="journal.html">← Journal</a><span class="pill">${a.cat}</span><h1 style="margin-top:10px">${a.title}</h1><p class="meta" style="color:#b9cde2">${a.date}</p></div></div><section><div class="wrap art">${a.body.map(p=>`<p>${p}</p>`).join('')}<p><a class="btn" href="catalogue.html">Passer à la pratique</a></p></div></section>`;headBg();return}
 $('#arts').innerHTML=ARTICLES.map((a,i)=>`<a class="card rv in" href="journal.html?id=${a.id}"><div class="thumb">${thumbSvg(a.id,hash(a.id),Object.values(CATS)[i%3].hue)}<span class="tag">${a.cat}</span></div><div class="body"><h3>${a.title}</h3><p>${a.body[0].slice(0,110)}…</p><p class="meta">${a.date}</p></div></a>`).join('')}
/* ---------- ESPACE ---------- */
function espace(){const u=user();if(!u){location.href='connexion.html?next=espace.html';return}
 const d=done(),pc=Math.round(d.length/LESSONS.length*100),r=64,C=2*Math.PI*r;
 const planName={free:'Découverte',premium:'Premium',coaching:'Coaching'}[u.plan]||u.plan;
 $('#hello').textContent='Bonjour '+u.name.split(' ')[0]+' 👋';
 const last=byId(S.get('last',null));
 $('#dash').innerHTML=`<div><div class="stat"><svg class="ring" viewBox="0 0 160 160"><circle cx="80" cy="80" r="${r}" fill="none" stroke="#e9f2f9" stroke-width="14"/><circle cx="80" cy="80" r="${r}" fill="none" stroke="#ff5a1f" stroke-width="14" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pc/100)}"/></svg>
 <h2 style="margin-top:-112px;margin-bottom:70px">${pc}%</h2><p>${d.length} / ${LESSONS.length} cours terminés</p>
 ${Object.entries(CATS).map(([k,c])=>{const t=LESSONS.filter(l=>l.cat===k),n=t.filter(l=>d.includes(l.id)).length;return `<div class="mini"><div><span>${c.label}</span><span>${n}/${t.length}</span></div><div class="bar"><i style="width:${n/t.length*100}%"></i></div></div>`}).join('')}</div>
 <div class="stat" style="margin-top:20px"><h4>Abonnement</h4><p class="pill ${u.plan==='free'?'':'prem'}" style="margin-top:8px">${planName}</p>${u.plan==='free'?'<p style="margin:12px 0"><a class="btn sm" href="offre.html">Passer Premium</a></p>':''}<p><button class="btn sm line" id="out" style="margin-top:12px">Se déconnecter</button></p></div></div>
 <div>${last?`<h3>Reprendre</h3><div class="grid" style="margin:16px 0 40px">${card(last)}</div>`:''}
 <h3>Mes favoris</h3><div class="grid" id="fv" style="margin:16px 0 40px"></div><h3>Terminés</h3><div class="grid" id="dn" style="margin-top:16px"></div></div>`;
 const f=favs().map(byId).filter(Boolean),dn=d.map(byId).filter(Boolean);
 $('#fv').innerHTML=f.map(card).join('')||'<p style="color:var(--muted)">Ajoutez des cours en favoris avec ☆.</p>';$('#dn').innerHTML=dn.map(card).join('')||'<p style="color:var(--muted)">Aucun cours terminé pour l’instant.</p>';
 $$('.rv').forEach(e=>e.classList.add('in'));$('#out').onclick=()=>{localStorage.removeItem('user');location.href='index.html'};
}
/* ---------- TARIFS / CONNEXION / CONTACT ---------- */
function connexion(){let mode=qs('mode')==='signup'?'signup':'login';const p=qs('plan')||'free';
 const draw=()=>{$('#f').innerHTML=`<div class="toggle" style="margin:0 0 10px;display:flex"><button type="button" class="${mode==='login'?'on':''}" data-m="login" style="flex:1">Connexion</button><button type="button" class="${mode==='signup'?'on':''}" data-m="signup" style="flex:1">Créer un compte</button></div>
 ${mode==='signup'?'<label>Prénom et nom</label><input id="nm" required>':''}<label>Email</label><input id="em" type="email" required><label>Mot de passe</label><input type="password" required minlength="6">
 ${mode==='signup'?`<label>Formule</label><select id="pl"><option value="free" ${p==='free'?'selected':''}>Découverte (gratuit)</option><option value="premium" ${p==='premium'?'selected':''}>Premium</option><option value="coaching" ${p==='coaching'?'selected':''}>Coaching</option></select>`:''}
 <button class="btn block">${mode==='login'?'Se connecter':'Créer mon compte'}</button><p class="note">Version de démonstration : aucun compte réel ni paiement. Les données restent sur cet appareil.</p>`};
 draw();$('#f').onclick=e=>{if(e.target.dataset.m){mode=e.target.dataset.m;draw()}};
 $('#f').onsubmit=e=>{e.preventDefault();const em=$('#em').value,prev=user();S.set('user',{name:mode==='signup'?$('#nm').value:(prev&&prev.email===em?prev.name:em.split('@')[0]),email:em,plan:mode==='signup'?$('#pl').value:(prev&&prev.plan)||'free'});location.href=qs('next')||'espace.html'};
}
function apropos(){if(window.contactInit)contactInit($('#ct'))}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded',()=>{layout();headBg();nlInit();
 ({home,catalogue,lesson,programmes,prepa,montagne,materiel,quiz,glossaire,journal,espace,connexion,apropos,...(window.BIZ||{})}[page]||(()=>{}))();
 $$('.rv:not(.in)').forEach(e=>IO.observe(e));
});
