/* Ứng dụng lịch trực: dữ liệu, xoay vòng, giao diện, quản trị. */
const PAL=['#f0a8a0','#f5c58b','#ead489','#a9d4a6','#8fd0c8','#9cc4ea','#bdb4ea','#eab0cf'];
const pad=n=>String(n).padStart(2,'0'),key=(y,m,d)=>y+'-'+pad(m+1)+'-'+pad(d),P=s=>s.split('-').map(Number);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),sn=n=>n.trim().split(/\s+/).pop();
const NOW=new Date();
/* Mã quản trị lưu dạng mã băm, không lưu nguyên văn. Đặt mã mặc định riêng: chạy pinHash('mã') trong Console rồi dán vào DEFAULT_PH. */
const pinHash=s=>{let a=0xdeadbeef,b=0x41c6ce57;const t='lt$'+s;for(let i=0;i<t.length;i++){const c=t.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);return(4294967296*(2097151&b)+(a>>>0)).toString(36)};
const DEFAULT_PH='t0w3otgevu';
const cloudOn=()=>{const c=window.FIREBASE_CONFIG;return !!(c&&c.apiKey&&c.projectId&&typeof firebase!=='undefined')};
let CLOUD=null,NET='on',SYNCED=!cloudOn();
let S={staff:['BS. Nguyễn Văn An','BS. Trần Thị Bình','ĐD. Lê Minh Châu','BS. Phạm Quốc Dũng','ĐD. Hoàng Thu Hà','KTV. Vũ Đức Hải'].map((n,i)=>({id:i,name:n})),nid:6,rot:[{from:key(NOW.getFullYear(),NOW.getMonth(),1),ids:[0,1,2,3,4,5],si:0}],sw:{},log:[],ph:DEFAULT_PH};
try{const x=JSON.parse(localStorage.getItem('lichtruc-kcb'));if(x&&x.staff)S=x}catch(e){}
const save=()=>{try{localStorage.setItem('lichtruc-kcb',JSON.stringify(S))}catch(e){}if(CLOUD&&ADM)CLOUD.push()};
if(S.pin!=null){S.ph=pinHash(String(S.pin));delete S.pin;save()}if(!S.ph)S.ph=DEFAULT_PH;
if(!S.rot){S.rot=[{from:S.start||key(NOW.getFullYear(),NOW.getMonth(),1),ids:S.staff.map(s=>s.id),si:S.si||0}];delete S.start;delete S.si;save()}
if(!S.ev)S.ev=[];
let V={y:NOW.getFullYear(),m:NOW.getMonth(),tab:'td',f:null,sel:[NOW.getFullYear(),NOW.getMonth(),NOW.getDate()]},ADM=false;
const byId=id=>S.staff.find(s=>s.id==id),col=p=>PAL[p.id%8];
/* Vòng trực chia theo giai đoạn S.rot=[{from,ids,si}]: từ ngày "from", người trực là ids[(si+số ngày kể từ from) mod n]. Đổi danh sách chỉ tạo giai đoạn mới nên không ảnh hưởng các ngày trước. */
function segAt(k){let g=S.rot[0];for(const s of S.rot)if(s.from<=k)g=s;return g}
function rotAt(y,m,d){const g=segAt(key(y,m,d));if(!g||!g.ids.length)return null;const a=P(g.from),n=g.ids.length,df=jdF(d,m+1,y)-jdF(a[2],a[1],a[0]);return byId(g.ids[(((g.si+df)%n)+n)%n])||null}
function duty(y,m,d){const k=key(y,m,d);if(S.sw[k]!=null){const p=byId(S.sw[k]);if(p)return p}return rotAt(y,m,d)}
const dutyK=k=>{const a=P(k);return duty(a[0],a[1]-1,a[2])};
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2200)}
function setSel(y,m,d){const t=new Date(y,m,d);V.sel=[t.getFullYear(),t.getMonth(),t.getDate()];V.y=V.sel[0];V.m=V.sel[1]}
const T=t=>{V.tab=t;render()},F=id=>{V.f=id;render()},D=n=>{setSel(V.sel[0],V.sel[1],V.sel[2]+n);render()},goT=()=>{const now=new Date();setSel(now.getFullYear(),now.getMonth(),now.getDate());V.tab='td';render()};
function M(d){V.m+=d;if(V.m<0){V.m=11;V.y--}if(V.m>11){V.m=0;V.y++}render()}
function pick(){$('#ov').innerHTML=`<div class="ov" onclick="if(event.target==this)CL()"><div class="sh"><h3>Chọn ngày</h3><input type="date" value="${key(...V.sel)}" onchange="const a=P(this.value);if(a[0]){setSel(a[0],a[1]-1,a[2]);V.tab='td';CL();render()}"><button class="btn" onclick="CL()">Đóng</button></div></div>`}
const hdr=()=>`<div class="top"><button class="pill" onclick="goT()">Hôm nay</button><b class="ttl">${CLOUD?`<i class="sd ${NET}" title="${NET=='on'?'Đang đồng bộ':'Ngoại tuyến'}"></i>`:''}Tháng ${V.m+1} - ${V.y}</b><button class="pill" onclick="pick()">Chọn ngày</button></div>`;
function nav(){const l=lunar(15,V.m+1,V.y);return `<div class="nav"><button class="ib" onclick="M(-1)">‹</button><h2>Tháng ${V.m+1}, ${V.y}<small>Năm ${yc(l[2])}</small></h2><button class="ib" onclick="M(1)">›</button></div>`}
function chips(){return `<div class="chips"><button class="chip ${V.f==null?'on':''}" onclick="F(null)">Tất cả</button>`+cur().map(byId).map(p=>`<button class="chip ${V.f===p.id?'on':''}" onclick="F(${p.id})">${esc(sn(p.name))}</button>`).join('')+'</div>'}
function themeArtwork(theme, season) {
  const artwork = `<img class="theme-art" src="${ART_ROOT + theme.art}" data-fallback="${ART_ROOT + season.art}" alt="" aria-hidden="true" decoding="async" fetchpriority="high">`;
  const companion = theme.companion
    ? `<img class="theme-companion" src="${ART_ROOT + theme.companion}" data-fallback="${ART_ROOT + theme.companion}" alt="" aria-hidden="true" decoding="async">`
    : '';
  const supporting = [['symbol',theme.symbol],['detail',theme.detail]]
    .filter(([,path]) => path)
    .map(([type,path]) => `<img class="theme-${type}" src="${ART_ROOT + path}" data-fallback="${ART_ROOT + path}" alt="" aria-hidden="true" decoding="async">`).join('');
  return artwork + companion + supporting;
}

