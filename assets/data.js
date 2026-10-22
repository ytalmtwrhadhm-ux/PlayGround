/* ============================================================
   المدرّج — بيانات تجريبية للتطبيق
   ============================================================ */

const TEAMS = {
  rma:    { id:'rma',    name:'ريال مدريد',      short:'ريال مدريد',    abbr:'RMA', c1:'#f7f8ff', c2:'#c9a94f', ink:'#17203a' },
  mci:    { id:'mci',    name:'مانشستر سيتي',    short:'مان سيتي',      abbr:'MCI', c1:'#7cc0ee', c2:'#1d2f63', ink:'#ffffff' },
  hilal:  { id:'hilal',  name:'الهلال',          short:'الهلال',        abbr:'HIL', c1:'#2f8bff', c2:'#043b8d', ink:'#ffffff' },
  nasr:   { id:'nasr',   name:'النصر',           short:'النصر',         abbr:'NSR', c1:'#f6d565', c2:'#b8890c', ink:'#2a2100' },
  bar:    { id:'bar',    name:'برشلونة',         short:'برشلونة',       abbr:'BAR', c1:'#b4004e', c2:'#00458f', ink:'#ffffff' },
  atm:    { id:'atm',    name:'أتلتيكو مدريد',   short:'أتلتيكو',       abbr:'ATM', c1:'#d33a2a', c2:'#7a1a10', ink:'#ffffff' },
  liv:    { id:'liv',    name:'ليفربول',         short:'ليفربول',       abbr:'LIV', c1:'#d21c3a', c2:'#750818', ink:'#ffffff' },
  ars:    { id:'ars',    name:'أرسنال',          short:'أرسنال',        abbr:'ARS', c1:'#f21d26', c2:'#83060a', ink:'#ffffff' },
  bay:    { id:'bay',    name:'بايرن ميونخ',     short:'بايرن',         abbr:'BAY', c1:'#e5143c', c2:'#7c041b', ink:'#ffffff' },
  psg:    { id:'psg',    name:'باريس سان جيرمان',short:'باريس',         abbr:'PSG', c1:'#1a5a94', c2:'#061c36', ink:'#ffffff' },
  ahli:   { id:'ahli',   name:'الأهلي',          short:'الأهلي',        abbr:'AHL', c1:'#18c07a', c2:'#075f3a', ink:'#ffffff' },
  ittihad:{ id:'ittihad',name:'الاتحاد',         short:'الاتحاد',       abbr:'ITT', c1:'#f9c80e', c2:'#a87d04', ink:'#2a2100' },
  int:    { id:'int',    name:'إنتر ميلان',      short:'إنتر',          abbr:'INT', c1:'#2b8dda', c2:'#032f55', ink:'#ffffff' },
  juv:    { id:'juv',    name:'يوفنتوس',         short:'يوفنتوس',       abbr:'JUV', c1:'#f2f2f2', c2:'#151515', ink:'#111111' },
  che:    { id:'che',    name:'تشيلسي',          short:'تشيلسي',        abbr:'CHE', c1:'#1a63b8', c2:'#031c3b', ink:'#ffffff' },
  tot:    { id:'tot',    name:'توتنهام',         short:'توتنهام',       abbr:'TOT', c1:'#2c4480', c2:'#0a1231', ink:'#ffffff' },
  mun:    { id:'mun',    name:'مانشستر يونايتد', short:'مان يونايتد',   abbr:'MUN', c1:'#e02b2b', c2:'#6d0a0a', ink:'#ffffff' },
  new:    { id:'new',    name:'نيوكاسل يونايتد', short:'نيوكاسل',       abbr:'NEW', c1:'#d8d8d8', c2:'#151515', ink:'#111111' },
  rso:    { id:'rso',    name:'ريال سوسيداد',    short:'سوسيداد',       abbr:'RSO', c1:'#2a6fd6', c2:'#0b2e63', ink:'#ffffff' },
  sev:    { id:'sev',    name:'إشبيلية',         short:'إشبيلية',       abbr:'SEV', c1:'#e8e8e8', c2:'#b01c2e', ink:'#5c0a14' }
};

const LEAGUES = {
  ucl:    { id:'ucl',    name:'دوري أبطال أوروبا', abbr:'UCL', c1:'#2b3ea0', c2:'#0a154d', country:'أوروبا' },
  epl:    { id:'epl',    name:'الدوري الإنجليزي',  abbr:'EPL', c1:'#4a2166', c2:'#210d31', country:'إنجلترا' },
  laliga: { id:'laliga', name:'الدوري الإسباني',   abbr:'LL',  c1:'#e0453d', c2:'#6e110d', country:'إسبانيا' },
  saudi:  { id:'saudi',  name:'دوري روشن السعودي', abbr:'RSL', c1:'#13955b', c2:'#043d25', country:'السعودية' }
};

