/* Các ngày sự kiện dùng lịch dương, trừ những mục khai báo lunar.
   Ngày nghỉ từng năm được quản lý riêng trong annual-leave.js. */
const ART_ROOT = 'assets/illustrations/';
const SEASON_THEMES = [
  {id:'xuan', name:'Mùa xuân', paper:'#faf4ed', ink:'#375248', disc:'#e8eee0', art:'seasonal/xuan.webp', layout:'paper', source:'original'},
  {id:'ha', name:'Mùa hè', paper:'#f7f5e8', ink:'#284b40', disc:'#e0eddb', art:'seasonal/ha.webp', layout:'paper', source:'original'},
  {id:'thu', name:'Mùa thu', paper:'#fbf3e4', ink:'#634a2b', disc:'#f3e5c7', art:'themes/thu.webp', layout:'paper', source:'watercolor'},
  {id:'dong', name:'Mùa đông', paper:'#f1f5f3', ink:'#2b4e55', disc:'#e1eef0', art:'seasonal/dong.webp', layout:'paper', source:'original'}
];

const GROUPS = {
  national: {priority:600, kind:'kn', paper:'#fbf1e4', ink:'#75413c', disc:'#f5e6ce'},
  nationalMemory: {priority:500, kind:'kn', paper:'#f6f0e7', ink:'#604e42', disc:'#ede3d6'},
  medical: {priority:400, kind:'yt', paper:'#eef6f0', ink:'#254e48', disc:'#dceee3'},
  cultural: {priority:300, kind:'kn', paper:'#fcf2ef', ink:'#6a4051', disc:'#f1e3e8'}
};

