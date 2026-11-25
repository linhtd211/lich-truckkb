/* Node 22+. Thực thi mã ứng dụng với DOM và bộ nhớ trình duyệt mô phỏng. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const root = path.join(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const appFiles = ['lunar','theme-registry','annual-leave','theme-engine','greetings','event-icons','app'];

function application(filesRoot = root, sourceFiles = appFiles, saved = new Map(), globals = {}) {
  const nodes = new Map(), handlers = new Map();
  const document = {
    addEventListener(name,handler) { handlers.set(name,handler); },
    body:{appendChild() {}},
    documentElement:{style:{}},
    createElement:() => ({remove(){}}),
    querySelector(selector) {
      if(!nodes.has(selector)) nodes.set(selector,{innerHTML:'',style:{},value:'',className:'',focus(){}});
      return nodes.get(selector);
    }
  };
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [2026,10,24,10,25])); }
  }
  const localStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key,value) => saved.set(key,value)
  };
  const ctx = vm.createContext({document,window:{},Date:FixedDate,localStorage,setTimeout(){},setInterval(){},...globals});
  for (const file of sourceFiles) {
    const script = path.join(filesRoot,'js',file+'.js');
    vm.runInContext(fs.readFileSync(script,'utf8'),ctx,{filename:script});
  }
  return {run: code => vm.runInContext(code,ctx),get: code => JSON.parse(vm.runInContext('JSON.stringify('+code+')',ctx)),nodes,saved,handlers};
}

const tests = [];
function check(label, fn) { fn(); tests.push(label); console.log('OK',label); }
class TestImage {
  constructor(src,fallback,style) {
    this.src=src; this.dataset={fallback}; this.hidden=false;
    this.classes=new Set([style]);
    this.classList={contains:name=>this.classes.has(name),add:name=>this.classes.add(name)};
  }
  getAttribute(name) { return this[name]; }
}
const app = application(root,appFiles,new Map(),{HTMLImageElement:TestImage});
const {run,get,nodes,saved} = app;
const theme = (y,m,d) => run(`visualsOn(${d},${m},${y}).theme.id`);
const events = (y,m,d) => get(`visualsOn(${d},${m},${y}).events.map(x=>[x.theme.id,x.leave])`);

check('Các ngày mục tiêu, 4 mùa và các khoảng trang trí',()=>{
  const days = [
    [2026,1,1,'tetduong'],[2025,12,31,'tetduong'],[2026,2,17,'tet'],
    [2027,2,6,'tet'],[2026,2,27,'thaythuoc'],[2026,3,8,'phunuqt'],
    [2026,4,26,'hungvuong'],[2026,4,30,'thongnhat'],[2026,5,1,'laodong'],
    [2026,7,27,'trihan'],[2026,9,2,'quockhanh'],[2026,9,25,'trungthu'],
    [2026,10,20,'phunuvn'],[2026,11,20,'nhagiao'],[2026,11,23,'disan'],
    [2026,11,24,'vanhoa'],[2026,12,22,'quandoi'],[2026,12,25,'giangsinh'],
    [2026,3,11,'xuan'],[2026,6,9,'ha'],[2026,10,13,'thu'],[2026,11,26,'dong'],
    [2026,4,29,'thongnhat'],[2026,12,26,'giangsinh'],[2026,12,28,'dong'],
    [2026,8,7,'suame'],[2026,8,8,'thu'],[2025,11,24,'dong']
  ];
  for (const [y,m,d,id] of days) assert.equal(theme(y,m,d),id,`${y}-${m}-${d}`);
});
check('Nghỉ lễ, nghỉ bù, hoán đổi và ca trực được xử lý riêng',()=>{
  assert.deepEqual(events(2026,11,24),[['vanhoa','paid']]);
  assert.deepEqual(events(2026,11,23),[['disan',null]]);
  assert.deepEqual(events(2026,4,27),[['hungvuong','compensatory']]);
  assert.deepEqual(events(2026,8,31),[['quockhanh','swap-off']]);
  assert.deepEqual(events(2026,8,22),[['quockhanh','swap-work']]);
  assert.deepEqual(events(2027,2,9),[['tet','compensatory']]);
  assert.deepEqual(events(2027,9,3),[['quockhanh','paid']]);
  assert.deepEqual(events(2026,9,3),[]);
  assert.equal(run("dutyK('2026-11-24').id"),run("rotAt(2026,10,24).id"));
});
check('Ngày âm nhuận và các sự kiện trùng ngày',()=>{
  const leap = get(`(() => {
    for(let j=jdF(1,1,1990); j<=jdF(31,12,2120); j++){
      const g=jdD(j),l=lunar(...g);
      if(l[3]&&l[0]===15&&l[1]===8)return {g,v:visualsOn(...g).events.map(e=>e.theme.id)};
    }
  })()`);
  assert.ok(leap.g && !leap.v.includes('trungthu'));
  assert.ok(get("evts(24,11,2026)").some(x=>x.n==='Ngày Văn hóa Việt Nam'));
  run("S.ev.push({id:1,t:'Giao ban kiểm thử',d:'2026-11-24',k:'hop'})");
  assert.deepEqual(get("evts(24,11,2026).map(x=>x.k)"),['le','ev']);
  assert.equal(theme(2026,11,24),'vanhoa');
  assert.equal(theme(2026,4,30),'thongnhat');
  assert.equal(theme(2026,2,27),'thaythuoc');
  assert.equal(run('visualsOn(17,2,2026).lunarNewYear'),2026);
  assert.equal(run('visualsOn(16,2,2026).lunarNewYear'),2026);
});
check('24 mốc tiết khí được tính hằng năm, mỗi tiết có icon riêng',()=>{
  const terms = get(`[2024,2025,2026,2027].map(y=>{
    const r=[];
    for(let j=jdF(1,1,y);j<=jdF(31,12,y);j++){
      const g=jdD(j), k=solarTermOn(...g);
      if(k)r.push([k[1],g[0]]);
    }
    return r;
  })`);
  assert.ok(terms.every(x=>x.length===24 && new Set(x.map(y=>y[0])).size===24));
  assert.ok(terms[0].some((p,i)=>p[1]!==terms[3][i][1]));
  const icons = get('SOLAR_TERMS.map(([,k])=>EventIconRegistry["solar-"+k])');
  const hashes = icons.map(file => createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'));
  assert.equal(new Set(hashes).size,24);
});
const registry = get(`Object.values(THEME_REGISTRY).map(theme=>{
  const icon=theme.icon && iconForTheme(theme);
  return {...theme,asset:ART_ROOT+theme.art, icon:icon&&(EventIconRegistry[icon]||EVENT_ICON_ROOT+icon+'.webp'),
    anchors:theme.layout, companions:[theme.companion,theme.symbol,theme.detail].filter(Boolean).map(file=>ART_ROOT+file),
    fallback:theme.fallback||'base-color', greetingText:GREETINGS[theme.greeting]||null};
})`);
const termIcons = get('SOLAR_TERMS.map(([name,id])=>({name,id,path:EventIconRegistry["solar-"+id]}))');
const resultDays = get(`(()=>{
 const first = {};
 for(let j=jdF(1,1,2026);j<=jdF(31,12,2026);j++){
    const g=jdD(j),v=visualsOn(...g);
    if(v.events.some(e=>e.theme.id===v.theme.id)) first[v.theme.id]??=g;
 }
 return first;
})()`);
check('Mọi chủ đề sự kiện có ngày kích hoạt, ảnh, icon và lời chúc',()=>{
  const themeFiles = new Set();
  assert.equal(registry.length,4+7+21+21);
  for (const entry of registry) {
    assert.ok(fs.statSync(path.join(root,entry.asset)).size>512,entry.asset);
    themeFiles.add(entry.asset);
    for (const file of entry.companions) assert.ok(fs.statSync(path.join(root,file)).size>512);
    if (!entry.icon) continue;
    assert.ok(fs.statSync(path.join(root,entry.icon)).size>256,entry.icon);
    assert.ok(entry.greetingText && resultDays[entry.id],entry.id);
    const [d,m,y] = resultDays[entry.id];
    run(`setSel(${y},${m-1},${d});T('td')`);
    const html = nodes.get('#app').innerHTML;
    assert.ok(html.includes('data-theme="'+entry.id+'"') && html.includes(entry.asset) && html.includes(entry.icon),entry.id);
    assert.ok(html.includes('Người trực') && html.includes('Xem chi tiết') && html.includes('ÂM LỊCH'),entry.id);
  }
  assert.equal(themeFiles.size,registry.length);
});
check('Thay tranh hoặc icon dự phòng khi tệp ảnh chưa có trong cache',()=>{
  const onError=app.handlers.get('error');
  const img=new TestImage('special.webp','season.webp','theme-art');
  onError({target:img});
  assert.equal(img.src,'season.webp');
  assert.ok(img.classes.has('theme-art-fallback'));
  const icon=new TestImage('special.webp','memo.webp','event-icon');
  onError({target:icon});
  assert.equal(icon.src,'memo.webp');
  const note=new TestImage('missing.webp','missing.webp','theme-companion');
  onError({target:note});
  assert.equal(note.hidden,true);
});
check('Ngày 22/12 hiển thị ảnh Đội danh dự và có nguồn ảnh trong trang chi tiết',()=>{
  run("setSel(2026,11,22);T('td')");
  const html = nodes.get('#app').innerHTML;
  assert.match(html,/data-theme="quandoi" data-layout="heritage"/);
  assert.match(html,/themes\/quandoi\.webp/);
  assert.match(read('ASSET_SOURCES.md'),/Đội danh dự Quân đội nhân dân Việt Nam ngày 29\/07\/2019/);
  run("openDay('2026-12-22')");
  assert.match(nodes.get('#ov').innerHTML,/href="ASSET_SOURCES.md"/);
});
check('Mã hiển thị chuyển ngày, tab Sự kiện, lịch tháng và thống kê',()=>{
  run("setSel(2026,10,23);T('td');D(1)");
  assert.match(nodes.get('#app').innerHTML,/data-theme="vanhoa"/);
  run("openDay('2026-11-24')");
  assert.match(nodes.get('#ov').innerHTML,/Nghỉ lễ theo quy định/);
  assert.doesNotMatch(nodes.get('#ov').innerHTML,/Hoán đổi hai ngày trực/);
  run("T('ev')");
  assert.match(nodes.get('#app').innerHTML,/Giao ban kiểm thử/);
  assert.match(nodes.get('#app').innerHTML,/Ngày Di sản Văn hóa Việt Nam/);
  run("T('cal')");
  assert.match(nodes.get('#app').innerHTML,/class="c {2}off td /);
  run("T('st')");
  assert.match(nodes.get('#app').innerHTML,/class="bar"/);
});
check('Lịch tháng hiện chức danh và tên riêng, chi tiết giữ nguyên tên đã lưu',()=>{
  const preview=application();
  const {run: act,nodes: ui}=preview;
  act("setSel(2026,10,25);S.staff[0].name='BS.Hoàng';S.staff[1].name='ĐD. Diệp';S.staff[2].name='Nguyễn Thị Huế';S.staff[3].name='YS Linh';S.sw['2026-11-25']=0;T('cal')");
  for (const [role,name] of [['BS','Hoàng'],['ĐD','Diệp'],['','Huế'],['YS','Linh']]) {
    assert.match(ui.get('#app').innerHTML,new RegExp(`class="month-duty-role">${role}</span>\\s*<span class="month-duty-name">${name}</span>`));
  }
  act("openDay('2026-11-25')");
  assert.match(ui.get('#ov').innerHTML,/>BS.Hoàng<\/strong>/);
});
check('Chi tiết ca trực, điều hướng liền kề và quyền quản trị',()=>{
  const preview=application();
  const {run: act,nodes: ui}=preview;
  const modal=()=>ui.get('#ov').innerHTML;
  act("setSel(2026,10,25);T('td');S.sw['2026-11-24']=0;openDay('2026-11-25')");
  assert.match(modal(),/Chi tiết ca trực/);
  assert.match(modal(),/Ca trước<[/]small><strong>24[/]11 · BS. Nguyễn Văn An/);
  assert.match(modal(),/Ca sau<[/]small><strong>26[/]11 ·/);
  assert.doesNotMatch(modal(),/Xem trang ngày|Sự kiện trong ngày|Hoán đổi hai ngày trực/);
  act("openDay('2026-11-24')");
  assert.match(modal(),/Đã đổi ca/);
  assert.match(modal(),/Sự kiện trong ngày/);
  assert.match(modal(),/Xem trang ngày/);
  assert.equal(act('key(...V.sel)'), '2026-11-25');
  act("T('cal');openDay('2026-12-31')");
  assert.match(modal(),/onclick="openDay\('2027-01-01'\)"/);
  assert.match(modal(),/Xem trang ngày/);
  act("ADM=true;openDay('2026-12-31')");
  assert.match(modal(),/Hoán đổi hai ngày trực/);
  assert.match(modal(),/Chỉ định/);
});
check('Xếp vòng, thêm cán bộ, đổi ca, chỉ định và dữ liệu cũ',()=>{
  run("S.ph=pinHash('9114');save();T('ad')");
  assert.match(nodes.get('#app').innerHTML,/Đăng nhập quản trị/);
  run("$('#pin').value='9114';login()");
  assert.equal(run("ADM"),true);
  const before = run("dutyK('2026-11-30').id");
  run("V.eff='2026-12-01';$('#nn').value='BS. Ca thử';$('#nw').value='1';add()");
  assert.equal(run("dutyK('2026-12-01').name"),'BS. Ca thử');
  assert.equal(run("dutyK('2026-11-30').id"),before);
  run("$('#si').value='1';apply()");
  const pair = get("['2026-12-01','2026-12-02'].map(k=>dutyK(k).id)");
  run("$('#sd').value='2026-12-02';swap('2026-12-01')");
  assert.deepEqual(get("['2026-12-01','2026-12-02'].map(k=>dutyK(k).id)"),pair.reverse());
  run("$('#sp').value='4';assign('2026-12-01');$('#et').value='Họp trong ca';$('#ed').value='2026-12-01';$('#ek').value='hop';addEv()");
  assert.equal(run("dutyK('2026-12-01').id"),4);
  assert.ok(run("S.log.length>=4"));
  const reopened = application(root,appFiles,saved);
  assert.equal(reopened.run("dutyK('2026-12-01').id"),4);
  assert.equal(reopened.run("S.ev.some(e=>e.t==='Họp trong ca')"),true);
  const legacy = application(root,appFiles,new Map([['lichtruc-kcb',JSON.stringify({
    staff:[{id:0,name:'Người trực dữ liệu cũ'}],nid:1,start:'2026-11-23',sw:{},log:[],si:0,pin:'9114'
  })]]));
  assert.equal(legacy.run("dutyK('2026-11-24').name"),'Người trực dữ liệu cũ');
  assert.equal(legacy.run('S.pin'),undefined);
});
check('Sửa tên tại danh sách trực và ẩn Nhật ký đổi lịch',()=>{
  const editor = application();
  const {run: act,get: state,nodes: ui,saved: storage} = editor;
  act("T('ad');renameStaff(0,'Không có quyền')");
  assert.equal(act('byId(0).name'),'BS. Nguyễn Văn An');
  assert.doesNotMatch(ui.get('#app').innerHTML,/Sửa tên/);

  act("ADM=true;S.sw['2026-11-25']=0;S.log.push({t:'2026-11-25',x:'Nhật ký kiểm thử'});render()");
  const priorData = state('[S.rot,S.sw,S.log,S.nid]');
  const roster = ui.get('#app').innerHTML;
  assert.match(roster,/id="staff-name-edit-0"[^>]*aria-controls="staff-name-form-0"/);
  assert.match(roster,/id="staff-name-form-0"[^>]*hidden[^>]*renameStaff\(0,this.elements.staffName.value\)/);
  assert.doesNotMatch(roster,/Nhật ký đổi lịch|Nhật ký kiểm thử/);

  let expanded, focuses = 0;
  const input = {value:'',focus(){focuses++;},select(){}};
  const form = {hidden:true,elements:{staffName:input}};
  ui.set('#staff-name-form-0',form);
  ui.set('#staff-name-edit-0',{focus(){focuses++;},setAttribute(key,value){if(key==='aria-expanded')expanded=value;}});
  act('showStaffNameForm(0,true)');
  assert.equal(form.hidden,false);
  assert.equal(expanded,'true');
  assert.equal(input.value,'BS. Nguyễn Văn An');
  act("renameStaff(0,'   ')");
  assert.equal(form.hidden,false);
  assert.equal(act('byId(0).name'),'BS. Nguyễn Văn An');
  act('showStaffNameForm(0,false)');
  assert.equal(form.hidden,true);
  assert.equal(expanded,'false');

  act("showStaffNameForm(0,true);renameStaff(0,'  BS. Nguyễn An  ')");
  assert.ok(focuses>=3);
  assert.equal(act("dutyK('2026-11-01').name"),'BS. Nguyễn An');
  assert.equal(act("dutyK('2026-11-25').name"),'BS. Nguyễn An');
  assert.equal(act("dutyK('2026-12-01').name"),'BS. Nguyễn An');
  assert.deepEqual(state('[S.rot,S.sw,S.log,S.nid]'),priorData);
  assert.match(ui.get('#app').innerHTML,/BS\. Nguyễn An/);
  assert.doesNotMatch(ui.get('#app').innerHTML,/Nhật ký đổi lịch|Nhật ký kiểm thử/);

  const reopened = application(root,appFiles,storage);
  assert.equal(reopened.run('byId(0).name'),'BS. Nguyễn An');
  assert.deepEqual(reopened.get('[S.rot,S.sw,S.log,S.nid]'),priorData);
});
check('Luồng Firebase tương thích với snapshot và ghi lịch từ quản trị viên mô phỏng',()=>{
  let onAuth,onSnapshot,write,initializations=0;
  const staff=[{id:0,name:'BS. Tài khoản thử'},{id:1,name:'ĐD. Tài khoản thử'}];
  const record={staff,nid:2,rot:[{from:'2026-11-01',ids:[0,1],si:0}],sw:{},log:[],ev:[]};
  const ref={onSnapshot(fn){onSnapshot=fn;},set(payload){write=payload;return Promise.resolve();}};
  const auth={onAuthStateChanged(fn){onAuth=fn;}};
  const db={enablePersistence(){return Promise.resolve();},collection(){return {doc:()=>ref};}};
  const firebase={initializeApp(){initializations++;},auth:()=>auth,firestore:()=>db};
  firebase.firestore.FieldValue={serverTimestamp:()=>1234};
  const remote=application(root,[...appFiles,'cloud'],new Map(),{
    window:{FIREBASE_CONFIG:{apiKey:'fixture-key',projectId:'fixture-project'}},
    firebase,addEventListener(){},setTimeout(fn){fn();return 1;},clearTimeout(){}
  });
  onAuth(null);
  onSnapshot({metadata:{fromCache:false,hasPendingWrites:false},exists:true,data:()=>record});
  assert.ok(initializations===1 && remote.run('SYNCED && !ADM'));
  assert.equal(remote.run("dutyK('2026-11-24').id"),1);
  remote.run('save()');
  assert.equal(write,undefined);
  onAuth({email:'admin@example.invalid'});
  remote.run("$('#sp').value='0';assign('2026-11-24')");
  assert.equal(write.sw['2026-11-24'],0);
  assert.equal(write.updatedAt,1234);
  assert.ok('staff' in write && 'ev' in write && !('ph' in write));
  remote.run("renameStaff(0,'BS. Tên sau đồng bộ')");
  assert.equal(write.staff[0].name,'BS. Tên sau đồng bộ');
  assert.equal(write.sw['2026-11-24'],0);
  onSnapshot({metadata:{fromCache:true,hasPendingWrites:false},exists:true,data:()=>record});
  assert.equal(remote.run('NET'),'off');
});

const baseline = process.env.VISUAL20_BASELINE;
if (baseline) {
  check('So sánh với Visual 2.0 trên 10.958 ngày và cấu hình nguyên bản',()=>{
    const old = application(baseline,['lunar','decor','app']);
    const grid = `(()=>{
      const rows=[];
      for(let j=jdF(1,1,2010);j<=jdF(31,12,2039);j++){
        const [d,m,y]=jdD(j);
        rows.push([lunar(d,m,y),duty(y,m-1,d)?.id]);
      }
      return rows;
    })()`;
    assert.deepEqual(application().get(grid),old.get(grid));
    for (const file of ['js/cloud.js','js/firebase-config.js','firestore.rules','manifest.webmanifest','.github/workflows/pages.yml']) {
      assert.equal(read(file),fs.readFileSync(path.join(baseline,file),'utf8'),file);
    }
  });
}

async function workerChecks(){
  const scope='https://qa.invalid/lich-truc-kcb/';
  const books=new Map(), handlers={};
  const url=req=>typeof req==='string'?req:req.url;
  const open=async function(name) {
    if(!books.has(name))books.set(name,new Map());
    const map=books.get(name);
    return {
      keys:async()=>[...map.keys()].map(x=>new Request(x)),
      match:async req=>map.get(url(req)), put:async(req,res)=>map.set(url(req),res),
      delete:async req=>map.delete(url(req)),
      async addAll(requests){
        for(const req of requests) {
          const relative=url(req).slice(scope.length);
          assert.ok(fs.statSync(path.join(root,relative)).size>0,relative);
          await this.put(req,new Response(relative));
        }
      }
    };
  };
  const cache={open,keys:async()=>[...books.keys()],delete:async key=>books.delete(key)};
  const formerShell = 'lich-truc-kcb:' + scope + ':visual-2.1.1-shell';
  await (await open(formerShell)).put(scope+'js/app.js',new Response('giao diện Quản trị cũ'));
  const currentMedia = 'lich-truc-kcb:' + scope + ':visual-2.1.1-media';
  const currentArtwork = scope + 'assets/illustrations/themes/quandoi.webp';
  await (await open(currentMedia)).put(currentArtwork,new Response('ảnh 22/12 đã đối chiếu'));
  const old=await open('lich-truc-visual-v7');
  await old.put(scope+'js/decor.js',new Response('old'));
  await old.put('https://qa.invalid/another-app/',new Response('separate'));
  await (await open('other-app')).put('https://qa.invalid/other/',new Response('other'));
  let offline=false,claimed=false;
  const sw=vm.createContext({caches:cache,URL,Request,Response,
    fetch:async()=>{if(offline)throw new Error('offline');return new Response('webp',{headers:{'content-type':'image/webp'}})},
    self:{registration:{scope},async skipWaiting(){},clients:{async claim(){claimed=true}},addEventListener(e,fn){handlers[e]=fn;}}
  });
  vm.runInContext(read('sw.js'),sw);
  const fire=async(type,request)=>{
    let result;
    handlers[type]({request,waitUntil:p=>{result=p},respondWith:p=>{result=p}});
    return result;
  };
  await fire('install');
  await fire('activate');
  assert.ok(claimed&&books.has('other-app'));
  assert.ok(!books.has(formerShell));
  assert.equal(await (await fire('fetch',new Request(currentArtwork))).text(),'ảnh 22/12 đã đối chiếu');
  assert.equal(await old.match(scope+'js/decor.js'),undefined);
  assert.ok(await old.match('https://qa.invalid/another-app/'));
  const nav={method:'GET',mode:'navigate',url:scope};
  const art = new Request(scope+'assets/illustrations/themes/vanhoa.webp');
  const missing = new Request(scope+'assets/illustrations/themes/chua-xem.webp');
  assert.equal((await fire('fetch',art)).status,200);
  offline=true;
  assert.ok(await fire('fetch',nav));
  assert.equal((await fire('fetch',art)).status,200);
  assert.equal((await fire('fetch',missing)).type,'error');
  check('Service Worker mô phỏng: subpath, bộ khung, media, offline và dọn cache cũ theo phạm vi',()=>{});
}

workerChecks().then(()=>{
  if (process.argv.includes('--manifest')) {
    fs.writeFileSync(path.join(root,'asset-manifest.json'),
      JSON.stringify({version:'2.1.6',themes:registry,solarTerms:termIcons},null,2)+'\n');
  }
  if (process.argv.includes('--report')) {
    fs.writeFileSync(path.join(__dirname,'ket-qua.json'),JSON.stringify({tests,themeDates:resultDays},null,2)+'\n');
  }
  console.log(tests.length,'nhóm kiểm tra đạt');
}).catch(error=>{console.error(error);process.exitCode=1});
