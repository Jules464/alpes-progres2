/* ===== Espaces Vente · CRM · Stratégie · Communication (démo : données fictives, stockées dans le navigateur) ===== */
const TVA=1.2,eur=n=>n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €',ht=t=>Math.round(t/TVA*100)/100,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const OFFERS=[
 {id:'decouverte',plan:'free',name:'Découverte',ttc:0,per:'',tag:'Pour essayer',desc:'Les cours gratuits et la sécurité en montagne, sans carte bancaire.',
  inc:[LESSONS.filter(l=>!l.premium).length+' cours en accès libre (technique de base, échauffement, sécurité)','Rubrique « Vie en montagne » complète','Test de niveau et suivi de progression','Newsletter hebdomadaire'],
  exc:['Cours confirmés et experts (godille, carving, bosses, poudreuse)','Plan physique complet de 6 semaines','Fiches PDF à imprimer','Analyse vidéo personnalisée']},
 {id:'premium-mensuel',plan:'premium',name:'Premium mensuel',ttc:9.9,per:'/ mois',tag:'Sans engagement',desc:'Tous les cours, résiliable en un clic à tout moment.',
  inc:[LESSONS.length+' cours vidéo, tous niveaux','Plan physique de 6 semaines et bibliothèque d’exercices','Erreurs fréquentes et corrections pour chaque mouvement','Fiches mémento à imprimer','Nouveaux cours chaque mois'],
  exc:['Analyse vidéo personnalisée','Visio avec un moniteur','Remise annuelle (−33 %)']},
 {id:'premium-annuel',plan:'premium',name:'Premium annuel',ttc:79,per:'/ an',best:true,tag:'Le plus choisi · −33 % vs mensuel',desc:'La formule de la saison : tout Premium pour 6,58 € par mois.',
  inc:['Tout Premium mensuel','Accès toute l’année, y compris la prépa d’avant-saison','Accès prioritaire aux nouveaux cours','Un an de mises à jour incluses'],
  exc:['Analyse vidéo personnalisée','Visio avec un moniteur']},
 {id:'coaching',plan:'coaching',name:'Coaching',ttc:39,per:'/ mois',tag:'Accompagnement personnalisé',desc:'Tout Premium plus un retour humain sur votre ski.',
  inc:['Tout Premium','Analyse de 2 vidéos de votre ski par mois, avec corrections écrites','Visio individuelle de 30 minutes par mois','Plan d’entraînement adapté à votre niveau'],
  exc:['Cours de ski en présentiel sur les pistes','Matériel ni forfaits de remontées']}
];
const offerById=id=>OFFERS.find(o=>o.id===id)||OFFERS[2];
const store={get:(k,d)=>S.get(k,d),set:(k,v)=>S.set(k,v)};
const orders=()=>store.get('orders',[]);

/* ---------- contact : crée un prospect dans le CRM ---------- */
function addLead(l){const db=store.get('crm',null)||crmSeed();const id=Math.max(0,...db.map(c=>c.id))+1,d=today();
 db.push({id,name:l.name,email:l.email,phone:'',city:l.city||'—',level:'—',source:l.source||'Site web',stage:'new',offer:l.offer||'premium-annuel',amount:0,
  hist:[[d,'Message',l.msg||'Demande de contact depuis le site']],next:['Répondre au message',d],created:d});store.set('crm',db)}
function contactInit(f){if(!f)return;f.onsubmit=e=>{e.preventDefault();const i=f.querySelectorAll('input,textarea');
 addLead({name:i[0].value,email:i[1].value,msg:i[2].value,source:'Site web'});
 f.innerHTML='<h3>Message envoyé ✓</h3><p class="note" style="font-size:.95rem">Merci ! Dans cette démo, votre message crée un prospect « Nouveau » dans le <a href="crm.html" style="color:var(--sun)">CRM</a>.</p>'}}
const today=()=>new Date().toISOString().slice(0,10);

/* ================= VENTE : offre ================= */
function offre(){
 $('#plans').innerHTML=OFFERS.map(o=>`<div class="plan ${o.best?'best':''}">${o.best?'<span class="badge">Le plus choisi</span>':''}<small style="color:var(--muted);font-weight:600">${o.tag}</small><h3>${o.name}</h3><div class="price">${o.ttc?eur(o.ttc).replace(',00',''):'0 €'}<small> TTC ${o.per}</small></div>
 <small style="color:var(--muted)">${o.ttc?'soit '+eur(ht(o.ttc))+' HT · TVA 20 % incluse':'Gratuit, sans carte bancaire'}</small><p style="margin:12px 0 0;color:var(--muted);font-size:.92rem">${o.desc}</p>
 <ul>${o.inc.map(x=>`<li>${x}</li>`).join('')}${o.exc.map(x=>`<li class="no">${x}</li>`).join('')}</ul><a class="btn ${o.best?'':'dark'} block" href="checkout.html?offer=${o.id}">${o.ttc?'Choisir cette offre':'Créer mon compte'}</a></div>`).join('');
 $('#cmp').innerHTML='<tr><th></th>'+OFFERS.map(o=>`<th>${o.name}</th>`).join('')+'</tr>'+[['Prix TTC',o=>o.ttc?eur(o.ttc)+' '+o.per:'0 €'],['Prix HT',o=>o.ttc?eur(ht(o.ttc)):'0 €'],['Cours gratuits',o=>'✓'],['24 cours vidéo',o=>o.plan==='free'?'–':'✓'],['Plan physique 6 semaines',o=>o.plan==='free'?'–':'✓'],['Analyse vidéo + visio',o=>o.plan==='coaching'?'✓':'–']].map(([t,f])=>`<tr><td>${t}</td>${OFFERS.map(o=>`<td>${f(o)}</td>`).join('')}</tr>`).join('');
 contactInit($('#ct'));
}