const STANDINGS = {
  ucl: [
    { team:'rma', p:28, w:21, d:5, l:2, gf:62, ga:24, pts:68 },
    { team:'mci', p:28, w:20, d:5, l:3, gf:71, ga:29, pts:65 },
    { team:'bay', p:28, w:19, d:4, l:5, gf:74, ga:31, pts:61 },
    { team:'psg', p:28, w:17, d:6, l:5, gf:56, ga:30, pts:57 },
    { team:'int', p:28, w:16, d:7, l:5, gf:48, ga:27, pts:55 },
    { team:'ars', p:28, w:15, d:8, l:5, gf:52, ga:33, pts:53 }
  ],
  epl: [
    { team:'liv', p:29, w:22, d:5, l:2, gf:68, ga:26, pts:71 },
    { team:'ars', p:29, w:21, d:5, l:3, gf:63, ga:25, pts:68 },
    { team:'mci', p:29, w:19, d:6, l:4, gf:66, ga:30, pts:63 },
    { team:'che', p:29, w:16, d:7, l:6, gf:54, ga:35, pts:55 },
    { team:'tot', p:29, w:13, d:6, l:10, gf:49, ga:42, pts:45 },
    { team:'mun', p:29, w:12, d:7, l:10, gf:43, ga:41, pts:43 }
  ],
  laliga: [
    { team:'rma', p:28, w:22, d:4, l:2, gf:61, ga:22, pts:70 },
    { team:'bar', p:28, w:20, d:5, l:3, gf:67, ga:31, pts:65 },
    { team:'atm', p:28, w:17, d:7, l:4, gf:49, ga:25, pts:58 },
    { team:'rso', p:28, w:12, d:8, l:8, gf:38, ga:35, pts:44 }
  ],
  saudi: [
    { team:'hilal', p:26, w:21, d:4, l:1, gf:66, ga:20, pts:67 },
    { team:'ittihad', p:26, w:19, d:5, l:2, gf:58, ga:24, pts:62 },
    { team:'nasr', p:26, w:17, d:5, l:4, gf:61, ga:30, pts:56 },
    { team:'ahli', p:26, w:15, d:6, l:5, gf:52, ga:31, pts:51 }
  ]
};

