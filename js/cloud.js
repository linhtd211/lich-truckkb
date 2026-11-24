/* Đồng bộ thời gian thực qua Firebase (Authentication + Firestore).
   Chỉ chạy khi js/firebase-config.js đã điền cấu hình. Dữ liệu nằm ở tài liệu lichtruc/kcb. */
(function(){
if(!cloudOn())return;
firebase.initializeApp(window.FIREBASE_CONFIG);
const auth=firebase.auth(),db=firebase.firestore();
db.enablePersistence({synchronizeTabs:true}).catch(()=>{});
const ref=db.collection('lichtruc').doc('kcb');let user=null,tm=0;
const pack=()=>({staff:S.staff,nid:S.nid,rot:S.rot,sw:S.sw,log:S.log,ev:S.ev});
const msg={'auth/network-request-failed':'Không có kết nối mạng','auth/too-many-requests':'Thử quá nhiều lần, hãy đợi một lúc'};
CLOUD={
who:()=>user?user.email:'',
login(e,p){if(!e||!p)return toast('Nhập email và mật khẩu');auth.signInWithEmailAndPassword(e,p).then(()=>toast('Đã đăng nhập quản trị')).catch(x=>toast(msg[x.code]||'Sai email hoặc mật khẩu'))},
logout(){auth.signOut()},
push(){clearTimeout(tm);tm=setTimeout(()=>ref.set(Object.assign(pack(),{updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:user?user.email:''})).catch(()=>toast('Không ghi được lên máy chủ: cần quyền quản trị và có mạng')),250)}
};
auth.onAuthStateChanged(u=>{user=u;ADM=!!u;if(ADM&&V.empty)CLOUD.push();render()});
ref.onSnapshot(s=>{
NET=s.metadata.fromCache?'off':'on';
if(!s.exists){if(s.metadata.fromCache){render();return}V.empty=true;SYNCED=true;if(ADM)CLOUD.push();render();return}
V.empty=false;SYNCED=true;
if(!s.metadata.hasPendingWrites){const d=s.data();S.staff=d.staff||[];S.nid=d.nid||S.nid;S.rot=d.rot&&d.rot.length?d.rot:S.rot;S.sw=d.sw||{};S.log=d.log||[];S.ev=d.ev||[]}
const a=document.activeElement;if(!(ADM&&a&&/^(INPUT|SELECT)$/.test(a.tagName)))render()
},()=>{NET='off';render()});
addEventListener('online',()=>{NET='on';render()});addEventListener('offline',()=>{NET='off';render()});
})();