function tdV() {
  const [y,m,d] = V.sel;
  const {theme,season,lunarDay:l,solarTerm,events,exact,lunarNewYear} = visualsOn(d,m+1,y);
  const k = key(y,m,d), p = duty(y,m,d), weekday = new Date(y,m,d).getDay();
  const c = cd(d,m+1,y), hd = isHD(l[1],c[1]);
  const mc = [(l[2]*12+l[1]+3)%10,(l[1]+1)%12], st = (8+2*(c[1]%6))%12;
  const seasonal = theme === season;
  const title = seasonal ? (solarTerm ? 'Tiết ' + solarTerm[0] : '') : theme.title || theme.name;
  const mainIcon = seasonal ? (solarTerm ? 'solar-'+solarTerm[1] : '') : iconForTheme(theme);
  const moreEvents = events.filter(event => event !== exact);
  const secondaryTerm = !seasonal && solarTerm ? `<span>${EventIcon('solar-'+solarTerm[1])} Tiết ${esc(solarTerm[0])}</span>` : '';
  const caption = exact?.leave ? LEAVE_LABELS[exact.leave] : (theme.period ? '1–7 tháng 8' : '');
  const zodiac = theme.id === 'tet'
    ? `<p class="zodiac">${EventIcon(ZODIAC_ASSETS[(lunarNewYear+8)%12])} Năm ${yc(lunarNewYear)}</p>`
    : '';
  return `<section class="paper visual-paper visual-21 ${seasonal?'':'celebration'}"
      data-theme="${theme.id}" data-layout="${theme.layout}" style="--theme-paper:${theme.paper};--theme-ink:${theme.ink};--theme-disc:${theme.disc}" aria-label="Lịch ngày">
    ${themeArtwork(theme,season)}
    <div class="sunw">
      <button class="ar" onclick="D(-1)" aria-label="Ngày trước">‹</button>
      <div class="sunc"><div class="num">${d}</div></div>
      <button class="ar" onclick="D(1)" aria-label="Ngày sau">›</button>
    </div>
    <div class="wd">${WD[weekday]}</div>
    ${title ? `<div class="day-occasion">${EventIcon(mainIcon)}<h1>${esc(title)}</h1></div>` : ''}
    ${caption ? `<p class="leave-note">${esc(caption)}</p>` : ''}
    ${zodiac}
    <p class="greeting">${esc(greetingFor(theme,weekday,exact?.leave === 'paid'))}</p>
    ${theme.id === 'thaythuoc' && exact ? '<p class="greeting-detail">Kính chúc các đồng nghiệp luôn mạnh khỏe, hạnh phúc và vững bước trên hành trình chăm sóc sức khỏe nhân dân.</p>' : ''}
    ${moreEvents.length || secondaryTerm ? `<div class="day-additional">${moreEvents.map(event => `<span>${EventIcon(iconForTheme(event.theme))} ${esc(event.name)}${event.leave ? ' · ' + esc(LEAVE_LABELS[event.leave]) : ''}</span>`).join('')}${secondaryTerm}</div>` : ''}
    <div class="duty">
      <span class="duty-label">${EventIcon('stethoscope')} Người trực</span>
      <b style="--duty-color:${p?col(p):'#e9e4d7'}">${p?esc(p.name):'Chưa xếp lịch'}</b>
    </div>
    <button class="more" onclick="openDay('${k}')">Xem chi tiết <span aria-hidden="true">›</span></button>
  </section>
  <div class="i3">
    <div><h4>GIỜ</h4><b id="gh"></b><div class="clk" id="clk"></div><div class="tiny">${HD.map(o=>CHI[(st+o)%12]).join(', ')}</div></div>
    <div><div class="ld">${l[0]}</div><h4 class="lunar-month">THÁNG ${l[1]}${l[3]?' NHUẬN':''}</h4><div class="hd2 ${hd?'':'bad'}">● Ngày ${hd?'Hoàng':'Hắc'} Đạo</div></div>
    <div><h4>ÂM LỊCH</h4><b>Năm ${yc(l[2])}</b><b>Tháng ${CAN[mc[0]]} ${CHI[mc[1]]}</b><b>Ngày ${CAN[c[0]]} ${CHI[c[1]]}</b></div>
  </div>`;
}
function tick(){const e=$('#clk');if(!e)return;const n=new Date();e.textContent=pad(n.getHours())+':'+pad(n.getMinutes());$('#gh').textContent='Giờ '+CHI[INT((n.getHours()+1)/2)%12]}
setInterval(tick,20000);
function calV(){const y=V.y,m=V.m,fd=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),now=new Date(),ty=now.getFullYear(),tm=now.getMonth(),td=now.getDate();
let h=`<div class="card">${nav()}${chips()}<div class="g">`+['T2','T3','T4','T5','T6','T7','CN'].map((x,i)=>`<div class="w ${i==6?'cn':''}">${x}</div>`).join('');
for(let i=0;i<fd;i++)h+='<div class="c e"></div>';
for(let d=1;d<=dim;d++){const l=lunar(d,m+1,y),hs=hol(d,m+1,y),off=hs.some(x=>x[1]),otherOff=hs.some(x=>x[1]&&x[2]!=='paid')&&!hs.some(x=>x[2]==='paid'),p=duty(y,m,d),wd=(fd+d-1)%7,isT=y==ty&&m==tm&&d==td;
h+=`<button class="c ${wd==6?'cn':''} ${off?(otherOff?'other-off':'off'):''} ${isT?'td':''} ${V.f!=null&&p&&p.id!==V.f?'dm':''}" onclick="openDay('${key(y,m,d)}')"><span class="d">${d}</span><span class="l ${l[0]===1||l[0]===15?'lunar-key':''}">${l[0]==1?l[0]+'/'+l[1]:l[0]}</span>${hs.length?`<i class="${off?(otherOff?'other':''):'s'}"></i>`:''}${S.ev.some(e=>e.d===key(y,m,d))?'<i class="e2"></i>':''}${p?`<span class="n" style="background:${col(p)}">${esc(sn(p.name))}</span>`:''}</button>`}
return h+`</div><div class="lg"><span>Nghỉ lễ</span><span class="other">Nghỉ bù, hoán đổi</span><span class="s">Kỷ niệm, lễ truyền thống</span></div></div>`}
/* Ngày lễ, ngày y tế, âm lịch, tiết khí và các hoạt động của khoa. */
const EK = {
  hop:['Họp','handshake','#4a90d9'], tiem:['Tiêm chủng','syringe','#2fae72'],
  khamsl:['Khám sàng lọc','stethoscope','#e9953a'], taphuan:['Tập huấn','books','#8d79d6'],
  nghiphep:['Nghỉ phép','national-park','#658289'], sinhnhat:['Sinh nhật','wrapped-gift','#b46693'],
  lichtruc:['Lịch trực','stethoscope','#28766b'], khac:['Khác','memo','#8a8f98']
};