const eventTheme = (id, name, group, icon, rule, extra = {}) => ({
  id, name, group, icon, rule,
  ...GROUPS[group],
  art: 'themes/' + id + '.webp',
  layout:'corner', source:'watercolor', fallback:'season',
  greeting: id,
  ...extra
});
const solarDate = (day, month) => ({day, month});
const lunarDate = (day, month) => ({day, month, lunar:true});
const span = (from, to) => ({from, to});
const EVENT_THEMES = [
  eventTheme('tetduong','Tết Dương lịch','national','fireworks',solarDate(1,1),{window:span([12,31],[1,1]),paid:true,layout:'corner-top',ink:'#514229'}),
  eventTheme('tet','Tết Nguyên đán','national','red-envelope',lunarDate(1,1),{window:{tet:true},layout:'corner-top',ink:'#783a40'}),
  eventTheme('hungvuong','Giỗ Tổ Hùng Vương','national','heritage-drum',lunarDate(10,3),{window:span([3,9],[3,11]),paid:true,layout:'heritage',source:'heritage',companion:'themes/hung-leaves.webp',detail:'heritage/ngoc-lu.webp'}),
  eventTheme('thongnhat','Ngày Giải phóng miền Nam, thống nhất đất nước','national','vietnam-flag',solarDate(30,4),{window:span([4,29],[4,30]),paid:true,layout:'heritage',source:'heritage',companion:'themes/red-silk.webp',symbol:'heritage/vietnam-flag.webp'}),
  eventTheme('laodong','Ngày Quốc tế Lao động','national','hammer-and-wrench',solarDate(1,5),{paid:true,ink:'#685327'}),
  eventTheme('quockhanh','Quốc khánh','national','vietnam-flag',solarDate(2,9),{window:span([8,31],[9,3]),paid:true,layout:'national',source:'heritage',companion:'themes/quockhanh-wash.webp',symbol:'heritage/vietnam-flag.webp'}),
  eventTheme('vanhoa','Ngày Văn hóa Việt Nam','national','heritage-drum',solarDate(24,11),{fromYear:2026,paid:true,layout:'culture',title:'Chào mừng Ngày Văn hóa Việt Nam',designName:'Bản sắc Việt – Heritage of Vietnam',source:'heritage',companion:'themes/vanhoa-wash.webp'}),
  eventTheme('thanhlapdang','Ngày thành lập Đảng Cộng sản Việt Nam','nationalMemory','party-flag',solarDate(3,2),{source:'heritage',symbol:'heritage/co-dang-va-co-to-quoc.webp'}),
  eventTheme('valentine','Valentine','cultural','love-letter',solarDate(14,2)),
  eventTheme('phunuqt','Ngày Quốc tế Phụ nữ','cultural','bouquet',solarDate(8,3)),
  eventTheme('thanhlapdoan','Ngày thành lập Đoàn TNCS Hồ Chí Minh','nationalMemory','dove',solarDate(26,3),{paper:'#edf6f2',ink:'#2c554c'}),
  eventTheme('ngaysach','Ngày Sách và Văn hóa đọc Việt Nam','cultural','open-book',solarDate(21,4),{paper:'#eef2f4',ink:'#374d5d'}),
  eventTheme('sinhnhatbac','Kỷ niệm ngày sinh Chủ tịch Hồ Chí Minh','nationalMemory','lotus',solarDate(19,5),{source:'heritage',art:'heritage/bac-1946.webp',layout:'portrait',companion:'themes/sinhnhatbac.webp'}),
  eventTheme('thieunhi','Ngày Quốc tế Thiếu nhi','cultural','kite',solarDate(1,6),{paper:'#f8f4e6',ink:'#615129'}),
  eventTheme('giadinh','Ngày Gia đình Việt Nam','cultural','red-heart',solarDate(28,6)),
  eventTheme('trihan','Ngày Thương binh – Liệt sĩ','nationalMemory','candle',solarDate(27,7),{paper:'#f8f4e9',ink:'#544635'}),
  eventTheme('vulan','Lễ Vu Lan','cultural','lotus',lunarDate(15,7),{paper:'#f6f1f5',ink:'#5f475f'}),
  eventTheme('cachmang','Kỷ niệm Cách mạng Tháng Tám','nationalMemory','memo',solarDate(19,8),{source:'heritage',art:'heritage/cach-mang-1945.webp',layout:'heritage',companion:'themes/cachmang.webp'}),
  eventTheme('trungthu','Tết Trung thu','cultural','star-lantern',lunarDate(15,8),{window:span([8,13],[8,16]),paper:'#fbf1dc',disc:'#f0e0ba',ink:'#5c442a',layout:'paper'}),
  eventTheme('phunuvn','Ngày Phụ nữ Việt Nam','cultural','rose',solarDate(20,10)),
  eventTheme('daidoanket','Ngày hội Đại đoàn kết toàn dân tộc','nationalMemory','handshake',solarDate(18,11)),
  eventTheme('nhagiao','Ngày Nhà giáo Việt Nam','cultural','books',solarDate(20,11),{paper:'#fbf1e7',ink:'#594d3d'}),
  eventTheme('disan','Ngày Di sản Văn hóa Việt Nam','cultural','heritage-tower',solarDate(23,11),{paper:'#f4f0dd',ink:'#435546',layout:'heritage',source:'heritage',companion:'themes/vanhoa-wash.webp'}),
  eventTheme('quandoi','Ngày thành lập Quân đội nhân dân Việt Nam','nationalMemory','vietnam-flag',solarDate(22,12),{paper:'#f1f3e8',ink:'#434f38',layout:'heritage',source:'heritage'}),
  eventTheme('giangsinh','Giáng sinh','cultural','bell',{month:12,days:[24,25]},{window:span([12,22],[12,26]),paper:'#eff5ef',ink:'#354f48',layout:'corner-top'}),
  eventTheme('doanngo','Tết Đoan Ngọ','cultural','sheaf-of-rice',lunarDate(5,5),{paper:'#f4f4e3',ink:'#455036'}),
  eventTheme('ramgieng','Rằm tháng Giêng','cultural','full-moon',lunarDate(15,1)),
  eventTheme('ongtao','Ông Công Ông Táo','cultural','tangerine',lunarDate(23,12)),
  eventTheme('ungthu','Ngày Thế giới phòng chống ung thư','medical','reminder-ribbon',solarDate(4,2)),
  eventTheme('thaythuoc','Ngày Thầy thuốc Việt Nam','medical','stethoscope',solarDate(27,2),{window:span([2,26],[2,27]),layout:'paper',paper:'#faf4ee',disc:'#e6eee4'}),
  eventTheme('lao','Ngày Thế giới phòng chống lao','medical','lungs',solarDate(24,3)),
  eventTheme('suckhoe','Ngày Sức khỏe thế giới','medical','health-worker',solarDate(7,4)),
  eventTheme('sotret','Ngày Thế giới phòng chống sốt rét','medical','mosquito',solarDate(25,4)),
  eventTheme('vesinhtay','Ngày Vệ sinh tay thế giới','medical','soap',solarDate(5,5)),
  eventTheme('chuthapdo','Ngày Chữ thập đỏ và Trăng lưỡi liềm đỏ thế giới','medical','aid-hands',solarDate(8,5)),
  eventTheme('dieuduong','Ngày Quốc tế Điều dưỡng','medical','bouquet',solarDate(12,5)),
  eventTheme('huyetap','Ngày Tăng huyết áp thế giới','medical','pressure-monitor',solarDate(17,5)),
  eventTheme('thuocla','Ngày Thế giới không thuốc lá','medical','no-smoking',solarDate(31,5)),
  eventTheme('hienmau','Ngày Thế giới tôn vinh người hiến máu','medical','drop-of-blood',solarDate(14,6)),
  eventTheme('danso','Ngày Dân số thế giới','medical','health-worker',solarDate(11,7)),
  eventTheme('viemgan','Ngày Viêm gan thế giới','medical','liver',solarDate(28,7)),
  eventTheme('suame','Tuần lễ Nuôi con bằng sữa mẹ','medical','nursing',solarDate(1,8),{window:span([8,1],[8,7]),period:true}),
  eventTheme('antoan','Ngày An toàn người bệnh thế giới','medical','shield',solarDate(17,9)),
  eventTheme('timmach','Ngày Tim mạch thế giới','medical','anatomical-heart',solarDate(29,9)),
  eventTheme('tamthan','Ngày Sức khỏe tâm thần thế giới','medical','herb',solarDate(10,10)),
  eventTheme('dotquy','Ngày Đột quỵ thế giới','medical','brain',solarDate(29,10)),
  eventTheme('daithaoduong','Ngày Đái tháo đường thế giới','medical','glucose-monitor',solarDate(14,11)),
  eventTheme('aids','Ngày Thế giới phòng chống AIDS','medical','reminder-ribbon',solarDate(1,12)),
  eventTheme('dichbenh','Ngày Quốc tế phòng chống dịch bệnh','medical','shield',solarDate(27,12))
];

const THEME_REGISTRY = Object.fromEntries([...SEASON_THEMES, ...EVENT_THEMES].map(theme => [theme.id, theme]));

const SOLAR_TERMS = [
  ['Xuân phân','xuan-phan'],['Thanh minh','thanh-minh'],['Cốc vũ','coc-vu'],
  ['Lập hạ','lap-ha'],['Tiểu mãn','tieu-man'],['Mang chủng','mang-chung'],
  ['Hạ chí','ha-chi'],['Tiểu thử','tieu-thu'],['Đại thử','dai-thu'],
  ['Lập thu','lap-thu'],['Xử thử','xu-thu'],['Bạch lộ','bach-lo'],
  ['Thu phân','thu-phan'],['Hàn lộ','han-lo'],['Sương giáng','suong-giang'],
  ['Lập đông','lap-dong'],['Tiểu tuyết','tieu-tuyet'],['Đại tuyết','dai-tuyet'],
  ['Đông chí','dong-chi'],['Tiểu hàn','tieu-han'],['Đại hàn','dai-han'],
  ['Lập xuân','lap-xuan'],['Vũ thủy','vu-thuy'],['Kinh trập','kinh-trap']
];