/* ================= VENTE : achat simulé ================= */
function checkout(){
 let off=offerById(qs('offer')),step=1,promo='',cust={name:'Camille Démo',email:'camille.demo@example.com',city:'Lyon'};
 const price=()=>off.id==='premium-annuel'&&promo==='FONDATEUR'?59:off.ttc;
 const steps=['Offre','Coordonnées','Paiement','Confirmation'];
 const draw=()=>{const t=price();
  $('#stepper').innerHTML=steps.map((s,i)=>`<div class="st ${i+1===step?'on':i+1<step?'ok':''}"><i>${i+1<step?'✓':i+1}</i>${s}</div>`).join('');
  const p=step===1?`<h3>1. Choisissez votre offre</h3><div class="opts">${OFFERS.map(o=>`<label class="radio ${o.id===off.id?'on':''}"><input type="radio" name="o" value="${o.id}" ${o.id===off.id?'checked':''}><span><b>${o.name}</b><small>${o.ttc?eur(o.ttc)+' TTC '+o.per:'Gratuit'}</small></span></label>`).join('')}</div><button class="btn" data-go="2">Continuer</button>`
  :step===2?`<h3>2. Vos coordonnées</h3><p class="note" style="text-align:left">Démo : utilisez des données fictives, rien n’est envoyé.</p><label>Nom et prénom</label><input id="nm" value="${esc(cust.name)}" required><label>Email</label><input id="em" type="email" value="${esc(cust.email)}" required><label>Ville</label><input id="ci" value="${esc(cust.city)}"><p style="margin-top:20px"><button class="btn line" data-go="1">Retour</button> <button class="btn" data-go="${off.ttc?3:4}">${off.ttc?'Continuer vers le paiement':'Créer mon compte'}</button></p>`
  :`<h3>3. Paiement (simulé)</h3><div class="box ok" style="margin-top:12px"><b>Aucun vrai paiement.</b> N’entrez aucune vraie carte : les champs sont pré-remplis avec un numéro de test et rien n’est enregistré.</div>
   <label>Code promo</label><div style="display:flex;gap:8px"><input id="pr" placeholder="ex. FONDATEUR" value="${promo}"><button class="btn line sm" data-go="promo">Appliquer</button></div>${promo&&price()===off.ttc?'<small style="color:var(--sun)">Code non valable pour cette offre.</small>':promo?'<small style="color:var(--ok)">Code appliqué : offre fondateur 59 € TTC.</small>':''}
   <label>Titulaire</label><input value="CAMILLE DEMO"><label>Numéro de carte (test)</label><input value="4242 4242 4242 4242" inputmode="numeric"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><label>Expiration</label><input value="12/30"></div><div><label>Cryptogramme</label><input value="123"></div></div>
   <label style="display:flex;gap:10px;align-items:flex-start;font-weight:400"><input id="cg" type="checkbox" style="width:auto;margin-top:5px"><span>J’ai lu les <a href="legal.html#cgv" target="_blank" style="color:var(--sun)">conditions générales de vente</a>.</span></label>
   <p style="margin-top:20px"><button class="btn line" data-go="2">Retour</button> <button class="btn" data-go="pay">Payer ${eur(t)} (simulé)</button></p>`;
  $('#panel').innerHTML=p;
  $('#sum').innerHTML=`<h3>Récapitulatif</h3><p><b>${off.name}</b></p><dl><dt>Prix TTC</dt><dd>${eur(t)} ${off.per}</dd><dt>Dont TVA 20 %</dt><dd>${eur(t-ht(t))}</dd><dt>Prix HT</dt><dd>${eur(ht(t))}</dd></dl><p class="note" style="text-align:left">Prix en euros, TVA française 20 % incluse. Paiement simulé : aucun débit.</p>`};
 const save=()=>{const g=id=>$(id)&&$(id).value;if($('#nm')){cust={name:g('#nm')||cust.name,email:g('#em')||cust.email,city:g('#ci')||cust.city}}};
 $('#panel').onclick=e=>{const go=e.target.dataset.go;if(!go)return;save();
  if(go==='promo'){promo=$('#pr').value.trim().toUpperCase();draw();return}
  if(go==='pay'){if(!$('#cg').checked){alert('Merci d’accepter les conditions générales de vente.');return}finish();return}
  if(go==='3'&&!cust.email.includes('@')){alert('Email invalide');return}
  if(go==='4'){finish();return}step=+go;draw()};
 $('#panel').onchange=e=>{if(e.target.name==='o'){off=offerById(e.target.value);draw()}};
 function finish(){$('#panel').innerHTML='<div class="center" style="padding:40px"><div class="spin"></div><p style="margin-top:16px">Paiement simulé en cours…</p></div>';
  setTimeout(()=>{const t=price(),o={id:'CMD-'+Date.now().toString(36).toUpperCase(),offer:off.id,name:cust.name,email:cust.email,city:cust.city,ttc:t,promo:promo&&t!==off.ttc?promo:'',date:today()};
   const all=orders();all.push(o);store.set('orders',all);store.set('user',{name:cust.name,email:cust.email,plan:off.plan});location.href='confirmation.html?o='+o.id},1300)}
 draw();
}
function confirmation(){
 const o=orders().find(x=>x.id===qs('o')),b=$('#conf');
 if(!o){b.innerHTML='<h2>Aucune commande trouvée</h2><p class="lead" style="margin-inline:auto">Passez par le parcours d’achat pour générer une confirmation.</p><p style="margin-top:24px"><a class="btn" href="offre.html">Voir l’offre</a></p>';return}
 const of=offerById(o.offer);
 b.innerHTML=`<div class="okmark">✓</div><div class="eyebrow" style="justify-content:center">Commande simulée confirmée</div><h2>Merci ${esc(o.name.split(' ')[0])} !</h2><p class="lead" style="margin-inline:auto">${of.ttc?'Votre paiement a été simulé : aucun montant n’a été débité.':'Votre compte gratuit est créé.'} Votre accès ${of.plan==='free'?'Découverte':'Premium'} est actif sur cet appareil.</p>
 <div class="receipt"><div><span>N° de commande</span><b>${o.id}</b></div><div><span>Offre</span><b>${of.name}</b></div><div><span>Date</span><b>${o.date}</b></div><div><span>Total TTC</span><b>${eur(o.ttc)}</b></div><div><span>Dont HT</span><b>${eur(ht(o.ttc))}</b></div><div><span>Email</span><b>${esc(o.email)}</b></div></div>
 <p style="margin-top:28px"><a class="btn" href="catalogue.html">Commencer les cours</a> <a class="btn line" href="crm.html">Voir cette commande dans le CRM →</a></p>
 <p class="note">Bonus démo : la commande apparaît dans le CRM comme client « Gagné », source « Site (achat démo) ».</p>`;
}

