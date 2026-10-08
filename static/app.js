const palette = ["#176a55","#cf784e","#6676b4","#ad8e37","#8c5a86","#338ca0","#bc5960","#789546","#526a75","#d19953","#6660a5","#48826b"];
const bands = [
 {a:960,b:980,label:"Água",plotLabel:"Água · O–H",bond:"O–H",color:"#3b82f6",scope:"nir",anchor:970},
 {a:1180,b:1200,label:"Água",plotLabel:"Água · O–H",bond:"O–H",color:"#3b82f6",scope:"nir",anchor:970},
 {a:1430,b:1470,label:"Água",plotLabel:"Água · O–H",bond:"O–H",color:"#3b82f6",scope:"nir",anchor:970},
 {a:1920,b:1960,label:"Água",plotLabel:"Água · O–H",bond:"O–H",color:"#3b82f6",scope:"nir",anchor:970},
 {a:1200,b:1250,label:"Lipídios",plotLabel:"Lipídios · C–H",bond:"C–H",color:"#e99b48",scope:"nir",anchor:1720},
 {a:1700,b:1760,label:"Lipídios",plotLabel:"Lipídios · C–H",bond:"C–H",color:"#e99b48",scope:"nir",anchor:1720},
 {a:2300,b:2350,label:"Lipídios",plotLabel:"Lipídios · C–H",bond:"C–H",color:"#e99b48",scope:"nir",anchor:1720},
 {a:1560,b:1670,label:"Proteínas",plotLabel:"Proteínas · N–H/C–H",bond:"N–H / C–H",color:"#9672bc",scope:"nir",anchor:2100},
 {a:2050,b:2180,label:"Proteínas",plotLabel:"Proteínas · N–H/C–H",bond:"N–H / C–H",color:"#9672bc",scope:"nir",anchor:2100},
 {a:980,b:1010,label:"Amidos / açúcares",plotLabel:"Amidos/açúcares · O–H/C–O",bond:"O–H",color:"#55a878",scope:"nir",botanical:true,anchor:2100},
 {a:1180,b:1280,label:"Amidos / açúcares",plotLabel:"Amidos/açúcares · O–H/C–O",bond:"O–H / C–H",color:"#55a878",scope:"nir",botanical:true,anchor:2100},
 {a:1350,b:1500,label:"Amidos / açúcares",plotLabel:"Amidos/açúcares · O–H/C–O",bond:"O–H / C–O",color:"#55a878",scope:"nir",botanical:true,anchor:2100},
 {a:1560,b:1600,label:"Amidos / açúcares",plotLabel:"Amidos/açúcares · O–H/C–O",bond:"O–H",color:"#55a878",scope:"nir",botanical:true,anchor:2100},
 {a:2050,b:2160,label:"Amidos / açúcares",plotLabel:"Amidos/açúcares · O–H/C–O",bond:"O–H / C–O",color:"#55a878",scope:"nir",botanical:true,anchor:2100},
 {a:2250,b:2300,label:"Amidos / açúcares",plotLabel:"Amidos/açúcares · O–H/C–O",bond:"C–H / C–O",color:"#55a878",scope:"nir",botanical:true,anchor:2100},
 {a:1480,b:1510,label:"Fibras vegetais",plotLabel:"Fibras · celulose/hemicelulose/lignina",bond:"Celulose / hemicelulose",color:"#9b7653",scope:"nir",botanical:true,anchor:1800},
 {a:1760,b:1820,label:"Fibras vegetais",plotLabel:"Fibras · celulose/lignina",bond:"Celulose / lignina",color:"#9b7653",scope:"nir",botanical:true,anchor:1800},
 {a:2050,b:2160,label:"Fibras vegetais",plotLabel:"Fibras · celulose/hemicelulose/lignina",bond:"C–H / O–H",color:"#9b7653",scope:"nir",botanical:true,anchor:1800},
 {a:2250,b:2350,label:"Fibras vegetais",plotLabel:"Fibras · celulose/lignina",bond:"Celulose / lignina",color:"#9b7653",scope:"nir",botanical:true,anchor:1800},
];
const state = {catalog:null,sources:[],selected:new Set(),profiles:new Map(),unit:"",domain:""};
const $ = id => document.getElementById(id);
function esc(s){return String(s===null||s===undefined?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function fmt(n,d){return n===null||n===undefined||n===""?"—":Number.isFinite(Number(n))?Number(n).toLocaleString("pt-BR",{maximumFractionDigits:d||0}):"—";}
function key(d,s){return d.id+"::"+s.source_id;}
function label(x){return (x.dataset.short_name||x.dataset.name)+" · "+(x.short_name||x.name||x.source_id);}
function allSources(){return state.catalog.datasets.flatMap(d=>d.sources.map(s=>Object.assign({},s,{dataset:d,key:key(d,s)})));}
function setOptions(id,values,blank){const el=$(id),prior=el.value;el.innerHTML='<option value="">'+blank+'</option>'+values.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join("");if(values.includes(prior))el.value=prior;}
function init(){
 const c=state.catalog;
 c.datasets=c.datasets.map(d=>({...d,sources:d.sources.filter(s=>String(s.modality||"").trim().toUpperCase()==="NIR")})).filter(d=>d.sources.length);
 c.n_datasets=c.datasets.length;c.n_sources=c.datasets.reduce((n,d)=>n+d.sources.length,0);
 c.n_local_datasets=c.datasets.filter(d=>d.dataset_kind==="local").length;
 c.n_external_datasets=c.datasets.filter(d=>d.dataset_kind==="external").length;
 c.n_observations_total=c.datasets.reduce((n,d)=>n+d.sources.reduce((m,s)=>m+(Number(s.n_observations)||0),0),0);
 c.n_external_public_curves=c.datasets.reduce((n,d)=>n+(d.dataset_kind==="external"?d.sources.filter(s=>s.profile).length:0),0);
 $("heroStats").innerHTML=[[c.n_datasets,"datasets"],[fmt(c.n_observations_total),"observações"],[c.n_sources,"fontes"]].map(x=>'<div class="stat"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join("");
 $("buildLabel").textContent=c.n_local_datasets+" locais · "+c.n_external_datasets+" nirs4all · NIR";state.sources=allSources();
 setOptions("domainFilter",[...new Set(state.sources.map(x=>x.dataset.domain))].sort(),"Todos");
 setOptions("unitFilter",[...new Set(state.sources.map(x=>x.axis_unit))].sort(),"Todos os eixos");
 $("domainFilter").addEventListener("change",e=>{state.domain=e.target.value;renderSources();coverage();});
 $("unitFilter").addEventListener("change",e=>{const next=e.target.value;const active=[...state.selected].map(k=>state.sources.find(x=>x.key===k)).find(Boolean);if(active&&next&&active.axis_unit!==next)state.selected.clear();state.unit=next;renderSources();renderChart();coverage();});
 $("searchInput").addEventListener("input",renderSources);$("tableSearch").addEventListener("input",table);
 $("sdToggle").addEventListener("change",chart);$("bandToggle").addEventListener("change",chart);
 ["clearSelection","clearChartSelection"].forEach(id=>$(id).addEventListener("click",clearSelection));
 document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
 renderSources();table();coverage();
}
function clearSelection(){state.selected.clear();renderSources();renderChart();}
function switchView(v){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.view===v));$("compareView").classList.toggle("active",v==="compare");$("catalogView").classList.toggle("active",v==="catalog");}
function visibleSources(){const q=$("searchInput").value.trim().toLowerCase();return state.sources.filter(x=>{const t=[x.dataset.id,x.dataset.name,x.dataset.domain,x.instrument_name,x.source_id].join(" ").toLowerCase();return(!q||t.includes(q))&&(!state.domain||x.dataset.domain===state.domain)&&(!state.unit||x.axis_unit===state.unit);});}
function renderSources(){
 const items=visibleSources();
 $("sourceList").innerHTML=items.length?items.map(x=>'<label class="source-option '+(!x.profile?'unavailable':'')+'"><input type="checkbox" data-key="'+esc(x.key)+'" '+(state.selected.has(x.key)?"checked":"")+(!x.profile?' disabled':'')+'><span><span class="source-name">'+esc(label(x))+'</span><span class="source-sub">'+fmt(x.n_observations)+' obs · '+fmt(x.n_channels)+' canais · '+esc(x.axis_unit)+(x.instrument_name?" · "+esc(x.instrument_name):"")+'</span><span class="source-origin">'+(x.dataset.dataset_kind==="external"?"nirs4all · "+esc(x.dataset.application_group)+" · "+esc(x.dataset.tier)+(!x.profile?" · curva indisponível":" · perfil público") : (x.dataset.public_aggregate?"curva agregada do projeto":"dados locais do projeto"))+'</span></span><span class="source-tag">'+esc(x.dataset.domain)+'</span></label>').join(""):'<div class="empty-state">Nenhuma fonte NIR corresponde aos filtros.</div>';
 $("sourceList").querySelectorAll("input").forEach(b=>b.addEventListener("change",()=>toggle(b.dataset.key,b.checked)));
 $("selectionCount").textContent=state.selected.size+" selecionada"+(state.selected.size===1?"":"s");
}
async function toggle(k,on){
 if(on){
  if(state.selected.size>=12){alert("O comparador aceita até 12 curvas.");renderSources();return;}
  const cur=[...state.selected].map(v=>state.sources.find(x=>x.key===v)).find(Boolean),next=state.sources.find(x=>x.key===k);
  if(cur&&next&&cur.axis_unit!==next.axis_unit){alert("Eixos diferentes: "+cur.axis_unit+" e "+next.axis_unit+". Compare uma unidade por vez.");renderSources();return;}
  if(cur&&next&&cur.signal_type!==next.signal_type&&cur.signal_type!=="unknown"&&next.signal_type!=="unknown"){alert("Sinais com escalas diferentes: "+cur.signal_type+" e "+next.signal_type+". Compare separadamente.");renderSources();return;}
  if(cur&&next&&cur.modality!==next.modality&&cur.modality!=="unknown"&&next.modality!=="unknown"){alert("Modalidades diferentes: "+cur.modality+" e "+next.modality+". Compare separadamente.");renderSources();return;}
  state.selected.add(k);
  const src=state.sources.find(x=>x.key===k);
  if(!state.profiles.has(k)){try{const r=await fetch("./data/"+src.profile);if(!r.ok)throw Error(r.status);state.profiles.set(k,await r.json());}catch(e){state.selected.delete(k);alert("Perfil não encontrado em ./data/"+src.profile+" (HTTP "+(e.message||"erro de rede")+").");renderSources();return;}}
 }else state.selected.delete(k);
 renderSources();renderChart();
}
function renderChart(){if(!state.selected.size){$("chartNote").textContent="Selecione fontes para iniciar a comparação.";$("spectrumChart").innerHTML='<text x="50%" y="50%" text-anchor="middle" class="axis-text">As curvas médias aparecem aqui</text>';$("legend").innerHTML="";$("bandLegend").innerHTML="";$("profileInfo").innerHTML="";return;}const s=[...state.selected].map(k=>state.sources.find(x=>x.key===k)).filter(Boolean);$("chartNote").textContent=s.length+" perfil(is) · eixo "+s[0].axis_unit+" · sem interpolação entre canais";chart();}
function chart(){
 const selected=[...state.selected].map(k=>state.sources.find(x=>x.key===k)).filter(Boolean);if(!selected.length)return;
 const svg=$("spectrumChart"),W=Math.max(320,svg.clientWidth||800),H=370;
 let xmin=Infinity,xmax=-Infinity,ymin=Infinity,ymax=-Infinity;
 const series=selected.map((s,i)=>{const p=state.profiles.get(s.key);if(!p)return null;const pts=p.channels.map((x,j)=>({x:Number(x),y:p.mean[j]===null?NaN:Number(p.mean[j]),sd:p.sd&&p.sd[j]!==null?Number(p.sd[j]):0,lo:p.q05&&p.q05[j]!==null?Number(p.q05[j]):null,hi:p.q95&&p.q95[j]!==null?Number(p.q95[j]):null})).filter(x=>Number.isFinite(x.x)&&Number.isFinite(x.y));pts.forEach(x=>{xmin=Math.min(xmin,x.x);xmax=Math.max(xmax,x.x);ymin=Math.min(ymin,x.y);ymax=Math.max(ymax,x.y);if($("sdToggle").checked){ymin=Math.min(ymin,x.lo===null?x.y-x.sd:x.lo);ymax=Math.max(ymax,x.hi===null?x.y+x.sd:x.hi);}});return{s,p,pts,color:palette[i%palette.length]};}).filter(Boolean);
 if(!series.length||!Number.isFinite(ymin))return;if(xmin===xmax)xmax=xmin+1;if(ymin===ymax){ymin-=.5;ymax+=.5;}const pad=(ymax-ymin)*.08;ymin-=pad;ymax+=pad;
 const modalities=series.map(it=>String(it.p.modality)),hasNir=modalities.every(v=>/^NIR$/i.test(v));
 const botanical=series.every(it=>/\b(leaf|leaves|plant|vegetation|foliar|fruit|apple|mango|kiwi|wheat|maize|corn|cereal|grain|cucurbita|paprika|pepper|olive|grape|wine|tomato|tomatillo|cassava|sugarcane|potato|rice|cocoa|cacao|coffee|tea|crop|herb|bean|soybean)\b/i.test([it.s.dataset.id,it.s.dataset.name,it.s.dataset.domain].join(" ").replace(/[_-]+/g," ")));
 const bandCapable=series[0].p.axis_unit==="nm"&&(hasNir||hasVisible);
 const visibleBands=bandCapable&&$("bandToggle").checked?bands.filter(b=>b.scope==="nir"&&(!b.botanical||botanical)&&Math.min(b.b,xmax)>Math.max(b.a,xmin)):[];
 const groupNames=[...new Set(visibleBands.map(b=>b.label))];
 const m={l:58,r:18,t:groupNames.length?104:12,b:42},pw=W-m.l-m.r,ph=H-m.t-m.b;
 const X=x=>m.l+(x-xmin)/(xmax-xmin)*pw,Y=y=>m.t+(ymax-y)/(ymax-ymin)*ph;
 const bandColors=Object.fromEntries(bands.map(b=>[b.label,b.color]));
 $("bandLegend").innerHTML=groupNames.map(name=>{const group=visibleBands.filter(b=>b.label===name),ranges=[...new Set(group.map(b=>b.a+"–"+b.b))].join(", "),bonds=[...new Set(group.map(b=>b.bond))].join("; ");return'<span class="band-chip"><i style="background:'+bandColors[name]+'"></i><strong>'+name+'</strong><small>'+bonds+' · '+ranges+' nm</small></span>';}).join("");
 let out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none">';
 for(let i=0;i<=4;i++){const y=m.t+ph*i/4,val=ymax-(ymax-ymin)*i/4;out+='<line x1="'+m.l+'" y1="'+y+'" x2="'+(W-m.r)+'" y2="'+y+'" class="grid-line"/><text x="'+(m.l-9)+'" y="'+(y+3)+'" text-anchor="end" class="axis-text">'+fmt(val,3)+'</text>';}
 for(let i=0;i<=5;i++){const x=m.l+pw*i/5,val=xmin+(xmax-xmin)*i/5;out+='<line x1="'+x+'" y1="'+(m.t+ph)+'" x2="'+x+'" y2="'+(m.t+ph+4)+'" class="axis-line"/><text x="'+x+'" y="'+(H-13)+'" text-anchor="middle" class="axis-text">'+fmt(val,1)+'</text>';}
 out+='<line x1="'+m.l+'" y1="'+m.t+'" x2="'+m.l+'" y2="'+(m.t+ph)+'" class="axis-line"/><line x1="'+m.l+'" y1="'+(m.t+ph)+'" x2="'+(W-m.r)+'" y2="'+(m.t+ph)+'" class="axis-line"/><text x="'+(m.l+pw/2)+'" y="'+(H-1)+'" text-anchor="middle" class="axis-text">'+esc(series[0].p.axis_unit)+'</text>';
 visibleBands.forEach(b=>{const xa=X(Math.max(b.a,xmin)),xb=X(Math.min(b.b,xmax));out+='<rect x="'+xa+'" y="'+m.t+'" width="'+Math.max(1,xb-xa)+'" height="'+ph+'" fill="'+b.color+'" opacity="0.11"><title>'+b.label+' · '+b.bond+": "+b.a+"–"+b.b+' nm · banda aproximada</title></rect>';});
 if(groupNames.length){
  const lanes=Array.from({length:7},()=>[]),notes=groupNames.map(name=>{const group=visibleBands.filter(b=>b.label===name),anchor=group.reduce((best,b)=>Math.abs((b.a+b.b)/2-b.anchor)<Math.abs((best.a+best.b)/2-best.anchor)?b:best,group[0]),center=X((Math.max(anchor.a,xmin)+Math.min(anchor.b,xmax))/2),text=anchor.plotLabel,width=Math.min(W-m.l-m.r-4,Math.max(76,text.length*4.8+18));return{b:anchor,center,text,width};}).sort((a,b)=>a.center-b.center);
  notes.forEach(note=>{const x=Math.max(m.l,Math.min(W-m.r-note.width,note.center-note.width/2));let lane=lanes.findIndex(row=>row.every(item=>x+note.width+4<item.x||x>item.x+item.width+4));if(lane<0)lane=lanes.reduce((best,row,i)=>row.length<lanes[best].length?i:best,0);lanes[lane].push({x,width:note.width});const y=2+lane*14;
   out+='<line x1="'+note.center+'" y1="'+m.t+'" x2="'+(x+note.width/2)+'" y2="'+(y+12)+'" stroke="'+note.b.color+'" stroke-width="1" stroke-dasharray="2 2" opacity=".8"/>';
   out+='<rect x="'+x+'" y="'+y+'" width="'+note.width+'" height="12" rx="3" fill="#fff" fill-opacity=".96" stroke="'+note.b.color+'" stroke-width=".8"/><text x="'+(x+note.width/2)+'" y="'+(y+8.5)+'" text-anchor="middle" fill="'+note.b.color+'" font-size="8" font-family="sans-serif" font-weight="600">'+note.text+'</text>';
  });
 }
 series.forEach(it=>{const pts=it.pts;if(!pts.length)return;if($("sdToggle").checked){const upper=pts.map(p=>X(p.x)+","+Y(p.hi===null?p.y+p.sd:p.hi)).join(" "),lower=[...pts].reverse().map(p=>X(p.x)+","+Y(p.lo===null?p.y-p.sd:p.lo)).join(" ");out+='<polygon points="'+upper+" "+lower+'" class="sd-area" fill="'+it.color+'"/>';}const d=pts.map((p,i)=>(i?"L":"M")+X(p.x).toFixed(2)+","+Y(p.y).toFixed(2)).join(" ");out+='<path d="'+d+'" class="spectrum-line" stroke="'+it.color+'"><title>'+esc(label(it.s))+'</title></path>';});
 $("spectrumChart").innerHTML=out+"</svg>";
 $("legend").innerHTML=series.map(x=>'<span class="legend-item" data-key="'+esc(x.s.key)+'"><i class="legend-swatch" style="background:'+x.color+'"></i>'+esc(label(x.s))+'<span class="legend-x">×</span></span>').join("");
 $("legend").querySelectorAll(".legend-item").forEach(e=>e.addEventListener("click",()=>{state.selected.delete(e.dataset.key);renderSources();renderChart();}));
 $("profileInfo").innerHTML=series.map(x=>'<span class="metric-chip">'+esc(x.s.dataset.short_name||x.s.dataset.name)+' · '+(x.p.finite_pct===null?"cobertura não informada":fmt(x.p.finite_pct,2)+"% finitos")+' · '+fmt(x.p.n_observations)+' obs · '+(x.p.uncertainty==="quantile_05_95"?"faixa 5–95%":"±1 DP")+'</span>').join("");
}
function coverage(){
 const src=state.sources.filter(s=>(!state.unit||s.axis_unit===state.unit)&&(!state.domain||s.dataset.domain===state.domain)&&Number.isFinite(Number(s.axis_min))&&Number.isFinite(Number(s.axis_max))).slice(0,14);
 if(!src.length){$("coverageChart").innerHTML='<div class="empty-state">Selecione um eixo numérico para ver cobertura.</div>';return;}
 const min=Math.min(...src.map(s=>Number(s.axis_min))),max=Math.max(...src.map(s=>Number(s.axis_max)));
 $("coverageChart").innerHTML=src.map(s=>{const left=(Number(s.axis_min)-min)/(max-min||1)*100,width=(Number(s.axis_max)-Number(s.axis_min))/(max-min||1)*100;return'<div class="coverage-row"><span class="coverage-label" title="'+esc(s.dataset.name)+'">'+esc(s.dataset.name)+'</span><span class="coverage-track"><i class="coverage-bar" style="left:'+left+'%;width:'+width+'%"></i></span><span class="coverage-values">'+fmt(s.axis_min,1)+'–'+fmt(s.axis_max,1)+'</span></div>';}).join("");
}
function rangeText(src){const units=[...new Set(src.map(s=>s.axis_unit))];if(units.length!==1)return src.length+" fontes · eixos mistos";const vals=src.filter(s=>Number.isFinite(Number(s.axis_min))&&Number.isFinite(Number(s.axis_max)));return vals.length?fmt(Math.min(...vals.map(s=>Number(s.axis_min))),1)+"–"+fmt(Math.max(...vals.map(s=>Number(s.axis_max))),1)+" "+units[0]:src.length+" fontes";}
function table(){
 const q=$("tableSearch").value.trim().toLowerCase(),ds=state.catalog.datasets.filter(d=>[d.id,d.name,d.short_name,d.domain,d.application_group,(d.targets||[]).join(" "),d.license].join(" ").toLowerCase().includes(q));
 $("catalogRows").innerHTML=ds.map(d=>{const dims=d.sources.map(s=>fmt(s.n_observations)+"×"+fmt(s.n_channels)).join(" / "),access=d.public_aggregate?"agregado público":d.tier==="public"?"público":"restrito",origin=d.dataset_kind==="external"?"nirs4all":"local";return'<tr data-id="'+esc(d.id)+'"><td><button class="dataset-link" title="'+esc(d.name)+'">'+esc(d.short_name||d.name)+'</button><span class="source-sub">'+esc(d.id)+' · '+origin+'</span></td><td>'+esc(d.domain)+(d.spectro_family&&d.spectro_family!=="unknown"?'<span class="source-sub">'+esc(d.spectro_family)+'</span>':"")+'</td><td>'+dims+'<span class="source-sub">'+d.sources.length+' fonte(s)</span></td><td>'+esc(rangeText(d.sources))+'</td><td>'+((d.targets||[]).length?d.targets.map(t=>'<span class="target-item">'+esc(t)+'</span>').join(""):"—")+'</td><td>'+esc(d.processing_state||"catálogo externo")+'</td><td><span class="access-pill">'+access+'</span>'+(d.dataset_kind==="external"&&!d.has_public_curve?'<span class="source-sub">sem curva publicável</span>':"")+'</td></tr>';}).join("");
 $("tableFoot").textContent=ds.length+" de "+state.catalog.datasets.length+" datasets · sem linhas individuais";
 $("catalogRows").querySelectorAll("tr").forEach(row=>row.addEventListener("click",()=>detail(row.dataset.id)));
}
function detail(id){
 const d=state.catalog.datasets.find(x=>x.id===id);if(!d)return;const vars=(d.variables||[]).filter(v=>v.role==="target"),targets=vars.length?vars.map(v=>v.name):(d.targets||[]),warnings=(d.warnings||[]).slice(0,6);
 $("detailPanel").classList.remove("hidden");
 $("detailPanel").innerHTML='<div class="panel-head"><div><p class="eyebrow">FICHA DO DATASET</p><h2>'+esc(d.name)+'</h2></div><button class="text-button" id="closeDetail">fechar ×</button></div><p class="source-sub">'+esc(d.id)+' · '+esc(d.description||"")+'</p><div class="detail-grid">'+
 '<div class="detail-block"><span>Domínio</span><strong>'+esc(d.domain)+'</strong></div><div class="detail-block"><span>Alinhamento</span><strong>'+esc(d.alignment_level)+' · sample ID '+(d.sample_id_available?"disponível":"não confirmado")+'</strong></div><div class="detail-block"><span>Processamento</span><strong>'+esc(d.processing_state||"unknown")+'</strong></div><div class="detail-block"><span>Licença / tier</span><strong>'+esc(d.license)+' · '+esc(d.tier)+'</strong></div>'+
 '<div class="detail-block"><span>Alvos</span><strong>'+(targets.length?targets.map(t=>'<i class="target-item">'+esc(t)+'</i>').join(""):"Sem alvo declarado")+'</strong></div><div class="detail-block"><span>Splits originais</span><strong>'+(Object.keys(d.splits||{}).length?Object.entries(d.splits).map(x=>esc(x[0])+": "+fmt(x[1])).join(" · "):"Nenhum registrado")+'</strong></div><div class="detail-block"><span>Matrizes/fonte</span><strong>'+d.sources.map(s=>esc(s.source_id)+" "+fmt(s.n_observations)+"×"+fmt(s.n_channels)+" ("+esc(s.axis_unit)+")").join("<br>")+'</strong></div><div class="detail-block"><span>Cobertura finita</span><strong>'+d.sources.map(s=>esc(s.source_id)+": "+(s.finite_pct===null?"não informada":""+fmt(s.finite_pct,2)+"% canais finitos")).join("<br>")+'</strong></div></div>'+
 '<div class="origin-links"><b>Origem e referência</b><br>'+((d.origin_links||[]).map(u=>'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+esc(u)+'</a>').join("<br>")||"Link não estruturado no catálogo")+(d.citation?'<p>'+esc(d.citation)+'</p>':"")+'</div>'+
 '<div class="target-summaries"><b>Resumo dos alvos</b><div>'+vars.map(v=>'<span class="metric-chip">'+esc(v.name)+": "+(v.summary?("mediana "+fmt(v.summary.median,3)+" · faixa "+fmt(v.summary.min,3)+"–"+fmt(v.summary.max,3)):v.counts?Object.entries(v.counts).slice(0,5).map(x=>esc(x[0])+" "+fmt(x[1])).join(" · "):fmt(v.n_nonmissing)+" valores")+'</span>').join("")+'</div></div>'+
 warnings.map(w=>'<p class="warning">'+esc(w)+'</p>').join("");
 $("closeDetail").addEventListener("click",()=>$("detailPanel").classList.add("hidden"));
}
async function start(){try{const r=await fetch("./data/catalog.json");if(!r.ok)throw Error(r.status);state.catalog=await r.json();init();}catch(e){$("buildLabel").textContent="catálogo não compilado";$("sourceList").innerHTML='<div class="empty-state">Execute scripts/build_dashboard_data.py para gerar os agregados locais.</div>';$("heroStats").innerHTML='<div class="stat"><strong>—</strong><span>aguardando dados</span></div>';}}
window.addEventListener("resize",()=>{if(state.selected.size)chart();});start();