function evts(d,m,y) {
  const k = key(y,m-1,d);
  const {events,lunarDay:l,solarTerm} = visualsOn(d,m,y);
  const r = events.map(({theme,name,leave}) => ({
    n:name, k:leave ? 'le' : theme.kind, i:iconForTheme(theme), leave, period:theme.period ? theme.id : null
  }));
  if (l[0] === 1 || l[0] === 15) {
    r.push({n:(l[0]===1?'Mùng 1':'Rằm')+' tháng '+l[1]+(l[3]?' nhuận':'')+' âm lịch',
      k:'am',i:l[0]===1?'crescent-moon':'full-moon'});
  }
  if (solarTerm) r.push({n:'Tiết '+solarTerm[0],k:'tk',i:'solar-'+solarTerm[1]});
  S.ev.filter(e=>e.d===k).sort((a,b)=>(a.h||'').localeCompare(b.h||'')).forEach(e=>{
    const c=EK[e.k]||EK.khac;
    r.push({n:e.t,k:'ev',i:c[1],c:c[2],h:e.h,p:e.p,tp:c[0]});
  });
  return r;
}

const EF=[['all','Tất cả'],['le','Lễ'],['khoa','Của khoa'],['yt','Y tế'],['am','Âm lịch, tiết khí']];
const EG={le:['le','kn'],khoa:['ev'],yt:['yt'],am:['am','tk']};
const KT={le:['Nghỉ lễ','var(--red)'],kn:['Kỷ niệm','var(--or)'],yt:['Y tế','var(--pri)'],am:['Âm lịch','#62758b'],tk:['Tiết khí','#267a73']};
const EW=['CN','T2','T3','T4','T5','T6','T7'];
function nextEv(){
  const now = new Date(), events = [], periods = new Set();
  for(let q=0;q<180 && events.length<4;q++){
    const dt = new Date(now.getFullYear(),now.getMonth(),now.getDate()+q);
    for (const e of evts(dt.getDate(),dt.getMonth()+1,dt.getFullYear())) {
      if (events.length===4) break;
      if (!['le','kn','yt','ev'].includes(e.k) || periods.has(e.period)) continue;
      if (e.period) periods.add(e.period);
      events.push({...e,dt,q});
    }
  }
  return events;
}
function supV(){
  const [f,...rest] = nextEv();
  if (!f) return '';
  const date = e => e.dt.getDate()+'/'+(e.dt.getMonth()+1);
  return `<div class="sup">
    <small>Sắp tới</small>
    <div class="cd">${f.q?f.q+'<span>ngày nữa</span>':'Hôm nay'}</div>
    <h2>${EventIcon(f.i)} ${esc(f.n)}</h2>
    <small>${WD[f.dt.getDay()]}, ${date(f)}/${f.dt.getFullYear()}${f.h?' · '+esc(f.h):''}${f.p?' · '+esc(f.p):''}</small>
    ${rest.length?`<div class="nx">${rest.map(e=>`<div>${EventIcon(e.i)} ${esc(e.n)} · ${date(e)} · ${e.q?'còn '+e.q+' ngày':'hôm nay'}</div>`).join('')}</div>`:''}
  </div>`;
}
function evV(){
  const ef = V.ef||'all', dim = new Date(V.y,V.m+1,0).getDate(), now = new Date();
  let rows='';
  for(let d=1;d<=dim;d++){
    const L = evts(d,V.m+1,V.y).filter(e=>ef==='all'||EG[ef].includes(e.k));
    if(!L.length)continue;
    const isN = V.y===now.getFullYear() && V.m===now.getMonth() && d===now.getDate();
    const k = key(V.y,V.m,d);
    rows+=`<div class="tr" role="button" tabindex="0" aria-label="Xem ngày ${d}/${V.m+1}" onclick="openDay('${k}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDay('${k}')}">
      <div class="tdt ${isN?'now':''}"><b>${d}</b><span>${EW[new Date(V.y,V.m,d).getDay()]}</span></div>
      <div class="tc">${L.map(e=>{
        const [label,color] = KT[e.k]||[e.tp,e.c];
        const tag = e.leave && e.leave!=='paid' ? LEAVE_LABELS[e.leave] : label;
        return `<div class="ti" style="--c:${color}"><span class="ic">${EventIcon(e.i)}</span><div class="nm">${esc(e.n)}${e.h||e.p?`<small>${[e.h,e.p].filter(Boolean).map(esc).join(' · ')}</small>`:''}</div><span class="tg">${esc(tag)}</span></div>`;
      }).join('')}</div>
    </div>`;
  }
  return `<div class="evw">${supV()}<div class="card">${nav()}<div class="chips">${EF.map(f=>`<button class="chip ${ef===f[0]?'on':''}" onclick="V.ef='${f[0]}';render()">${f[1]}</button>`).join('')}</div>
    ${rows?`<div class="tl">${rows}</div>`:`<div class="empty">${EventIcon('memo')}<h3>Tháng này chưa có mục nào</h3></div>`}</div></div>`;
}
function addEv(){const t=$('#et').value.trim(),d=$('#ed').value;if(!t||!d)return toast('Nhập tên hoạt động và ngày');S.ev.push({id:Date.now(),t,d,h:$('#eh').value,p:$('#ep').value.trim(),k:$('#ek').value});save();render();toast('Đã thêm hoạt động')}
function delEv(id){S.ev=S.ev.filter(e=>e.id!==id);save();render()}
const evCard=()=>`<div class="card"><h3>Hoạt động của khoa</h3><p class="mut sm">Họp giao ban, tiêm chủng, khám sàng lọc, tập huấn... hiển thị cho mọi người ở tab Sự kiện.</p><input id="et" placeholder="Tên hoạt động"><input type="date" id="ed" value="${tk()}"><input type="time" id="eh"><input id="ep" placeholder="Địa điểm (không bắt buộc)"><select id="ek">${Object.keys(EK).map(k=>`<option value="${k}">${EK[k][0]}</option>`).join('')}</select><button class="btn" onclick="addEv()">Thêm hoạt động</button>`+S.ev.slice().sort((x,y)=>x.d<y.d?-1:1).filter(e=>e.d>=tk()).slice(0,20).map(e=>`<div class="row"><div class="grow sm"><b>${esc(e.t)}</b><div class="mut">${fmt(e.d)}${e.h?' · '+e.h:''}${e.p?' · '+esc(e.p):''}</div></div><button class="sbtn" onclick="delEv(${e.id})">✕</button></div>`).join('')+'</div>';
function openDay(k) {
  const [y,m,d]=P(k);
  const dt=new Date(y,m-1,d);
  const l=lunar(d,m,y);
  const p=dutyK(k);
  const events=evts(d,m,y);
  const artTheme=visualsOn(d,m,y).theme;
  const nearby=[[-1,'Ca trước'],[1,'Ca sau']].map(([offset,label])=>{
    const date=new Date(y,m-1,d+offset);
    const day=date.getDate(),month=date.getMonth();
    const dayKey=key(date.getFullYear(),month,day);
    const staff=dutyK(dayKey);
    return `<button class="shift-neighbor" type="button" onclick="openDay('${dayKey}')">
      <span><small>${label}</small><strong>${day}/${month+1} · ${staff?esc(staff.name):'Chưa có người trực'}</strong></span>
      <span class="shift-chevron" aria-hidden="true">›</span>
    </button>`;
  }).join('');

  const actions=ADM?`<section class="shift-admin" aria-labelledby="shift-admin-title">
    <h4 id="shift-admin-title">Quản lý ca</h4>
    <label class="sm mut" for="sd">Đổi trực với ngày</label>
    <input type="date" id="sd">
    <button class="btn o" onclick="swap('${k}')">Hoán đổi hai ngày trực</button>
    <label class="sm mut" for="sp">Chỉ định người khác trực</label>
    <select id="sp">${cur().map(byId).map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select>
    <button class="btn o" onclick="assign('${k}')">Chỉ định</button>
  </section>`:'';

  $('#ov').innerHTML=`<div class="ov" onclick="if(event.target===this)CL()">
    <div class="sh shift-sheet" role="dialog" aria-modal="true" aria-labelledby="shift-title" onkeydown="if(event.key==='Escape')CL()">
      <div class="shift-heading">
        <h3 id="shift-title">Chi tiết ca trực</h3>
        <button class="shift-close" id="shift-close" type="button" aria-label="Đóng chi tiết ca trực" onclick="CL()">×</button>
      </div>
      <div>
        <p class="shift-date">${WD[dt.getDay()]}, ${d}/${m}/${y}</p>
        <div class="sm mut">Âm lịch ${l[0]}/${l[1]}${l[3]?' (nhuận)':''} · ${yc(l[2])}</div>
      </div>
      <div class="shift-duty">
        ${EventIcon('stethoscope')}
        <div class="grow">
          <div class="sm mut">Người trực</div>
          ${p?`<strong class="shift-name" style="background:${col(p)}">${esc(p.name)}</strong>`:'<strong>Chưa có người trực</strong>'}
          ${S.sw[k]!=null?'<span class="tag">Đã đổi ca</span>':''}
        </div>
      </div>
      <section aria-labelledby="shift-nearby-title">
        <h4 id="shift-nearby-title">Ca liền kề</h4>
        <div class="shift-neighbors">${nearby}</div>
      </section>
      ${events.length?`<section aria-labelledby="shift-events-title"><h4 id="shift-events-title">Sự kiện trong ngày</h4>
        <ul class="shift-events">${events.map(e=>`<li>${EventIcon(e.i)}<span>${[e.n,e.leave&&LEAVE_LABELS[e.leave],e.h,e.p].filter(Boolean).map(esc).join(' · ')}</span></li>`).join('')}</ul>
      </section>`:''}
      ${actions}
      ${artTheme.source==='heritage'?'<a class="day-credits sm" href="ASSET_SOURCES.md">Nguồn minh họa</a>':''}
      ${V.tab==='td'&&key(...V.sel)===k?'':`<button class="btn o" onclick="setSel(${y},${m-1},${d});V.tab='td';CL();render()">Xem trang ngày</button>`}
      <button class="btn" type="button" onclick="CL()">Đóng</button>
    </div>
  </div>`;
  $('#shift-close').focus();
}
const CL=()=>$('#ov').innerHTML='';
function swap(a){const b=$('#sd').value;if(!b||b==a)return toast('Hãy chọn ngày khác để đổi');const pa=dutyK(a),pb=dutyK(b);if(!pa||!pb)return;S.sw[a]=pb.id;S.sw[b]=pa.id;S.log.unshift({t:a+' ⇄ '+b,x:pa.name+' ⇄ '+pb.name});S.log=S.log.slice(0,30);save();CL();render();toast('Đã đổi lịch trực')}
function assign(a){const id=+$('#sp').value;S.sw[a]=id;S.log.unshift({t:a,x:'Chỉ định: '+byId(id).name});S.log=S.log.slice(0,30);save();CL();render();toast('Đã cập nhật')}
function stV(){const dim=new Date(V.y,V.m+1,0).getDate(),cnt={},mine=[];S.staff.forEach(s=>cnt[s.id]=0);for(let d=1;d<=dim;d++){const p=duty(V.y,V.m,d);if(p){cnt[p.id]++;if(p.id===V.f)mine.push(d)}}
const mx=Math.max(1,...Object.values(cnt));let h=`<div class="card">${nav()}${chips()}`;
if(V.f!=null){const p=byId(V.f);h+=`<h3>${esc(p.name)} · ${mine.length} ca trong tháng</h3>`+(mine.map(d=>{const l=lunar(d,V.m+1,V.y),hs=hol(d,V.m+1,V.y);return `<div class="row"><b style="width:30px">${d}</b><div class="grow">${WD[new Date(V.y,V.m,d).getDay()]}<div class="sm mut">Âm ${l[0]}/${l[1]}</div></div>${hs.length?`<span class="tag">${esc(hs[0][0])}</span>`:''}</div>`}).join('')||'<div class="mut sm">Không có ca trực trong tháng này.</div>')}
else h+='<h3>Số ca trực trong tháng</h3>'+S.staff.filter(s=>cnt[s.id]||cur().includes(s.id)).map(s=>`<div class="row" onclick="F(${s.id})"><span class="dot" style="background:${col(s)}"></span><div class="grow">${esc(s.name)}<div class="bar"><b style="width:${cnt[s.id]/mx*100}%;background:${col(s)}"></b></div></div><b>${cnt[s.id]}</b></div>`).join('');
return h+'</div>'}
function login(){if(CLOUD)return CLOUD.login($('#em').value.trim(),$('#pin').value);if(pinHash($('#pin').value)===S.ph){ADM=true;render();toast(S.ph===DEFAULT_PH?'Đang dùng mã mặc định, hãy đổi mã ngay':'Đã đăng nhập quản trị')}else toast('Sai mã quản trị')}
const cur=()=>S.rot[S.rot.length-1].ids,listAt=k=>segAt(k).ids,fmt=k=>{const a=P(k);return a[2]+'/'+a[1]+'/'+a[0]};
const tk=()=>{const n=new Date();return key(n.getFullYear(),n.getMonth(),n.getDate())},effD=()=>V.eff||tk();
const baseAt=k=>{const a=P(k),p=rotAt(a[0],a[1]-1,a[2]);return p?p.id:null},bIdx=(ids,b)=>Math.max(0,ids.indexOf(b));
/* Mọi thao tác lấy danh sách đang hiển thị (cur) làm gốc và áp dụng từ ngày đã chọn (V.eff, được giữ nguyên sau mỗi lần vẽ lại) */
function setSeg(k,ids,si,msg){S.rot=S.rot.filter(s=>s.from<k);S.rot.push({from:k,ids,si});S.log.unshift({t:'Từ '+fmt(k),x:msg});S.log=S.log.slice(0,30);save();render()}
function mv(id,d){const k=effD(),ids=cur().slice(),i=ids.indexOf(id),j=i+d;if(i<0||j<0||j>=ids.length)return;const b=baseAt(k);[ids[i],ids[j]]=[ids[j],ids[i]];setSeg(k,ids,bIdx(ids,b),'Đổi thứ tự: '+byId(id).name);toast('Đã đổi thứ tự từ '+fmt(k))}
function del(id){const k=effD(),old=cur(),ids=old.filter(x=>x!==id);if(old.length==ids.length)return;if(!ids.length)return toast('Cần ít nhất 1 cán bộ');const b=baseAt(k);setSeg(k,ids,b===id?old.indexOf(id)%ids.length:bIdx(ids,b),'Ngừng trực: '+byId(id).name);toast(byId(id).name+' ngừng trực từ '+fmt(k))}
function add(){const n=$('#nn').value.trim(),k=effD();if(!n)return toast('Nhập họ tên cán bộ');const b=baseAt(k),ids=cur().slice(),id=S.nid++;S.staff.push({id,name:n});ids.push(id);setSeg(k,ids,$('#nw').value==='1'?ids.length-1:bIdx(ids,b),'Thêm cán bộ: '+n);toast('Đã thêm, vào trực từ '+fmt(k))}
function apply(){const k=effD(),ids=cur().slice(),si=ids.indexOf(+$('#si').value);if(si<0)return toast('Chọn người trực đầu tiên');setSeg(k,ids,si,'Xếp lại vòng, đầu tiên: '+byId(ids[si]).name);toast('Đã xếp lại vòng trực từ '+fmt(k))}
function showStaffNameForm(id, editing) {
  if (!ADM) return;
  const staff = byId(id);
  const form = $('#staff-name-form-'+id);
  if (!staff || !form) return;
  const button = $('#staff-name-edit-'+id);
  form.hidden = !editing;
  button.setAttribute('aria-expanded', String(editing));
  if (editing) {
    const input = form.elements.staffName;
    input.value = staff.name;
    input.focus();
    input.select();
  } else {
    button.focus();
  }
}