/* ================= CRM (côté entreprise) ================= */
const SRC=['Instagram','TikTok','YouTube','Partenaire','Salon','Bouche-à-oreille','Site web','Newsletter','Site (achat démo)'];
const STAGES=[['new','Nouveau'],['contacted','Contacté'],['proposal','Proposition envoyée'],['won','Gagné'],['lost','Perdu']];
const stageName=s=>STAGES.find(x=>x[0]===s)[1];
const addDays=(d,n)=>{const x=new Date(d+'T12:00:00Z');x.setUTCDate(x.getUTCDate()+n);return x.toISOString().slice(0,10)};
const slug=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]+/g,'.').replace(/^\.|\.$/g,'');
function crmSeed(){
 const P=[['Camille Fournier','Lyon','Intermédiaire','Instagram','won','premium-annuel'],['Hugo Lemaire','Grenoble','Confirmé','YouTube','won','premium-annuel'],['Sarah Benali','Annecy','Débutant','Partenaire','won','premium-mensuel'],['Thomas Girard','Paris','Intermédiaire','TikTok','won','coaching'],['Inès Moreau','Chambéry','Intermédiaire','Bouche-à-oreille','won','premium-annuel'],
 ['Lucas Perrin','Toulouse','Intermédiaire','Instagram','proposal','premium-annuel'],['Manon Dubois','Marseille','Débutant','Newsletter','proposal','premium-mensuel'],['Antoine Roux','Lille','Confirmé','YouTube','proposal','coaching'],['Clara Vasseur','Nantes','Intermédiaire','Salon','proposal','premium-annuel'],['Nicolas Faure','Lyon','Confirmé','Partenaire','proposal','premium-annuel'],
 ['Léa Marchand','Bordeaux','Débutant','TikTok','contacted','premium-annuel'],['Julien Lambert','Strasbourg','Intermédiaire','Site web','contacted','premium-mensuel'],['Emma Chevalier','Paris','Intermédiaire','Instagram','contacted','premium-annuel'],['Maxime Blanc','Grenoble','Confirmé','Salon','contacted','coaching'],['Pauline Garnier','Annecy','Débutant','Newsletter','contacted','premium-annuel'],['Romain Colin','Rennes','Intermédiaire','Bouche-à-oreille','contacted','premium-annuel'],
 ['Chloé Renard','Lyon','Débutant','TikTok','new','premium-annuel'],['Alexis Masson','Toulouse','Intermédiaire','Site web','new','premium-mensuel'],['Océane Morel','Nice','Intermédiaire','Instagram','new','premium-annuel'],['Baptiste Henry','Montpellier','Confirmé','YouTube','new','premium-annuel'],['Élodie Fabre','Dijon','Débutant','Newsletter','new','premium-mensuel'],['Kevin Meyer','Metz','Intermédiaire','Partenaire','new','premium-annuel'],
 ['Marion Leclerc','Paris','Intermédiaire','Instagram','lost','premium-annuel'],['Théo Charpentier','Lille','Débutant','TikTok','lost','premium-mensuel']];
 const NEXT={new:['Envoyer l’email de bienvenue',2],contacted:['Relancer pour proposer l’offre',3],proposal:['Relancer la proposition',2],won:['Envoyer l’enquête de satisfaction',5],lost:['Recontacter avant la saison prochaine',90]};
 const LOST=['Prix jugé trop élevé pour 1 semaine de ski par an','Préfère un cours en présentiel avec un moniteur'];
 return P.map(([name,city,level,source,stage,offer],i)=>{const o=offerById(offer),c=addDays('2026-10-31',-((i*3)%24)),h=[[c,'Message',source==='Salon'?'Rencontré sur un salon, coordonnées échangées':'Premier contact via '+source]];
  if(stage!=='new'){h.push([addDays(c,2),'Email','Email de bienvenue avec 3 cours gratuits'],[addDays(c,5),'Appel','Échange de 10 min : niveau '+level.toLowerCase()+', veut progresser en sécurité'])}
  if(stage==='proposal'||stage==='won')h.push([addDays(c,8),'Email','Proposition envoyée : '+o.name+' à '+eur(o.ttc)+' TTC']);
  if(stage==='won')h.push([addDays(c,11),'Paiement','Commande payée (simulée) : '+o.name+' · '+eur(o.ttc)]);
  if(stage==='lost')h.push([addDays(c,9),'Note',LOST[i%2]]);
  const n=NEXT[stage];return{id:i+1,name,email:slug(name)+'@example.com',phone:'06 39 98 '+String(10+i).padStart(2,'0')+' '+String(40+i*2).padStart(2,'0'),city,level,source,stage,offer,amount:o.ttc,hist:h,next:[n[0],addDays('2026-11-13',n[1])],created:c}})}
