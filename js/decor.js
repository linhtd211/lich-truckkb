/* Hình trang trí theo mùa và ngày đặc biệt (chọn ngẫu nhiên mỗi lần mở app).
   Toàn bộ hình là tệp minh họa trong assets/illustrations/, chạy được khi offline.
   Thêm hình mới: chép tệp .webp vào assets/illustrations/decor/ rồi thêm tên tệp (không có đuôi) vào chủ đề bên dưới.
   a = hình lớn góc trên, b = hình nhỏ, c = hình dưới. Họa tiết nền mờ mỗi chủ đề: assets/illustrations/patterns/<chủ đề>.webp */
const A=p=>(window.ASSET_DATA&&window.ASSET_DATA[p])||p;
const ZOD=['rat','ox','tiger','cat','dragon','snake','horse','goat','monkey','rooster','dog','pig'];
const TH={
xuan:{a:['cherry-blossom','blossom','tulip'],b:['butterfly','seedling','hibiscus','herb'],c:['sunrise-over-mountains','national-park','rainbow']},
ha:{a:['lotus','sunflower','sun'],b:['watermelon','palm-tree','hibiscus'],c:['national-park','sunrise','rainbow']},
thu:{a:['maple-leaf','fallen-leaf','sheaf-of-rice'],b:['leaf-fluttering-in-wind','hot-beverage','chestnut'],c:['sunrise-over-mountains','night-with-stars','national-park']},
dong:{a:['snowflake','hot-beverage','scarf'],b:['fallen-leaf','candle','hot-beverage'],c:['night-with-stars','cityscape-at-dusk','mountain']},
tet:{a:['red-envelope','tangerine'],b:['cherry-blossom','pine-decoration','firecracker','red-paper-lantern','peach'],c:['fireworks','red-paper-lantern','confetti-ball']},
trungthu:{a:['full-moon','moon-cake','red-paper-lantern'],b:['sparkles','crescent-moon','red-paper-lantern'],c:['night-with-stars','full-moon','moon-cake']},
vulan:{a:['lotus','folded-hands','candle'],b:['lotus','dove','herb'],c:['sunrise','national-park']},
hungvuong:{a:['dragon','mountain','bell'],b:['lotus','red-paper-lantern','sparkles'],c:['national-park','mountain','sunrise-over-mountains']},
quockhanh:{a:['star','fireworks','dove'],b:['sparkles','trophy','red-heart'],c:['fireworks','sunrise','national-park']},
laodong:{a:['hammer-and-wrench','gear','construction-worker'],b:['sparkles','star','trophy'],c:['fireworks','sunrise','national-park']},
thaythuoc:{a:['stethoscope','health-worker','red-heart'],b:['pill','syringe','adhesive-bandage','bouquet'],c:['hospital','sunrise','national-park']},
nhagiao:{a:['teacher','books','graduation-cap'],b:['bouquet','rose','sunflower','memo','open-book'],c:['sunrise','national-park','sunrise-over-mountains']},
phunu:{a:['bouquet','rose','tulip'],b:['heart-with-ribbon','sparkles','butterfly'],c:['sunrise','rainbow','national-park']},
valentine:{a:['heart-with-ribbon','love-letter','rose'],b:['red-heart','bouquet','sparkles'],c:['night-with-stars','sunrise','cityscape-at-dusk']},
thieunhi:{a:['teddy-bear','balloon','kite'],b:['rainbow','butterfly','party-popper'],c:['rainbow','sunrise','national-park']},
giangsinh:{a:['christmas-tree','santa-claus','wrapped-gift'],b:['snowflake','bell','sparkles','candle'],c:['night-with-stars','cityscape-at-dusk','snowflake']},
tetduong:{a:['fireworks','party-popper','confetti-ball'],b:['clinking-glasses','sparkles','star'],c:['fireworks','night-with-stars','cityscape-at-dusk']},
yte:{a:['stethoscope','health-worker','red-heart','hospital'],b:['pill','syringe','microbe','soap'],c:['hospital','sunrise','national-park']}
};
const YTI={'7-4':['stethoscope','health-worker'],'4-2':['reminder-ribbon','red-heart'],'24-3':['lungs','microbe'],'25-4':['mosquito','microbe'],'5-5':['soap','microbe'],'8-5':['red-heart','hospital'],'12-5':['health-worker','stethoscope'],'31-5':['no-smoking','lungs'],'28-7':['drop-of-blood','anatomical-heart'],'1-8':['baby-bottle','red-heart'],'17-9':['hospital','handshake'],'29-9':['anatomical-heart','stethoscope'],'10-10':['brain','red-heart'],'29-10':['brain','anatomical-heart'],'14-11':['drop-of-blood','pill'],'1-12':['reminder-ribbon','red-heart']};
const SEED=Math.random(),rnd=s=>{const x=Math.sin(SEED*9973+s*78.233)*43758.5453;return x-Math.floor(x)},pickOf=(L,s)=>L[Math.floor(rnd(s)*L.length)];
function themeOf(d,m,y){const l=lunar(d,m,y),k=d+'-'+m;
if(!l[3]){if((l[1]==12&&l[0]>=23)||(l[1]==1&&l[0]<=3))return 'tet';if(l[1]==8&&l[0]>=13&&l[0]<=16)return 'trungthu';if(l[1]==7&&l[0]>=14&&l[0]<=16)return 'vulan';if(l[1]==3&&l[0]>=9&&l[0]<=11)return 'hungvuong'}
if(k=='1-1')return 'tetduong';if(k=='30-4')return 'thongnhat';if((m==9&&d<=3)||(m==8&&d==31))return 'quockhanh';if(k=='1-5')return 'laodong';if(m==2&&d>=26&&d<=27)return 'thaythuoc';if(k=='20-11')return 'nhagiao';if(k=='8-3'||k=='20-10')return 'phunu';if(k=='14-2')return 'valentine';if(k=='1-6')return 'thieunhi';if(m==12&&d>=22&&d<=26)return 'giangsinh';if(!l[3]&&l[1]==1&&l[0]<=15)return 'tet';if(YTI[k])return 'yte';
return m>=2&&m<=4?'xuan':m>=5&&m<=7?'ha':m>=8&&m<=10?'thu':'dong'}
function decorFor(y,m,d){const id=themeOf(d,m,y),t=TH[id]||TH.quockhanh,l=lunar(d,m,y),s=d*7+m*31+y;let a=t.a;
if(id=='yte'&&YTI[d+'-'+m])a=YTI[d+'-'+m];
if(id=='tet')a=[ZOD[((l[1]==12?l[2]+1:l[2])+8)%12]];
const f=n=>A('assets/illustrations/decor/'+n+'.webp');
const season=m>=2&&m<=4?'xuan':m>=5&&m<=7?'ha':m>=8&&m<=10?'thu':'dong';const art=['xuan','ha','thu','dong','thaythuoc','quockhanh'].includes(id)?id:season;return{id,art:A('assets/illustrations/seasonal/'+art+'.webp'),pat:A('assets/illustrations/patterns/'+id+'.webp'),a:f(pickOf(a,s+1)),b:f(pickOf(t.b,s+2)),c:f(pickOf(t.c,s+3))}}