function renameStaff(id, value) {
  if (!ADM) return;
  const staff = byId(id);
  if (!staff || !cur().some(memberId => String(memberId) === String(staff.id))) return toast('Cán bộ không còn trong vòng trực');
  const name = value.trim();
  if (!name) return toast('Nhập họ tên cán bộ');
  if (name === staff.name) return showStaffNameForm(id, false);

  staff.name = name;
  save();
  render();
  $('#staff-name-edit-'+id).focus();
  toast('Đã cập nhật tên cán bộ');
}

function staffEntry(id, index) {
  const staff = byId(id);
  return `<div class="staff-entry">
    <div class="row">
      <span class="dot" style="background:${col(staff)}"></span>
      <div class="grow staff-entry-name">${index+1}. ${esc(staff.name)}</div>
      <div class="staff-entry-actions">
        <button class="sbtn" type="button" id="staff-name-edit-${id}" aria-expanded="false" aria-controls="staff-name-form-${id}" onclick="showStaffNameForm(${id},this.getAttribute('aria-expanded')!=='true')">Sửa tên</button>
        <button class="sbtn" type="button" aria-label="Chuyển lên" onclick="mv(${id},-1)">▲</button>
        <button class="sbtn" type="button" aria-label="Chuyển xuống" onclick="mv(${id},1)">▼</button>
        <button class="sbtn" type="button" aria-label="Ngừng trực" onclick="del(${id})">✕</button>
      </div>
    </div>
    <form id="staff-name-form-${id}" class="staff-name-form" hidden onsubmit="event.preventDefault();renameStaff(${id},this.elements.staffName.value)">
      <label class="sm" for="staff-name-${id}">Họ tên cán bộ</label>
      <input type="text" id="staff-name-${id}" name="staffName" required>
      <div class="staff-entry-actions">
        <button class="sbtn" type="submit">Lưu tên</button>
        <button class="sbtn" type="button" onclick="showStaffNameForm(${id},false)">Hủy</button>
      </div>
    </form>
  </div>`;
}