function crmLoad(){let db=store.get('crm',null);if(!db){db=crmSeed();store.set('crm',db)}
 orders().forEach(o=>{if(db.some(c=>c.orderId===o.id))return;const id=Math.max(0,...db.map(c=>c.id))+1,of=offerById(o.offer);
  db.push({id,orderId:o.id,name:o.name,email:o.email,phone:'—',city:o.city||'—',level:'—',source:'Site (achat démo)',stage:o.ttc?'won':'new',offer:o.offer,amount:o.ttc,hist:[[o.date,'Commande','Commande '+o.id+' passée sur le site : '+of.name+' · '+eur(o.ttc)+' TTC (paiement simulé)']],next:['Envoyer le message de bienvenue',o.date],created:o.date})});
 store.set('crm',db);return db}

function crm(){
 const root=$('#app'),AUTH='crm_ok';let view='dash',db,q='',fs='',fst='';
 const ok=()=>{try{return sessionStorage.getItem(AUTH)==='1'}catch(e){return false}};
 const login=()=>{root.innerHTML=`<div class="crm-login"><div class="logo-big">🔐</div><h2 style="font-size:2.4rem">CRM AlpesProgrès</h2><p class="note" style="margin-bottom:6px">Espace interne · côté entreprise</p>
  <form class="form" id="lf" style="margin:0"><div class="box ok" style="margin:0 0 6px"><b>Identifiants de démonstration</b><br>Identifiant : <code>demo@alpesprogres.fr</code><br>Mot de passe : <code>demo2026</code></div>
  <label>Identifiant</label><input id="lu" autocomplete="off" required><label>Mot de passe</label><input id="lp" type="password" autocomplete="off" required><p id="le" style="color:#d63a14;font-size:.85rem;margin-top:10px"></p><button class="btn block" style="margin-top:10px">Se connecter</button><button type="button" class="btn line block" id="fill" style="margin-top:10px">Remplir avec les identifiants de démo</button><p class="note">Pas de vrai compte : écran de connexion de démonstration, données 100 % fictives.</p></form></div>`;
  $('#fill').onclick=()=>{$('#lu').value='demo@alpesprogres.fr';$('#lp').value='demo2026'};
  $('#lf').onsubmit=e=>{e.preventDefault();if($('#lu').value.trim()==='demo@alpesprogres.fr'&&$('#lp').value==='demo2026'){try{sessionStorage.setItem(AUTH,'1')}catch(x){}app()}else $('#le').textContent='Identifiants incorrects. Utilisez ceux écrits ci-dessus.'}};
 const sum=a=>a.reduce((s,c)=>s+c.amount,0);
 const pill=s=>`<span class="stg s-${s}">${stageName(s)}</span>`;
 const app=()=>{db=crmLoad();root.innerHTML=`<div class="crm-bar"><div class="crm-tabs">${[['dash','📊 Tableau de bord'],['contacts','👥 Contacts'],['pipe','🧭 Pipeline']].map(([k,t])=>`<button data-v="${k}" class="${k===view?'on':''}">${t}</button>`).join('')}</div><div><button class="btn sm" id="nc">+ Nouveau contact</button> <button class="btn sm line" id="rs">Réinitialiser la démo</button> <button class="btn sm line" id="lo">Déconnexion</button></div></div><div id="v"></div><div id="md"></div>`;
  $('.crm-tabs').onclick=e=>{if(e.target.dataset.v){view=e.target.dataset.v;app()}};$('#nc').onclick=()=>sheet(null);
  $('#rs').onclick=()=>{if(confirm('Remettre les 24 contacts de démonstration ? (les commandes du site seront ré-importées)')){localStorage.removeItem('crm');app()}};
  $('#lo').onclick=()=>{try{sessionStorage.removeItem(AUTH)}catch(e){}login()};({dash,contacts,pipe}[view])()};
 /* tableau de bord */
 const dash=()=>{const won=db.filter(c=>c.stage==='won'),ca=sum(won),lost=db.filter(c=>c.stage==='lost').length,open=db.filter(c=>!['won','lost'].includes(c.stage)),conv=db.length?won.length/db.length*100:0,conv2=won.length+lost?won.length/(won.length+lost)*100:0;
  const mx=Math.max(...STAGES.map(([s])=>db.filter(c=>c.stage===s).length));
  const nx=[...db].filter(c=>!['won','lost'].includes(c.stage)).sort((a,b)=>a.next[1].localeCompare(b.next[1])).slice(0,6);
  $('#v').innerHTML=`<div class="kpis"><div class="kpi"><small>Chiffre d’affaires (TTC)</small><b>${eur(ca)}</b><span>${eur(ht(ca))} HT · ${won.length} vente${won.length>1?'s':''}</span></div><div class="kpi"><small>Clients</small><b>${won.length}</b><span>sur ${db.length} contacts</span></div><div class="kpi"><small>Taux de conversion</small><b>${conv.toFixed(1).replace('.',',')} %</b><span>${won.length} gagnés / ${db.length} contacts · ${conv2.toFixed(0)} % des dossiers clos</span></div><div class="kpi"><small>Pipeline en cours</small><b>${eur(sum(open))}</b><span>${open.length} dossiers ouverts (potentiel TTC)</span></div></div>
  <div class="two"><div class="card pad"><h3>Contacts par étape</h3>${STAGES.map(([s,t])=>{const n=db.filter(c=>c.stage===s).length;return `<div class="hb"><span>${t}</span><div><i class="s-${s}" style="width:${mx?n/mx*100:0}%"></i></div><b>${n}</b></div>`}).join('')}</div>
  <div class="card pad"><h3>Prochaines actions</h3>${nx.map(c=>`<div class="nx" data-id="${c.id}"><b>${esc(c.name)}</b><span>${esc(c.next[0])}</span><small>${c.next[1]}</small></div>`).join('')}</div></div>
  <div class="card pad" style="margin-top:22px;overflow:auto"><h3>Performance par source</h3><table class="tbl"><tr><th>Source</th><th>Contacts</th><th>Gagnés</th><th>Conversion</th><th>CA TTC</th></tr>${SRC.map(s=>{const a=db.filter(c=>c.source===s);if(!a.length)return '';const w=a.filter(c=>c.stage==='won');return `<tr><td>${s}</td><td>${a.length}</td><td>${w.length}</td><td>${(w.length/a.length*100).toFixed(0)} %</td><td>${eur(sum(w))}</td></tr>`}).join('')}</table></div>`;
  $('#v').onclick=e=>{const n=e.target.closest('.nx');if(n)sheet(+n.dataset.id)}};
 /* contacts */
 const contacts=()=>{$('#v').innerHTML=`<div class="toolbar"><input class="search" id="qs" placeholder="🔍 Rechercher un nom, une ville, un email" value="${esc(q)}"><select class="search" id="fs" style="flex:0 0 auto"><option value="">Toutes sources</option>${SRC.map(s=>`<option ${s===fs?'selected':''}>${s}</option>`).join('')}</select><select class="search" id="fst" style="flex:0 0 auto"><option value="">Toutes étapes</option>${STAGES.map(([s,t])=>`<option value="${s}" ${s===fst?'selected':''}>${t}</option>`).join('')}</select></div><p class="count" id="cn"></p><div class="card pad" style="overflow:auto"><table class="tbl rows" id="tb"></table></div>`;
  const draw=()=>{const l=db.filter(c=>(c.name+c.city+c.email).toLowerCase().includes(q.toLowerCase())&&(!fs||c.source===fs)&&(!fst||c.stage===fst));$('#cn').textContent=l.length+' contact'+(l.length>1?'s':'')+' sur '+db.length;
   $('#tb').innerHTML='<tr><th>Nom</th><th>Ville</th><th>Source</th><th>Étape</th><th>Prochaine action</th><th>Valeur</th></tr>'+l.map(c=>`<tr data-id="${c.id}"><td><b>${esc(c.name)}</b></td><td>${esc(c.city)}</td><td>${c.source}</td><td>${pill(c.stage)}</td><td>${esc(c.next[0])}<br><small>${c.next[1]}</small></td><td>${eur(c.amount)}</td></tr>`).join('')};
  draw();$('#qs').oninput=e=>{q=e.target.value;draw()};$('#fs').onchange=e=>{fs=e.target.value;draw()};$('#fst').onchange=e=>{fst=e.target.value;draw()};$('#tb').onclick=e=>{const r=e.target.closest('tr[data-id]');if(r)sheet(+r.dataset.id)}};
 /* pipeline */
 const move=(id,s)=>{const c=db.find(x=>x.id===id);if(!c||c.stage===s)return;c.stage=s;c.hist.push([today(),'Étape','Passé à « '+stageName(s)+' »']);if(s==='won')c.amount=offerById(c.offer).ttc;store.set('crm',db)};
 const pipe=()=>{$('#v').innerHTML=`<p class="count">Glissez les cartes d’une colonne à l’autre, ou utilisez les flèches. Cliquez sur une carte pour ouvrir la fiche.</p><div class="kanban">${STAGES.map(([s,t],i)=>{const a=db.filter(c=>c.stage===s);return `<div class="kcol" data-s="${s}"><h4><span>${t}</span><b>${a.length}</b></h4><small>${eur(sum(a))}</small>${a.map(c=>`<div class="kc" draggable="true" data-id="${c.id}"><b>${esc(c.name)}</b><span>${offerById(c.offer).name} · ${eur(c.amount)}</span><small>${c.source}</small><div class="mv">${i>0?`<button data-m="${STAGES[i-1][0]}" aria-label="Étape précédente">◀</button>`:'<i></i>'}${i<4?`<button data-m="${STAGES[i+1][0]}" aria-label="Étape suivante">▶</button>`:'<i></i>'}</div></div>`).join('')}</div>`}).join('')}</div>`;
  const v=$('#v');v.onclick=e=>{const b=e.target.closest('button[data-m]');const k=e.target.closest('.kc');if(b&&k){move(+k.dataset.id,b.dataset.m);pipe();return}if(k)sheet(+k.dataset.id)};
  v.ondragstart=e=>{const k=e.target.closest('.kc');if(k)e.dataTransfer.setData('text/plain',k.dataset.id)};v.ondragover=e=>{if(e.target.closest('.kcol'))e.preventDefault()};
  v.ondrop=e=>{const c=e.target.closest('.kcol');if(!c)return;e.preventDefault();move(+e.dataTransfer.getData('text/plain'),c.dataset.s);pipe()}};
 /* fiche contact */
 const sheet=id=>{const c=id?db.find(x=>x.id===id):{name:'',email:'',phone:'',city:'',level:'Intermédiaire',source:'Instagram',stage:'new',offer:'premium-annuel',amount:0,hist:[],next:['Envoyer l’email de bienvenue',today()]};
  const m=$('#md');m.innerHTML=`<div class="modal" id="mo"><div class="mbox"><button class="x" id="xx" aria-label="Fermer">×</button><h3 style="font-size:2rem">${id?esc(c.name):'Nouveau contact'}</h3>${id?`<p>${pill(c.stage)} <span class="pill">${c.source}</span> <span class="pill">${offerById(c.offer).name}</span></p>`:''}
  <div class="fgrid"><div><label>Nom</label><input id="f-n" value="${esc(c.name)}"></div><div><label>Email</label><input id="f-e" value="${esc(c.email)}"></div><div><label>Téléphone (fictif)</label><input id="f-p" value="${esc(c.phone)}"></div><div><label>Ville</label><input id="f-v" value="${esc(c.city)}"></div>
  <div><label>Source</label><select id="f-s">${SRC.map(s=>`<option ${s===c.source?'selected':''}>${s}</option>`).join('')}</select></div><div><label>Offre visée</label><select id="f-o">${OFFERS.filter(o=>o.ttc).map(o=>`<option value="${o.id}" ${o.id===c.offer?'selected':''}>${o.name} · ${eur(o.ttc)}</option>`).join('')}</select></div>
  <div><label>Étape du pipeline</label><select id="f-t">${STAGES.map(([s,t])=>`<option value="${s}" ${s===c.stage?'selected':''}>${t}</option>`).join('')}</select></div><div><label>Niveau</label><input id="f-l" value="${esc(c.level)}"></div></div>
  <h4 style="margin-top:18px">Prochaine action</h4><div class="fgrid"><div><label>Action</label><input id="f-na" value="${esc(c.next[0])}"></div><div><label>Date</label><input id="f-nd" type="date" value="${c.next[1]}"></div></div>
  ${id?`<h4 style="margin-top:18px">Historique des échanges</h4><div class="tl">${[...c.hist].reverse().map(h=>`<div><small>${h[0]} · ${h[1]}</small><p>${esc(h[2])}</p></div>`).join('')}</div><div class="fgrid" style="grid-template-columns:130px 1fr auto"><select id="h-t"><option>Note</option><option>Appel</option><option>Email</option><option>Message</option></select><input id="h-x" placeholder="Ajouter un échange…"><button class="btn sm line" id="h-a">Ajouter</button></div>`:''}
  <p style="margin-top:20px"><button class="btn" id="sv">${id?'Enregistrer':'Créer le contact'}</button></p></div></div>`;
  const close=()=>{m.innerHTML=''};$('#xx').onclick=close;$('#mo').onclick=e=>{if(e.target.id==='mo')close()};
  const read=()=>{c.name=$('#f-n').value||'Sans nom';c.email=$('#f-e').value;c.phone=$('#f-p').value;c.city=$('#f-v').value;c.source=$('#f-s').value;c.offer=$('#f-o').value;c.level=$('#f-l').value;c.next=[$('#f-na').value,$('#f-nd').value];const ns=$('#f-t').value;if(id&&ns!==c.stage){c.stage=ns;c.hist.push([today(),'Étape','Passé à « '+stageName(ns)+' »'])}else c.stage=ns;if(!c.orderId)c.amount=offerById(c.offer).ttc};
  $('#sv').onclick=()=>{read();if(!id){c.id=Math.max(0,...db.map(x=>x.id))+1;c.created=today();c.hist=[[today(),'Note','Contact créé manuellement dans le CRM']];db.push(c)}store.set('crm',db);app()};
  if(id)$('#h-a').onclick=()=>{const t=$('#h-x').value.trim();if(!t)return;read();c.hist.push([today(),$('#h-t').value,t]);store.set('crm',db);sheet(id);}};
 ok()?app():login();
}

