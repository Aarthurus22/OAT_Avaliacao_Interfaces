/* ===== DADOS DE EXEMPLO (fictícios) – edite aqui ===== */
const F=[
 {t:'Noite em Vermelho',y:2019,d:'2h 08min',dir:'A. Ferreira',g:['#7A1F2B','#20121A'],i:'8,4',r:92,a:89},
 {t:'O Último Farol',y:2021,d:'1h 52min',dir:'M. Duarte',g:['#1F3A5F','#0E1624'],i:'7,9',r:88,a:84},
 {t:'Dourado',y:2017,d:'2h 21min',dir:'L. Antunes',g:['#B8862B','#2A1E0B'],i:'8,1',r:95,a:90},
 {t:'Floresta de Vidro',y:2022,d:'1h 47min',dir:'C. Moraes',g:['#2F5D50','#0F1E1B'],i:'7,2',r:74,a:81},
 {t:'Eclipse',y:1998,d:'2h 05min',dir:'R. Salles',g:['#5B2A6E','#170C1D'],i:'8,8',r:97,a:93},
 {t:'Calor de Agosto',y:2015,d:'1h 38min',dir:'T. Nunes',g:['#A8432A','#2A110B'],i:'6,8',r:58,a:72},
 {t:'Meridiano',y:1987,d:'2h 30min',dir:'J. Prado',g:['#3C4A6B','#121722'],i:'9,0',r:98,a:95},
 {t:'Rua das Sombras',y:2020,d:'1h 59min',dir:'E. Lacerda',g:['#6B2A3F','#1D0B13'],i:'7,6',r:83,a:79}
];
const GEN=['Drama','Suspense','Ficção','Animação','Terror','Documentário'];
const DEC=['1980s','1990s','2000s','2010s','2020s'];
const TIPO=['Oficial','Alternativo','Festival','Colecionador'];

/* ===== AUXILIARES ===== */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const num=s=>parseFloat(String(s).replace(',','.'));
const fmt=n=>n.toFixed(1).replace('.',',');
const bg=f=>`linear-gradient(160deg,${f.g[0]},${f.g[1]})`;
const po=(f,x='')=>`<div class="po" style="background:${bg(f)};${x}"><span>${f.t}</span></div>`;
const dot=r=>`<i style="background:${r>=60?'var(--fresh)':'var(--rot)'}"></i>`;
const card=n=>{const f=F[n];return `<a class="card" href="#filme/${n}">${po(f)}<b>${f.t}</b><div class="bd"><span style="color:var(--imdb)">★ ${f.i}</span><span>${dot(f.r)}${f.r}%</span></div></a>`};
const chips=(a,sel=[])=>a.map(x=>`<button type="button" class="chip" aria-pressed="${sel.includes(x)}">${x}</button>`).join('');
let favs=[];try{favs=JSON.parse(localStorage.getItem('pf-favs')||'[]')}catch(e){}
const saveFavs=()=>{try{localStorage.setItem('pf-favs',JSON.stringify(favs))}catch(e){}};
const state={q:'',nota:7,tags:['Suspense','Alternativo']};

/* ===== MONTAGEM DAS TELAS ===== */
$('#mos').innerHTML=[0,1,2,3].map(c=>`<div style="margin-top:${[0,-80,-20,-100][c]}px">${[0,1,2,3].map(k=>po(F[(c*2+k)%8])).join('')}</div>`).join('');
$('#cats').innerHTML=chips(['Em alta','Clássicos','Festivais','Colecionador'],['Em alta']);
$('#feat').innerHTML=`<a href="#filme/4">${po(F[4])}</a><div><p class="lbl">Pôster em destaque</p><h2>${F[4].t}</h2>
<p class="lbl" style="margin-top:4px">${F[4].y} · ${F[4].d} · Dir. ${F[4].dir}</p>
<div class="rt"><div><div class="lbl">IMDb</div><div class="big2" style="color:var(--imdb)">★ ${F[4].i}</div></div><div><div class="lbl">Rotten Tomatoes</div><div class="big2">${dot(F[4].r)}${F[4].r}%</div></div></div>
<a class="btn" href="#filme/4" style="width:auto">Ver detalhes</a></div>`;
$('#r1').innerHTML=[0,1,2,3,5].map(card).join('');
$('#r2').innerHTML=[6,4,2,7].map(card).join('');
$('#rec').innerHTML=['Noite em Vermelho','Filmes de suspense','Eclipse'].map(x=>`<li><button type="button" data-q="${x}">${x}</button><button type="button" class="x" aria-label="Remover ${x}"><svg class="i" style="width:18px;height:18px"><use href="#x"/></svg></button></li>`).join('');
$('#gen').innerHTML=GEN.map(x=>`<button type="button" class="chip" data-tag="${x}">${x}</button>`).join('');
$('#fg1').innerHTML=chips(GEN);$('#fg2').innerHTML=chips(DEC);$('#fg3').innerHTML=chips(TIPO);