const MATCHES = [
  {
    id:'rma-mci', home:'rma', away:'mci', league:'ucl', round:'ربع النهائي · ذهاب',
    status:'live', minute:63, score:[2,1], quality:'4K HDR', channel:'beIN 1',
    venue:'سانتياغو برنابيو', city:'مدريد', referee:'دانييلي أورساتو',
    attendance:'78,432', weather:'16° صافٍ', featured:true, viewers:'1.8M',
    kickoff:'22:00', dateLabel:'الليلة',
    events:[
      { minute:12, type:'goal',   team:'home', player:'فينيسيوس جونيور', detail:'كرة عرضية من الجهة اليسرى تسكن الشباك', assist:'جود بيلينغهام', score:[1,0] },
      { minute:27, type:'goal',   team:'away', player:'إرلينغ هالاند', detail:'تسديدة قوية من داخل المنطقة', assist:'كيفن دي بروين', score:[1,1] },
      { minute:38, type:'yellow', team:'home', player:'أنطونيو روديغر', detail:'تدخل متأخر على هالاند' },
      { minute:45, added:2, type:'goal', team:'home', player:'كيليان مبابي', detail:'متابعة ذكية لكرة مرتدة', assist:'فينيسيوس جونيور', score:[2,1] },
      { minute:51, type:'yellow', team:'away', player:'ماتيو كوفاتشيتش', detail:'عرقلة بيلينغهام في منتصف الملعب' },
      { minute:58, type:'red',    team:'home', player:'داني كارفاخال', detail:'إيقاف انطلاقة فودين كآخر مدافع' },
      { minute:60, type:'sub',    team:'home', player:'لوكا مودريتش', detail:'بدلاً من أوريلين تشواميني' },
      { minute:62, type:'yellow', team:'home', player:'فيدي فالفيردي', detail:'اعتراض على قرار الحكم' }
    ],
    commentary:[
      { minute:63, text:'ريال مدريد يعيد ترتيب أوراقه بعد الطرد، وفالفيردي ينتقل للظهير الأيمن.' },
      { minute:61, text:'كرة عرضية خطيرة من فودين تمر أمام هالاند دون أي متابعة.' },
      { minute:59, text:'أنشيلوتي يطلب من لاعبيه تقليل المساحات والاعتماد على الهجمات المرتدة.' },
      { minute:58, text:'طرد مباشر! كارفاخال يوقف انطلاقة فودين وريال مدريد بعشرة لاعبين.' },
      { minute:52, text:'إنذار لكوفاتشيتش بعد تدخل على بيلينغهام في منتصف الملعب.' },
      { minute:46, text:'انطلاق الشوط الثاني في سانتياغو برنابيو وسط أجواء جماهيرية رائعة.' }
    ],
    future:[
      { minute:67, type:'yellow', team:'away', player:'فيل فودين', detail:'تدخل متأخر على فالفيردي' },
      { minute:74, type:'goal',   team:'away', player:'إرلينغ هالاند', detail:'رأسية من عرضية برناردو سيلفا', assist:'برناردو سيلفا', score:[2,2] },
      { minute:82, type:'goal',   team:'home', player:'فينيسيوس جونيور', detail:'انطلاقة من منتصف الملعب وتسديدة زاحفة', assist:'كيليان مبابي', score:[3,2] },
      { minute:88, type:'red',    team:'away', player:'ماتيو كوفاتشيتش', detail:'إنذار ثانٍ بعد عرقلة مبابي' },
      { minute:90, type:'end',    team:'home', player:'', detail:'نهاية المباراة' }
    ],
    stats:{ possession:[54,46], shots:[12,9], onTarget:[6,4], xg:[1.84,1.21], corners:[5,3], fouls:[9,11], passes:[412,388], passAcc:[89,91], offsides:[2,1], saves:[3,4] },
    shotsMap:[
      {x:78,y:20,team:'home',goal:true},{x:70,y:33,team:'home',goal:true},{x:63,y:26,team:'home',goal:false},
      {x:80,y:45,team:'home',goal:false},{x:58,y:38,team:'home',goal:false},{x:72,y:52,team:'home',goal:true},
      {x:24,y:28,team:'away',goal:true},{x:33,y:40,team:'away',goal:false},{x:28,y:18,team:'away',goal:false},
      {x:41,y:48,team:'away',goal:false},{x:19,y:36,team:'away',goal:false},{x:36,y:22,team:'away',goal:false}
    ],
    winProb:[57,43], h2h:{home:2,draw:1,away:2}, poll:[54,14,32],
    form:{ home:['W','W','D','W','W'], away:['W','L','W','W','D'] },
    lineups:{
      home:{
        formation:'4-3-3', coach:'كارلو أنشيلوتي',
        players:[
          { n:1,  name:'كورتوا',      full:'تيبو كورتوا',        pos:'GK', rating:7.1, x:50, y:93 },
          { n:2,  name:'كارفاخال',    full:'داني كارفاخال',      pos:'RB', rating:7.2, x:84, y:75 },
          { n:22, name:'روديغر',      full:'أنطونيو روديغر',     pos:'CB', rating:6.9, x:63, y:78 },
          { n:3,  name:'ميليتاو',     full:'إيدير ميليتاو',      pos:'CB', rating:6.8, x:37, y:78 },
          { n:23, name:'ميندي',       full:'فيرلاند ميندي',      pos:'LB', rating:6.9, x:16, y:75 },
          { n:8,  name:'فالفيردي',    full:'فيدي فالفيردي',      pos:'CM', rating:7.3, x:72, y:55 },
          { n:18, name:'تشواميني',    full:'أوريلين تشواميني',   pos:'DM', rating:6.7, x:50, y:59 },
          { n:5,  name:'بيلينغهام',   full:'جود بيلينغهام',      pos:'CM', rating:8.1, x:28, y:55 },
          { n:11, name:'رودريغو',     full:'رودريغو',            pos:'RW', rating:7.2, x:80, y:33 },
          { n:9,  name:'مبابي',       full:'كيليان مبابي',       pos:'ST', rating:8.4, x:50, y:26 },
          { n:7,  name:'فينيسيوس',    full:'فينيسيوس جونيور',    pos:'LW', rating:8.7, x:20, y:33 }
        ],
        bench:[
          { n:13, name:'لونين', full:'أندري لونين', pos:'GK', rating:6.4 },
          { n:4,  name:'ألابا', full:'دافيد ألابا', pos:'DF', rating:6.6 },
          { n:17, name:'فاسكيز', full:'لوكاس فاسكيز', pos:'DF', rating:6.3 },
          { n:6,  name:'كامافينغا', full:'إدواردو كامافينغا', pos:'MF', rating:6.8 },
          { n:10, name:'مودريتش', full:'لوكا مودريتش', pos:'MF', rating:7.0 },
          { n:19, name:'سيبايوس', full:'داني سيبايوس', pos:'MF', rating:6.5 },
          { n:16, name:'إندريك', full:'إندريك فيليبي', pos:'FW', rating:6.2 },
          { n:21, name:'براهيم', full:'براهيم دياز', pos:'FW', rating:6.7 },
          { n:15, name:'غولر', full:'أردا غولر', pos:'MF', rating:6.4 }
        ]
      },
      away:{
        formation:'4-2-3-1', coach:'بيب غوارديولا',
        players:[
          { n:31, name:'إيدرسون',    full:'إيدرسون مورايس',     pos:'GK', rating:6.9, x:50, y:7 },
          { n:2,  name:'ووكر',       full:'كايل ووكر',          pos:'RB', rating:6.5, x:84, y:26 },
          { n:3,  name:'دياز',       full:'روبن دياز',          pos:'CB', rating:7.2, x:64, y:22 },
          { n:25, name:'أكانجي',     full:'مانويل أكانجي',      pos:'CB', rating:6.6, x:36, y:22 },
          { n:24, name:'غفارديول',   full:'يوشكو غفارديول',     pos:'LB', rating:6.8, x:16, y:26 },
          { n:16, name:'رودري',      full:'رودري',              pos:'DM', rating:7.5, x:62, y:48 },
          { n:8,  name:'كوفاتشيتش',  full:'ماتيو كوفاتشيتش',    pos:'DM', rating:6.9, x:38, y:48 },
          { n:20, name:'برناردو',    full:'برناردو سيلفا',      pos:'RW', rating:7.1, x:80, y:64 },
          { n:17, name:'دي بروين',   full:'كيفن دي بروين',      pos:'AM', rating:7.8, x:50, y:66 },
          { n:47, name:'فودين',      full:'فيل فودين',          pos:'LW', rating:7.4, x:20, y:64 },
          { n:9,  name:'هالاند',     full:'إرلينغ هالاند',      pos:'ST', rating:8.2, x:50, y:80 }
        ],
        bench:[
          { n:18, name:'أورتيغا', full:'ستيفان أورتيغا', pos:'GK', rating:6.3 },
          { n:5,  name:'ستونز', full:'جون ستونز', pos:'DF', rating:6.6 },
          { n:6,  name:'أكي', full:'ناثان أكي', pos:'DF', rating:6.4 },
          { n:82, name:'لويس', full:'ريكو لويس', pos:'MF', rating:6.5 },
          { n:19, name:'غوندوغان', full:'إلكاي غوندوغان', pos:'MF', rating:6.9 },
          { n:10, name:'غريليش', full:'جاك غريليش', pos:'FW', rating:6.8 },
          { n:11, name:'دوكو', full:'جيريمي دوكو', pos:'FW', rating:6.7 },
          { n:26, name:'سافينيو', full:'سافينيو', pos:'FW', rating:6.6 },
          { n:27, name:'نونيز', full:'ماتيوس نونيز', pos:'MF', rating:6.4 }
        ]
      }
    }
  },
  {
    id:'hilal-nasr', home:'hilal', away:'nasr', league:'saudi', round:'الجولة 27 · ديربي الرياض',
    status:'live', minute:71, score:[2,1], quality:'4K', channel:'SSC 1',
    venue:'المملكة أرينا', city:'الرياض', referee:'محمد الهويش',
    attendance:'25,000', weather:'24° صافٍ', featured:false, viewers:'940K',
    kickoff:'20:00', dateLabel:'الليلة',
    events:[
      { minute:9,  type:'goal',   team:'home', player:'ألكسندر ميتروفيتش', detail:'رأسية قوية من عرضية سالم الدوسري', assist:'سالم الدوسري', score:[1,0] },
      { minute:23, type:'goal',   team:'away', player:'كريستيانو رونالدو', detail:'تسديدة من حدود المنطقة', assist:'أوتافيو', score:[1,1] },
      { minute:37, type:'yellow', team:'away', player:'علي لاجامي', detail:'عرقلة مالكوم على الجهة اليسرى' },
      { minute:44, type:'goal',   team:'home', player:'مالكوم', detail:'تسديدة زاحفة داخل الزاوية', assist:'ماركوس ليوناردو', score:[2,1] },
      { minute:55, type:'yellow', team:'home', player:'محمد كنو', detail:'تدخل في منتصف الملعب' },
      { minute:63, type:'sub',    team:'home', player:'سلمان الفرج', detail:'بدلاً من روبن نيفيش' },
      { minute:68, type:'yellow', team:'away', player:'بروزوفيتش', detail:'اعتراض على قرار الحكم' }
    ],
    commentary:[
      { minute:71, text:'الهلال يحاول قتل المباراة بالاستحواذ، والنصر يبحث عن كرة المرتدات.' },
      { minute:69, text:'رونالدو يطالب بركلة جزاء بعد تداخل مع كوليبالي، والحكم يرفض.' },
      { minute:64, text:'سلمان الفرج يدخل مكان نيفيش لزيادة السيطرة في المنتصف.' }
    ],
    future:[],
    stats:{ possession:[57,43], shots:[14,8], onTarget:[7,3], xg:[1.92,0.96], corners:[6,2], fouls:[8,12], passes:[448,351], passAcc:[90,84], offsides:[1,3], saves:[2,5] },
    shotsMap:[
      {x:76,y:24,team:'home',goal:true},{x:68,y:40,team:'home',goal:true},{x:60,y:30,team:'home',goal:false},
      {x:82,y:36,team:'home',goal:false},{x:55,y:44,team:'home',goal:false},
      {x:26,y:30,team:'away',goal:true},{x:34,y:22,team:'away',goal:false},{x:30,y:44,team:'away',goal:false}
    ],
    winProb:[72,28], h2h:{home:3,draw:1,away:1}, poll:[61,18,21],
    form:{ home:['W','W','W','D','W'], away:['W','W','L','W','W'] },
    lineups:{
      home:{
        formation:'4-2-3-1', coach:'جورجي جيسوس',
        players:[
          { n:1,  name:'بونو',       full:'ياسين بونو',        pos:'GK', rating:7.3, x:50, y:93 },
          { n:20, name:'كانسيلو',    full:'جواو كانسيلو',     pos:'RB', rating:7.5, x:84, y:74 },
          { n:3,  name:'كوليبالي',   full:'كاليدو كوليبالي',  pos:'CB', rating:7.4, x:63, y:78 },
          { n:5,  name:'البليهي',    full:'علي البليهي',      pos:'CB', rating:7.0, x:36, y:78 },
          { n:6,  name:'لودي',       full:'رينان لودي',       pos:'LB', rating:7.2, x:16, y:74 },
          { n:8,  name:'نيفيش',      full:'روبن نيفيش',       pos:'DM', rating:7.1, x:62, y:58 },
          { n:28, name:'كنو',        full:'محمد كنو',         pos:'DM', rating:6.9, x:38, y:58 },
          { n:29, name:'الدوسري',    full:'سالم الدوسري',     pos:'RW', rating:8.1, x:80, y:42 },
          { n:10, name:'ليوناردو',   full:'ماركوس ليوناردو',  pos:'AM', rating:7.8, x:50, y:44 },
          { n:15, name:'مالكوم',     full:'مالكوم',           pos:'LW', rating:8.3, x:20, y:42 },
          { n:9,  name:'ميتروفيتش',  full:'ألكسندر ميتروفيتش',pos:'ST', rating:8.2, x:50, y:26 }
        ],
        bench:[
          { n:21, name:'العويس', full:'محمد العويس', pos:'GK', rating:6.4 },
          { n:12, name:'الجهني', full:'ياسر الجهني', pos:'DF', rating:6.3 },
          { n:4,  name:'خليفة', full:'خليفة الدوسري', pos:'DF', rating:6.5 },
          { n:16, name:'ناصر', full:'ناصر الدوسري', pos:'MF', rating:6.6 },
          { n:7,  name:'سلمان', full:'سلمان الفرج', pos:'MF', rating:6.9 },
          { n:11, name:'الحمدان', full:'عبدالله الحمدان', pos:'FW', rating:6.5 },
          { n:27, name:'اليامي', full:'حمد اليامي', pos:'DF', rating:6.2 },
          { n:66, name:'القحطاني', full:'محمد القحطاني', pos:'FW', rating:6.2 },
          { n:19, name:'ميشيل', full:'ميشيل ديلغادو', pos:'MF', rating:6.4 }
        ]
      },
      away:{
        formation:'4-3-3', coach:'لويس كاسترو',
        players:[
          { n:1,  name:'بينتو',      full:'بينتو',              pos:'GK', rating:6.8, x:50, y:7 },
          { n:12, name:'الغنام',     full:'سلطان الغنام',       pos:'RB', rating:6.9, x:84, y:26 },
          { n:5,  name:'سيماكان',    full:'محمد سيماكان',      pos:'CB', rating:7.0, x:63, y:22 },
          { n:78, name:'لاجامي',     full:'علي لاجامي',        pos:'CB', rating:6.4, x:37, y:22 },
          { n:24, name:'بوشال',      full:'نواف بوشال',        pos:'LB', rating:6.7, x:16, y:26 },
          { n:11, name:'أوتافيو',    full:'أوتافيو',           pos:'CM', rating:7.2, x:70, y:48 },
          { n:17, name:'الخيبري',    full:'عبدالله الخيبري',   pos:'DM', rating:6.8, x:50, y:52 },
          { n:8,  name:'بروزوفيتش',  full:'مارسيلو بروزوفيتش', pos:'CM', rating:7.1, x:30, y:48 },
          { n:29, name:'غابرييل',    full:'أنجيلو غابرييل',    pos:'RW', rating:7.4, x:80, y:70 },
          { n:7,  name:'رونالدو',    full:'كريستيانو رونالدو', pos:'ST', rating:8.0, x:50, y:78 },
          { n:10, name:'ماني',       full:'ساديو ماني',        pos:'LW', rating:7.5, x:20, y:70 }
        ],
        bench:[
          { n:22, name:'وليد', full:'وليد عبدالله', pos:'GK', rating:6.2 },
          { n:4,  name:'العمري', full:'عبدالإله العمري', pos:'DF', rating:6.4 },
          { n:6,  name:'الحسن', full:'علي الحسن', pos:'MF', rating:6.3 },
          { n:14, name:'النجعي', full:'سامي النجعي', pos:'MF', rating:6.5 },
          { n:26, name:'الصليهم', full:'عبدالمجيد الصليهم', pos:'MF', rating:6.4 },
          { n:19, name:'يحيى', full:'أيمن يحيى', pos:'FW', rating:6.3 },
          { n:9,  name:'مران', full:'محمد مران', pos:'FW', rating:6.4 },
          { n:15, name:'غريب', full:'عبدالرحمن غريب', pos:'FW', rating:6.2 },
          { n:30, name:'الناصر', full:'سعد الناصر', pos:'MF', rating:6.1 }
        ]
      }
    }
  },
  {
    id:'bar-atm', home:'bar', away:'atm', league:'laliga', round:'الجولة 29',
    status:'live', minute:34, score:[0,0], quality:'1080p HDR', channel:'LaLiga TV',
    venue:'إستادي أولمبيك لويس كومبانيس', city:'برشلونة', referee:'خيسوس خيل مانزانو',
    attendance:'49,870', weather:'19° غائم جزئياً', featured:false, viewers:'610K',
    kickoff:'21:00', dateLabel:'الليلة',
    events:[
      { minute:18, type:'yellow', team:'away', player:'رودريغو دي بول', detail:'عرقلة بيدري' },
      { minute:29, type:'yellow', team:'home', player:'غافي', detail:'تدخل قوي في منتصف الملعب' }
    ],
    commentary:[
      { minute:34, text:'برشلونة يستحوذ لكن أتلتيكو متماسك دفاعياً حتى الآن.' },
      { minute:31, text:'فرصة خطيرة! رافينيا يسدد من حافة المنطقة وتمر بجانب القائم.' }
    ],
    future:[],
    stats:{ possession:[63,37], shots:[7,3], onTarget:[2,1], xg:[0.74,0.31], corners:[4,1], fouls:[5,7], passes:[287,168], passAcc:[91,82], offsides:[1,0], saves:[1,2] },
    shotsMap:[
      {x:74,y:28,team:'home',goal:false},{x:66,y:40,team:'home',goal:false},{x:81,y:35,team:'home',goal:false},
      {x:29,y:31,team:'away',goal:false}
    ],
    winProb:[61,39], h2h:{home:3,draw:1,away:1}, poll:[58,22,20],
    form:{ home:['W','D','W','W','L'], away:['D','W','W','L','D'] },
    lineups:{
      home:{
        formation:'4-3-3', coach:'هانسي فليك',
        players:[
          { n:1,  name:'تير شتيغن', full:'مارك أندريه تير شتيغن', pos:'GK', rating:7.0, x:50, y:93 },
          { n:23, name:'كوندي',     full:'جول كوندي',        pos:'RB', rating:7.1, x:84, y:75 },
          { n:2,  name:'كوبارسي',   full:'باو كوبارسي',      pos:'CB', rating:7.2, x:63, y:78 },
          { n:5,  name:'إينيغو',    full:'إينيغو مارتينيز',  pos:'CB', rating:6.9, x:37, y:78 },
          { n:3,  name:'بالدي',     full:'أليخاندرو بالدي',  pos:'LB', rating:7.0, x:16, y:75 },
          { n:21, name:'دي يونغ',   full:'فرينكي دي يونغ',   pos:'CM', rating:7.3, x:70, y:56 },
          { n:8,  name:'بيدري',     full:'بيدري',            pos:'CM', rating:7.6, x:50, y:60 },
          { n:6,  name:'غافي',      full:'غافي',             pos:'CM', rating:7.0, x:30, y:56 },
          { n:19, name:'يامال',     full:'لامين يامال',      pos:'RW', rating:8.0, x:80, y:33 },
          { n:9,  name:'لواندوفسكي',full:'روبرت لواندوفسكي', pos:'ST', rating:7.4, x:50, y:26 },
          { n:11, name:'رافينيا',   full:'رافينيا',          pos:'LW', rating:7.8, x:20, y:33 }
        ],
        bench:[
          { n:13, name:'بينيا', full:'إينياكي بينيا', pos:'GK', rating:6.3 },
          { n:15, name:'كريستنسن', full:'أندرياس كريستنسن', pos:'DF', rating:6.5 },
          { n:24, name:'إريك', full:'إريك غارسيا', pos:'DF', rating:6.4 },
          { n:17, name:'كاسادو', full:'مارك كاسادو', pos:'MF', rating:6.5 },
          { n:20, name:'أولمو', full:'داني أولمو', pos:'MF', rating:6.8 },
          { n:16, name:'فيرمين', full:'فيرمين لوبيز', pos:'MF', rating:6.4 },
          { n:7,  name:'فيران', full:'فيران توريس', pos:'FW', rating:6.7 },
          { n:18, name:'باو فيكتور', full:'باو فيكتور', pos:'FW', rating:6.3 },
          { n:10, name:'أنسو', full:'أنسو فاتي', pos:'FW', rating:6.2 }
        ]
      },
      away:{
        formation:'4-4-2', coach:'دييغو سيميوني',
        players:[
          { n:13, name:'أوبلاك',    full:'يان أوبلاك',        pos:'GK', rating:7.4, x:50, y:7 },
          { n:16, name:'مولينا',    full:'ناهويل مولينا',     pos:'RB', rating:6.8, x:84, y:26 },
          { n:2,  name:'خيمينيز',   full:'خوسيه خيمينيز',     pos:'CB', rating:7.1, x:63, y:22 },
          { n:24, name:'لو نورمان', full:'روبن لو نورمان',    pos:'CB', rating:6.9, x:37, y:22 },
          { n:21, name:'غالان',     full:'خافي غالان',        pos:'LB', rating:6.7, x:16, y:26 },
          { n:14, name:'يورينتي',   full:'ماركوس يورينتي',    pos:'RM', rating:6.9, x:80, y:48 },
          { n:5,  name:'دي بول',    full:'رودريغو دي بول',    pos:'CM', rating:7.2, x:60, y:52 },
          { n:6,  name:'كوكي',      full:'كوكي',              pos:'CM', rating:7.0, x:40, y:52 },
          { n:12, name:'ريلم',      full:'صموئيل لينو',       pos:'LM', rating:6.6, x:20, y:48 },
          { n:7,  name:'غريزمان',   full:'أنطوان غريزمان',    pos:'ST', rating:7.6, x:62, y:74 },
          { n:19, name:'ألفاريز',   full:'خوليان ألفاريز',    pos:'ST', rating:7.5, x:38, y:76 }
        ],
        bench:[
          { n:1,  name:'موسو', full:'خوان موسو', pos:'GK', rating:6.2 },
          { n:15, name:'سافيتش', full:'ستيفان سافيتش', pos:'DF', rating:6.4 },
          { n:23, name:'رينيلدو', full:'رينيلدو', pos:'DF', rating:6.3 },
          { n:8,  name:'باريوس', full:'بابلو باريوس', pos:'MF', rating:6.5 },
          { n:11, name:'ليميتش', full:'توماس ليميتش', pos:'MF', rating:6.4 },
          { n:10, name:'كوريا', full:'أنخيل كوريا', pos:'FW', rating:6.6 },
          { n:9,  name:'سورلوث', full:'ألكسندر سورلوث', pos:'FW', rating:6.5 },
          { n:17, name:'ري克尔梅', full:'رودريغو ريكلمي', pos:'FW', rating:6.2 },
          { n:20, name:'ويتسل', full:'أكسيل ويتسل', pos:'MF', rating:6.3 }
        ]
      }
    }
  },
  {
    id:'liv-ars', home:'liv', away:'ars', league:'epl', round:'الجولة 30 · قمة الصدارة',
    status:'upcoming', minute:0, score:[0,0], quality:'4K HDR', channel:'Sky Sports',
    venue:'أنفيلد', city:'ليفربول', referee:'مايكل أوليفر',
    attendance:'61,276', weather:'13° ممطر خفيف', featured:false, viewers:'—',
    kickoff:'21:00', dateLabel:'اليوم', startIn:95,
    events:[], commentary:[], future:[],
    stats:null, shotsMap:[],
    winProb:[46,54], h2h:{home:3,draw:2,away:2}, poll:[45,25,30],
    form:{ home:['W','W','W','D','W'], away:['W','W','D','W','W'] },
    lineups:null
  },
  {
    id:'bay-psg', home:'bay', away:'psg', league:'ucl', round:'ربع النهائي · ذهاب',
    status:'upcoming', minute:0, score:[0,0], quality:'4K HDR', channel:'beIN 2',
    venue:'أليانز أرينا', city:'ميونخ', referee:'أنتوني تايلور',
    attendance:'75,000', weather:'11° صافٍ', featured:false, viewers:'—',
    kickoff:'22:00', dateLabel:'غداً', startIn:1495,
    events:[], commentary:[], future:[],
    stats:null, shotsMap:[],
    winProb:[52,48], h2h:{home:2,draw:1,away:3}, poll:[50,20,30],
    form:{ home:['W','W','W','W','D'], away:['L','W','W','D','W'] },
    lineups:null
  },
  {
    id:'ahli-ittihad', home:'ahli', away:'ittihad', league:'saudi', round:'الجولة 27',
    status:'upcoming', minute:0, score:[0,0], quality:'4K', channel:'SSC 2',
    venue:'ملعب الإنماء', city:'جدة', referee:'ماجد الشمراني',
    attendance:'20,000', weather:'27° صافٍ', featured:false, viewers:'—',
    kickoff:'20:00', dateLabel:'غداً', startIn:1435,
    events:[], commentary:[], future:[],
    stats:null, shotsMap:[],
    winProb:[44,56], h2h:{home:1,draw:2,away:3}, poll:[38,24,38],
    form:{ home:['W','L','W','D','W'], away:['W','W','W','D','L'] },
    lineups:null
  },
  {
    id:'int-juv', home:'int', away:'juv', league:'ucl', round:'ربع النهائي · ذهاب',
    status:'finished', minute:90, score:[2,1], quality:'4K', channel:'beIN 3',
    venue:'سان سيرو', city:'ميلانو', referee:'كليمان توربان',
    attendance:'72,300', weather:'14° صافٍ', featured:false, viewers:'—',
    kickoff:'19:00', dateLabel:'أمس',
    events:[
      { minute:22, type:'goal', team:'home', player:'لاوتارو مارتينيز', detail:'تسديدة من داخل المنطقة', score:[1,0] },
      { minute:54, type:'goal', team:'away', player:'دوسان فلاهوفيتش', detail:'ركلة جزاء', score:[1,1] },
      { minute:78, type:'goal', team:'home', player:'ماركوس تورام', detail:'هجمة مرتدة سريعة', score:[2,1] },
      { minute:84, type:'yellow', team:'away', player:'مانويل لوكاتيلي', detail:'تدخل متأخر' }
    ],
    commentary:[], future:[],
    stats:{ possession:[51,49], shots:[13,10], onTarget:[6,4], xg:[1.62,1.05], corners:[4,5], fouls:[12,14], passes:[402,391], passAcc:[87,86], offsides:[2,1], saves:[3,4] },
    shotsMap:[], winProb:[55,45], h2h:{home:2,draw:2,away:2}, poll:[48,27,25],
    form:{ home:['W','D','W','L','W'], away:['D','W','L','W','D'] },
    lineups:null
  },
  {
    id:'che-tot', home:'che', away:'tot', league:'epl', round:'الجولة 29',
    status:'finished', minute:90, score:[1,3], quality:'1080p', channel:'Sky Sports 2',
    venue:'ستامفورد بريدج', city:'لندن', referee:'أندرو مادلي',
    attendance:'39,870', weather:'12° غائم', featured:false, viewers:'—',
    kickoff:'18:30', dateLabel:'أمس',
    events:[
      { minute:9,  type:'goal', team:'away', player:'سون هيونغ مين', detail:'تسديدة من الجهة اليسرى', score:[0,1] },
      { minute:35, type:'goal', team:'home', player:'كول بالمر', detail:'ركلة جزاء', score:[1,1] },
      { minute:61, type:'goal', team:'away', player:'جيمس ماديسون', detail:'تسديدة بعيدة', score:[1,2] },
      { minute:73, type:'yellow', team:'home', player:'موسيس كايسيدو', detail:'إيقاف هجمة' },
      { minute:88, type:'goal', team:'away', player:'دومينيك سولانكي', detail:'رأسية', score:[1,3] }
    ],
    commentary:[], future:[],
    stats:{ possession:[58,42], shots:[16,9], onTarget:[4,6], xg:[1.44,1.71], corners:[7,3], fouls:[10,8], passes:[451,341], passAcc:[88,83], offsides:[1,2], saves:[2,3] },
    shotsMap:[], winProb:[52,48], h2h:{home:2,draw:1,away:2}, poll:[44,26,30],
    form:{ home:['L','W','D','W','L'], away:['W','W','L','W','W'] },
    lineups:null
  }
];

const STARS = [
  { name:'فينيسيوس جونيور', team:'rma', rating:8.7, goals:18, assists:11, tag:'جناح' },
  { name:'إرلينغ هالاند',   team:'mci', rating:8.2, goals:26, assists:5,  tag:'مهاجم' },
  { name:'لامين يامال',     team:'bar', rating:8.0, goals:14, assists:15, tag:'جناح' },
  { name:'كيليان مبابي',    team:'rma', rating:8.4, goals:24, assists:7,  tag:'مهاجم' },
  { name:'كريستيانو رونالدو',team:'nasr',rating:8.0, goals:23, assists:4, tag:'مهاجم' },
  { name:'سالم الدوسري',    team:'hilal',rating:8.1, goals:12, assists:13, tag:'جناح' }
];

window.APP_DATA = { TEAMS, LEAGUES, STANDINGS, MATCHES, STARS };