/* ================= STRATÉGIE : calculateur de l'objectif à 12 mois ================= */
const COSTS={marketing:1200,video:1000,outils:300,salaire:1500},FEES=.03;
function strategie(){
 const fixed=Object.values(COSTS).reduce((a,b)=>a+b,0)*12,A=79,tA=ht(A),feeA=A*FEES,be=Math.ceil(fixed/(tA-feeA));
 $('#be').textContent=be.toLocaleString('fr-FR');$('#fixed').textContent=eur(fixed).replace(',00','');$('#tha').textContent=eur(tA);
 const f=$('#obj'),calc=()=>{const a=+f.a.value,m=+f.m.value,c=+f.c.value,tM=m*5*9.9,tC=c*6*39,tA2=a*79,ttc=tA2+tM+tC,h=ttc/TVA,fee=ttc*FEES,res=h-fee-fixed;
  $('#o-a').textContent=a;$('#o-m').textContent=m;$('#o-c').textContent=c;
  $('#o-out').innerHTML=`<tr><td>${a} Premium annuels × 79 €</td><td>${eur(tA2)}</td></tr><tr><td>${m} Premium mensuels × 5 mois × 9,90 €</td><td>${eur(tM)}</td></tr><tr><td>${c} Coaching × 6 mois × 39 €</td><td>${eur(tC)}</td></tr><tr class="t"><td>Chiffre d’affaires TTC</td><td>${eur(ttc)}</td></tr><tr><td>Chiffre d’affaires HT (÷ 1,20)</td><td>${eur(h)}</td></tr><tr><td>Frais de paiement (3 % du TTC, estimation)</td><td>− ${eur(fee)}</td></tr><tr><td>Coûts fixes sur 12 mois</td><td>− ${eur(fixed)}</td></tr><tr class="t ${res>=0?'pos':'neg'}"><td>Résultat sur 12 mois</td><td>${eur(res)}</td></tr>`;
  $('#o-n').textContent=(a+m+c).toLocaleString('fr-FR');$('#o-sh').textContent=((a+m+c)/880000*100).toFixed(2).replace('.',',')};
 f.oninput=calc;calc();
}