const CELEBRATIONS={tetduong:['Chúc mừng năm mới','Chúc đồng nghiệp một năm bình an, hạnh phúc.'],tet:['Chúc mừng năm mới','Đón xuân bình an – Vững vàng ca trực.'],hungvuong:['Giỗ Tổ Hùng Vương','Thành kính tri ân công đức các Vua Hùng.'],thongnhat:['Ngày thống nhất đất nước','Tự hào ngày thống nhất non sông.'],laodong:['Quốc tế Lao động','Tôn vinh những giá trị lao động và cống hiến.'],quockhanh:['Chào mừng Quốc khánh 2/9','Chúc đồng nghiệp kỳ nghỉ vui vẻ, ca trực bình an.'],thaythuoc:['Ngày Thầy thuốc Việt Nam','Tận tâm với nghề – Trọn vẹn với người bệnh. Kính chúc đồng nghiệp mạnh khỏe, hạnh phúc và thành công.'],trungthu:['Tết Trung thu','Chúc một mùa trăng sum vầy, an vui.'],vulan:['Lễ Vu Lan','Tri ân công ơn sinh thành và dưỡng dục.'],nhagiao:['Ngày Nhà giáo Việt Nam','Tri ân những người gieo mầm tri thức.'],phunu:['Chúc mừng ngày Phụ nữ','Chúc các đồng nghiệp nữ luôn mạnh khỏe, hạnh phúc.'],valentine:['Ngày Valentine','Chúc một ngày yêu thương.'],thieunhi:['Quốc tế Thiếu nhi','Chúc các em nhỏ luôn khỏe mạnh, vui tươi.'],giangsinh:['Giáng sinh an lành','Chúc đồng nghiệp và gia đình bình an.']};
const eventAsset=n=>A('assets/illustrations/decor/'+n+'.webp');
const eventImage=n=>`<img class="event-icon" src="${eventAsset(n)}" alt="" aria-hidden="true">`;
const SOLAR_ICONS=['blossom','herb','seedling','sunflower','leaf-fluttering-in-wind','sheaf-of-rice','sun','lotus','watermelon','fallen-leaf','sunrise','herb','maple-leaf','fallen-leaf','chestnut','scarf','snowflake','snowflake','mountain','hot-beverage','scarf','cherry-blossom','herb','butterfly'];
function holidayIcon(n,d,m,y){const t=themeOf(d,m,y);return ({tet:'red-envelope',tetduong:'fireworks',hungvuong:'mountain',quockhanh:'star',thongnhat:'star',laodong:'hammer-and-wrench',thaythuoc:'stethoscope',trungthu:'moon-cake',vulan:'lotus',nhagiao:'books',phunu:'bouquet',valentine:'heart-with-ribbon',thieunhi:'kite',giangsinh:'christmas-tree',yte:'stethoscope'})[t]||'sparkles'}