function adV(){if(!ADM)return `<div class="card"><h3>🔒 Đăng nhập quản trị</h3><p class="mut sm">Cán bộ khác chỉ xem lịch. Nhập mã quản trị để xếp lịch, đổi lịch, chỉnh danh sách.</p>${CLOUD?'<input id="em" type="email" autocomplete="username" placeholder="Email quản trị">':''}<input id="pin" type="password" ${CLOUD?'autocomplete="current-password" placeholder="Mật khẩu"':'inputmode="numeric" autocomplete="off" placeholder="Mã quản trị"'} onkeydown="if(event.key==='Enter')login()"><button class="btn" onclick="login()">Đăng nhập</button></div>`;
return `<div class="card"><h3>Ngày áp dụng thay đổi</h3><p class="mut sm">Thêm, ngừng trực, đổi thứ tự và xếp lại vòng áp dụng từ ngày này. Tên đã sửa hiển thị ngay trên mọi ca của cán bộ.</p><input type="date" id="eff" value="${effD()}" onchange="V.eff=this.value"></div>
<div class="card"><h3>Danh sách cán bộ trong vòng trực</h3><p class="mut sm">Giai đoạn hiện tại áp dụng từ ${fmt(S.rot[S.rot.length-1].from)}, theo thứ tự xoay vòng.</p>`+cur().map(staffEntry).join('')+`<div class="sm mut" style="margin-top:10px">Thêm cán bộ mới (vào trực từ ngày áp dụng)</div><input id="nn" placeholder="Họ tên cán bộ mới"><select id="nw"><option value="1">Trực ngay từ ngày áp dụng</option><option value="0">Nối tiếp vòng, đến lượt mới trực</option></select><button class="btn o" onclick="add()">Thêm cán bộ</button></div>
<div class="card"><h3>Xếp lại vòng trực</h3><p class="mut sm">Chọn người trực đầu tiên, vòng xoay tiếp tục từ ngày áp dụng.</p><select id="si">${cur().map(id=>`<option value="${id}">${esc(byId(id).name)}</option>`).join('')}</select><button class="btn" onclick="apply()">Áp dụng từ ngày đã chọn</button><button class="btn o" style="margin-top:8px" onclick="S.sw={};save();render();toast('Đã xóa các thay đổi')">Xóa mọi lần đổi lịch</button></div>
${evCard()}
${CLOUD?`<div class="card"><h3>Tài khoản quản trị</h3><p class="mut sm">${esc(CLOUD.who())}</p><button class="btn" onclick="CLOUD.logout()">Đăng xuất</button></div>`:''}<div class="card" ${CLOUD?'hidden':''}><h3>Mã quản trị</h3><input id="np" type="password" inputmode="numeric" placeholder="Mã mới (tối thiểu 4 số)"><button class="btn o" onclick="const v=$('#np').value;if(v.length<4)return toast('Mã quá ngắn');S.ph=pinHash(v);save();toast('Đã đổi mã')">Đổi mã</button><button class="btn" style="margin-top:8px" onclick="ADM=false;render()">Đăng xuất</button></div>`}
const waitV=()=>`<div class="card" style="text-align:center"><h3>${V.empty?'Chưa có lịch trực':'Đang tải lịch trực…'}</h3><p class="mut sm">${V.empty?'Quản trị viên cần đăng nhập (tab Quản trị) để tạo lịch lần đầu.':'Đang kết nối máy chủ. Khi mất mạng, app hiển thị lịch đã lưu gần nhất.'}</p></div>`;
function render(){const wait=CLOUD&&((!SYNCED&&!(V.tab==='ad'&&!ADM))||(V.empty&&!ADM&&V.tab!=='ad'));$('#app').innerHTML=hdr()+(wait?waitV:{td:tdV,cal:calV,ev:evV,st:stV,ad:adV}[V.tab])();['td','cal','ev','st','ad'].forEach(t=>$('#t-'+t).className=V.tab==t?'on':'');tick()}
render();