/* ===== DETALHES (A3) ===== */
function detalhe(n){
  const f=F[n],on=favs.includes(n);
  $('#det').innerHTML=`${po(f)}<div><h1>${f.t}</h1><p class="lbl" style="margin-top:4px">${f.y} · ${f.d} · Dir. ${f.dir}</p>
  <div class="rt"><div><div class="lbl">IMDb</div><div class="big2" style="color:var(--imdb)">★ ${f.i}<span class="lbl">/10</span></div></div>
  <div><div class="lbl">Rotten Tomatoes</div><div class="big2">${dot(f.r)}${f.r}%</div><div class="lbl">Público: ${f.a}%</div></div></div>
  <div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-t="0">Sinopse</button><button role="tab" aria-selected="false" data-t="1">Elenco</button><button role="tab" aria-selected="false" data-t="2">Curiosidades</button></div>
  <div class="tp" id="tp" data-n="${n}"></div>
  <div class="favbar"><button class="btn ${on?'sec':''}" id="fav" aria-pressed="${on}" data-n="${n}"><svg class="i"><use href="#heart"/></svg><span>${on?'Nos favoritos':'Adicionar aos favoritos'}</span></button></div></div>`;
  aba(0,n);
}
function aba(k,n){
  const f=F[n],p=$('#tp');
  if(k==0)p.innerHTML=`<p id="sy" class="clamp">Em uma cidade costeira, uma restauradora de cartazes encontra um pôster que nunca deveria ter existido e passa a investigar quem o desenhou. [Texto de exemplo]</p><button class="more" id="more">Ver mais</button>`;
  if(k==1)p.innerHTML=`<ul class="cast"><li><span>Helena Costa</span><span class="lbl">Protagonista</span></li><li><span>Rui Albuquerque</span><span class="lbl">Coadjuvante</span></li><li><span>Marta Veiga</span><span class="lbl">Coadjuvante</span></li><li><span>${f.dir}</span><span class="lbl">Direção</span></li></ul>`;
  if(k==2)p.innerHTML=`<p>Filmado em 35 mm, em apenas 31 dias. [Curiosidade de exemplo]</p>`;
  $$('.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t==k));
}

/* ===== BUSCA / FILTROS / RESULTADOS ===== */
const lista=()=>F.map((f,n)=>n).filter(n=>num(F[n].i)>=state.nota&&F[n].t.toLowerCase().includes(state.q.toLowerCase()));
function resultados(){
  const l=lista();
  $('#ac').innerHTML=state.tags.map(t=>`<button type="button" class="chip" aria-pressed="true" data-rm="${t}" aria-label="Remover filtro ${t}">${t}<svg class="i"><use href="#x"/></svg></button>`).join('')+`<span class="chip" style="background:none">Nota ≥ ${fmt(state.nota)}</span>`+(state.q?`<span class="chip" style="background:none">“${state.q}”</span>`:'');
  $('#cnt').textContent=l.length+(l.length==1?' resultado':' resultados');
  $('#rg').innerHTML=l.length?l.map(card).join(''):'<p class="lbl">Nenhum pôster encontrado. Tente reduzir a nota mínima.</p>';
}
function syncSheet(){
  $$('#fd .chip').forEach(c=>c.setAttribute('aria-pressed',state.tags.includes(c.textContent)));
  $('#nr').value=state.nota;$('#nv').textContent=fmt(state.nota);cntBtn();
}
function cntBtn(){const n=F.filter(f=>num(f.i)>=num($('#nr').value)&&f.t.toLowerCase().includes(state.q.toLowerCase())).length;$('#apply').textContent=`Aplicar (${n} resultados)`}
function favoritos(){
  $('#fg').innerHTML=favs.map(card).join('');$('#fempty').hidden=favs.length>0;
}

/* ===== ROTEADOR (hash) ===== */
const TIT={login:'Entrar',home:'Início',filme:'Detalhes',busca:'Busca',resultados:'Resultados',favoritos:'Favoritos'};
function rota(){
  let [r,arg]=location.hash.slice(1).split('/');
  if(!TIT[r])r='login';
  $$('.page').forEach(s=>s.hidden=s.id!='p-'+r);
  document.body.classList.toggle('auth',r=='login');
  $$('[data-nav]').forEach(a=>{const on=a.dataset.nav==r||(r=='resultados'&&a.dataset.nav=='busca')||(r=='filme'&&a.dataset.nav=='home');on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  if(r=='filme')detalhe(+arg>=0&&+arg<F.length?+arg:0);
  if(r=='resultados')resultados();
  if(r=='favoritos')favoritos();
  if(r=='login'){$('#em').value='';$('#pw').value='';msg('');chk()}
  document.title='Posterflix – '+TIT[r];
  window.scrollTo(0,0);
}
addEventListener('hashchange',rota);

/* ===== LOGIN ===== */
function msg(t){$('#er').hidden=!t;$('#ert').textContent=t;$('#pw').classList.toggle('bad',!!t)}
function chk(){$('#go').disabled=!($('#em').value&&$('#pw').value)}
['#em','#pw'].forEach(s=>$(s).addEventListener('input',()=>{chk();msg('')}));
$('#lf').addEventListener('submit',e=>{
  e.preventDefault();const em=$('#em').value.trim(),pw=$('#pw').value;
  if(!/^\S+@\S+\.\S+$/.test(em))return msg('Informe um e-mail válido, como nome@email.com.');
  if(pw.length<6)return msg('A senha precisa ter pelo menos 6 caracteres.');
  if(pw=='senhaerrada')return msg('E-mail ou senha incorretos. Confira os dados e tente novamente.');
  location.hash='#home';
});

/* ===== EVENTOS GERAIS ===== */
const dlg=$('#fd');
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.closest('#eye')){const p=$('#pw'),h=p.type=='password';p.type=h?'text':'password';$('#eye').setAttribute('aria-label',h?'Ocultar senha':'Mostrar senha');return}
  if(t.closest('[data-filters]')){syncSheet();dlg.showModal();return}
  if(t.closest('#fx')||t==dlg){dlg.close();return}
  if(t.closest('#clr')){$$('#fd .chip').forEach(c=>c.setAttribute('aria-pressed','false'));$('#nr').value=1;$('#nv').textContent='1,0';cntBtn();return}
  if(t.closest('#apply')){state.tags=$$('#fd .chip[aria-pressed=true]').map(c=>c.textContent);state.nota=num($('#nr').value);dlg.close();if(location.hash=='#resultados')resultados();else location.hash='#resultados';return}
  const c=t.closest('#fd .chip');if(c){c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')!='true');return}
  const cat=t.closest('#cats .chip');if(cat){$$('#cats .chip').forEach(x=>x.setAttribute('aria-pressed',x==cat));return}
  const rm=t.closest('[data-rm]');if(rm){state.tags=state.tags.filter(x=>x!=rm.dataset.rm);resultados();return}
  const g=t.closest('[data-tag]');if(g){state.tags=[g.dataset.tag];state.q='';location.hash='#resultados';return}
  const rq=t.closest('[data-q]');if(rq){state.q=rq.dataset.q;state.nota=1;location.hash='#resultados';return}
  const x=t.closest('.rec .x');if(x){x.parentElement.remove();return}
  const tab=t.closest('[data-t]');if(tab){aba(+tab.dataset.t,+$('#tp').dataset.n);return}
  if(t.closest('#more')){const y=$('#sy'),o=y.classList.toggle('clamp');$('#more').textContent=o?'Ver mais':'Ver menos';return}
  const fv=t.closest('#fav');if(fv){const n=+fv.dataset.n,on=!favs.includes(n);favs=on?[...favs,n]:favs.filter(x=>x!=n);saveFavs();fv.setAttribute('aria-pressed',on);fv.classList.toggle('sec',on);fv.querySelector('span').textContent=on?'Nos favoritos':'Adicionar aos favoritos'}
});
$('#nr').addEventListener('input',e=>{$('#nv').textContent=fmt(num(e.target.value));cntBtn()});
$('#sf').addEventListener('submit',e=>{e.preventDefault();state.q=$('#q').value.trim();state.nota=1;state.tags=[];location.hash='#resultados'});

rota();