/* ================= COMMUNICATION : posts prêts à publier ================= */
const NETS={Instagram:['#c13584','#ff9a3c'],TikTok:['#0b0b0f','#2bb3c0'],YouTube:['#b3121a','#ff5a1f']};
const POSTS=[
 {net:'Instagram',fmt:'Reel 9:16 · 25 s',date:'2026-11-16',lines:['3 ERREURS','QUI TE BLOQUENT','EN PISTE ROUGE'],obj:'Notoriété : premières vues et abonnés',
  text:'Tu skies depuis plusieurs hivers, mais la piste rouge te met encore la pression ? 🎿\n\nLes 3 erreurs qu’on voit le plus :\n1️⃣ Le regard collé aux spatules\n2️⃣ Le buste qui part en arrière\n3️⃣ Le poids sur le ski intérieur\n\nDans la vidéo, on décompose chacune en 15 secondes. Le cours « Le virage dérapé » est gratuit : lien en bio.\n\n#ski #skialpin #progresserauski #technique #montagne'},
 {net:'TikTok',fmt:'Vidéo 9:16 · 30 s',date:'2026-11-18',lines:['LE CHASSE-NEIGE','EN 30 SECONDES'],obj:'Trafic vers le cours gratuit « Le chasse-neige »',
  text:'Le chasse-neige, ce n’est pas « juste freiner » 👇\n\n✅ Chevilles fléchies\n✅ Talons écartés, spatules proches\n✅ Carres internes posées\n\nCours gratuit avec la décomposition étape par étape : lien en bio.\n\n#skitok #apprendreaskier #chasseneige #ski'},
 {net:'YouTube',fmt:'Short 9:16 · 45 s',date:'2026-11-20',lines:['TES GENOUX','SOUFFRENT ?','FAIS ÇA'],obj:'Clics vers le cours gratuit « Gainage » et abonnés',
  text:'Environ un tiers des accidents de ski sont des entorses du genou (source : LaSante.net, lien dans la description).\n\n3 exercices de 20 secondes pour préparer tes jambes avant la saison : chaise murale, fente latérale, appui sur une jambe.\n\nLe plan complet de 6 semaines est sur AlpesProgrès : lien en description.\n\n#shorts #ski #preparationphysique #genoux'},
 {net:'Instagram',fmt:'Carrousel 4:5 · 6 slides',date:'2026-11-23',lines:['PRÉPA SKI','6 SEMAINES','LE PLAN'],obj:'Sauvegardes et inscriptions gratuites',
  text:'6 semaines pour arriver affûté en décembre 💪\n\nSlide 2 · Semaines 1-2 : gainage et squats lents\nSlide 3 · Semaines 3-4 : force et équilibre\nSlide 4 · Semaine 5 : explosivité (sauts latéraux)\nSlide 5 · Semaine 6 : affûtage et récupération\nSlide 6 : le plan complet à télécharger, lien en bio\n\nEnregistre ce post pour ne pas l’oublier ! 🔖\n\n#prepaski #ski #renforcement #skialpin'},
 {net:'TikTok',fmt:'Vidéo 9:16 · 20 s',date:'2026-11-25',lines:['LIRE LE BRA','EN 20 SECONDES'],obj:'Crédibilité et portée sur la sécurité',
  text:'Le bulletin d’avalanche, ça se lit en 20 secondes ⚠️\n\nRisque de 1 (faible) à 5 (très fort). À partir de 3 : prudence maximale. Le BRA est publié chaque jour par massif.\n\nCours gratuit « Comprendre le bulletin d’avalanche » : lien en bio. Le ski comporte des risques.\n\n#avalanche #BRA #securite #montagne'},
 {net:'YouTube',fmt:'Vidéo 16:9 · 8 min',date:'2026-11-28',ratio:'16:9',lines:['LE VIRAGE DÉRAPÉ','DÉCOMPOSÉ'],obj:'Abonnés YouTube et trafic vers le site',
  text:'Le virage dérapé à skis parallèles, étape par étape.\n\n00:00 Introduction\n00:45 Départ en traversée\n02:10 Flexion–extension\n03:40 Pivotement\n05:15 Dérapage contrôlé\n06:40 Enchaînement\n07:30 Erreurs fréquentes\n\nLe cours complet avec exercices est gratuit sur AlpesProgrès (lien ci-dessous).\n\n#ski #virage #technique'},
 {net:'Instagram',fmt:'Reel 9:16 · 20 s',date:'2026-11-30',lines:['CHECK-LIST','AVANT DE PARTIR'],obj:'Engagement et partages',
  text:'Avant de chausser, 6 vérifications 👇\n\n☑️ Météo et BRA consultés\n☑️ Itinéraire communiqué à un proche\n☑️ DVA, pelle, sonde (hors-piste)\n☑️ Forfait, assurance, téléphone chargé\n☑️ Crème solaire, lunettes, eau\n☑️ Casque ajusté, fixations vérifiées\n\nPartage-la à ton binôme de ski ! La check-list interactive est sur le site.\n\n#securite #ski #montagne #checklist'},
 {net:'TikTok',fmt:'Vidéo 9:16 · 25 s',date:'2026-12-02',lines:['OFFRE FONDATEUR','59 € AU LIEU DE 79 €'],obj:'Conversion : obtenir les premiers clients',
  text:'Les 10 premiers abonnés Premium annuel paient 59 € TTC au lieu de 79 € avec le code FONDATEUR 🎿\n\nTous les cours vidéo, le plan physique de 6 semaines, les exercices et les corrections.\n\nLien en bio, 10 places seulement.\n\n#ski #offre #skialpin #progresser'},
 {net:'Instagram',fmt:'Carrousel 4:5 · 5 slides',date:'2026-12-04',lines:['3 CORRECTIONS','EN 1 DESCENTE'],obj:'Engagement et passage au Premium',
  text:'Une seule descente, trois corrections 👇\n\nSlide 2 · Regard : fixe un point 20 m devant toi\nSlide 3 · Chevilles : pousse les tibias contre la languette\nSlide 4 · Mains : devant, comme si tu portais un plateau\nSlide 5 : va plus loin avec les 24 cours (Premium dès 6,58 € / mois en annuel)\n\n#ski #conseils #technique #skialpin'},
 {net:'YouTube',fmt:'Short 9:16 · 15 s',date:'2026-12-07',lines:['RÈGLE FIS N°3','EN 15 SECONDES'],obj:'Confiance et notoriété sur la sécurité',
  text:'Règle FIS n°3 : le skieur amont doit éviter le skieur aval. Simple, et ça évite beaucoup de collisions.\n\nLes 10 règles de conduite sont expliquées dans notre cours gratuit (lien en description).\n\n#shorts #ski #securite #regleFIS'},
 {net:'TikTok',fmt:'Vidéo 9:16 · 20 s',date:'2026-12-09',lines:['QUELLE LONGUEUR','DE SKIS ?'],obj:'Trafic vers le calculateur de la page Matériel',
  text:'Quelle longueur de skis choisir ? 📏\n\nTa taille, ton niveau et ton style donnent une première estimation. Notre calculateur gratuit te la donne en 10 secondes.\n\nLe réglage des fixations se fait toujours en magasin.\n\n#materielski #ski #conseils'},
 {net:'Instagram',fmt:'Reel 9:16 · 15 s',date:'2026-12-11',lines:['DERNIÈRES PLACES','OFFRE FONDATEUR'],obj:'Conversion : clôturer l’offre fondateur',
  text:'Plus que quelques places pour l’offre fondateur ⏳\n\nPremium annuel à 59 € TTC au lieu de 79 € avec le code FONDATEUR : tous les cours, le plan physique de 6 semaines et les corrections.\n\nLien en bio.\n\n#ski #offre #skialpin'}
];
function postSvg(p){const r=p.ratio||(p.fmt.includes('4:5')?'4:5':'9:16'),W=r==='16:9'?1920:1080,H=r==='16:9'?1080:r==='4:5'?1350:1920,[a,b]=NETS[p.net],seed=hash(p.text),fs=r==='16:9'?150:130,y0=H*(r==='16:9'?.4:.34);
 const L=p.lines.map((t,i)=>`<text x="${W*.08}" y="${y0+i*fs*1.05}" font-size="${fs}" fill="${i===p.lines.length-1&&p.lines.length>1?'#ff9a3c':'#fff'}" font-weight="800" font-family="'Barlow Condensed','Arial Narrow',Impact,sans-serif">${esc(t)}</text>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="v${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071524"/><stop offset=".6" stop-color="#16395e"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#v${seed})"/><circle cx="${W*.78}" cy="${H*.2}" r="${W*.07}" fill="#fff" opacity=".85"/>
 <path d="${ridge(W,H,seed,H*.3,H*.7,14)}" fill="#fff" opacity=".18"/><path d="${ridge(W,H,seed+5,H*.26,H*.8,14)}" fill="#071524" opacity=".45"/><path d="${ridge(W,H,seed+9,H*.2,H*.9,14)}" fill="#071524" opacity=".8"/>${L}
 <rect x="${W*.08}" y="${H*.07}" width="${W*.26}" height="${H*.04}" rx="${H*.02}" fill="${a}"/><text x="${W*.08+W*.13}" y="${H*.07+H*.028}" text-anchor="middle" font-size="${W*.03}" fill="#fff" font-weight="700" font-family="Inter,Arial,sans-serif">${p.net.toUpperCase()}</text>
 <text x="${W*.08}" y="${H*.95}" font-size="${W*.045}" fill="#fff" font-weight="800" font-family="'Barlow Condensed','Arial Narrow',Impact,sans-serif">ALPES<tspan fill="#ff9a3c">PROGRÈS</tspan></text></svg>`}
const dfr=d=>new Date(d+'T12:00:00Z').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'});
function communication(){
 const nets=['Tous',...Object.keys(NETS)];let f='Tous';
 const draw=()=>{$('#posts').innerHTML=POSTS.map((p,i)=>({p,i})).filter(({p})=>f==='Tous'||p.net===f).map(({p,i})=>`<article class="post"><div class="pv" style="aspect-ratio:${(p.ratio||(p.fmt.includes('4:5')?'4:5':'9:16')).replace(':','/')}">${postSvg(p)}</div><div class="pb"><div><span class="pill" style="background:${NETS[p.net][0]};color:#fff">${p.net}</span><span class="pill">Post ${i+1}</span></div><h4 style="margin:8px 0 2px">${dfr(p.date)}</h4><small>${p.fmt}</small><p class="ob"><b>Objectif :</b> ${p.obj}</p><pre>${esc(p.text)}</pre><div><button class="btn sm line" data-c="${i}">Copier le texte</button> <button class="btn sm line" data-d="${i}">Télécharger le visuel</button></div></div></article>`).join('')};
 $('#pf').innerHTML=nets.map(n=>`<button class="chip ${n===f?'on':''}" data-n="${n}">${n}</button>`).join('');
 $('#pf').onclick=e=>{if(e.target.dataset.n){f=e.target.dataset.n;$$('#pf .chip').forEach(c=>c.classList.toggle('on',c.dataset.n===f));draw()}};
 $('#posts').onclick=e=>{const c=e.target.dataset.c,d=e.target.dataset.d;
  if(c!==undefined){navigator.clipboard&&navigator.clipboard.writeText(POSTS[c].text).then(()=>{e.target.textContent='Copié ✓'})}
  if(d!==undefined){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([postSvg(POSTS[d])],{type:'image/svg+xml'}));a.download='post-'+(+d+1)+'-'+POSTS[d].net.toLowerCase()+'.svg';a.click()}};
 draw();
 const wk=[['Semaine 1 · 16–22 nov.','Se faire connaître',[0,1,2]],['Semaine 2 · 23–29 nov.','Éduquer et rassurer',[3,4,5]],['Semaine 3 · 30 nov.–6 déc.','Engager et convertir',[6,7,8]],['Semaine 4 · 7–13 déc.','Sécuriser et clôturer l’offre',[9,10,11]]];
 $('#cal').innerHTML=wk.map(([t,th,ix])=>`<div class="wkc"><h4>${t}</h4><small>${th}</small>${ix.map(i=>`<div class="ci"><b>${new Date(POSTS[i].date+'T12:00:00Z').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',timeZone:'UTC'})}</b><span class="pill" style="background:${NETS[POSTS[i].net][0]};color:#fff">${POSTS[i].net}</span>${POSTS[i].lines.join(' ').toLowerCase()}</div>`).join('')}</div>`).join('');
}
window.BIZ={offre,checkout,confirmation,crm,strategie,communication};
