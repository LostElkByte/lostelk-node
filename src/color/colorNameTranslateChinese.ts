const colorNameTranslateChinese = colorName => {
  let chineseColorName: Array<string>;
  switch (colorName) {
    case 'black':
      chineseColorName = ['黑色'];
      break;
    case 'silver':
      chineseColorName = ['灰色', '银色', '银白色'];
      break;
    case 'gray':
      chineseColorName = ['灰色'];
      break;
    case 'white':
      chineseColorName = ['白色', '雪白色', '纯白色'];
      break;
    case 'maroon':
      chineseColorName = [
        '红色',
        '赤色',
        '褐红色',
        '栗色',
        '茶色',
        '紫褐色',
        '深红色',
      ];
      break;
    case 'red':
      chineseColorName = ['红色', '赤色'];
      break;
    case 'purple':
      chineseColorName = ['紫色', '深紫色', '红紫色'];
      break;
    case 'fuchsia':
      chineseColorName = ['紫色', '桃红色', '粉玫色', '紫粉色', '紫红色'];
      break;
    case 'green':
      chineseColorName = ['绿色', '深绿色', '草绿色'];
      break;
    case 'lime':
      chineseColorName = ['绿色', '淡绿色', '橙绿色', '荧光绿'];
      break;
    case 'olive':
      chineseColorName = [
        '橄榄色',
        '黄绿色',
        '粑粑色',
        '茶青色',
        '茶色',
        '黄褐色',
        '绿黄色',
      ];
      break;
    case 'yellow':
      chineseColorName = ['黄色', '纯黄色'];
      break;
    case 'navy':
      chineseColorName = ['蓝色', '海军蓝色', '深蓝色', '藏青色'];
      break;
    case 'blue':
      chineseColorName = ['蓝色', '天蓝色', '钴蓝色', '蔚蓝色', '纯蓝色'];
      break;
    case 'teal':
      chineseColorName = ['绿色', '水鸭色', '蓝绿色', '青绿色', '青色'];
      break;
    case 'aqua':
      chineseColorName = [
        '绿色',
        '浅绿色',
        '蓝绿色',
        '青绿色',
        '青色',
        '水绿色',
      ];
      break;
    case 'orange':
      chineseColorName = ['橙色', '橘黄色', '柑橘色'];
      break;
    case 'aliceblue':
      chineseColorName = ['蓝色', '艾丽丝蓝色', '浅蓝色', '蓝白色'];
      break;
    case 'antiquewhite':
      chineseColorName = ['白色', '肉色', '古典白色', '古董白'];
      break;
    case 'aquamarine':
      chineseColorName = ['绿色', '碧绿色', '浅绿色', '海蓝宝石色', '蓝绿色'];
      break;
    case 'azure':
      chineseColorName = ['蓝色', '蔚蓝色', '天蓝色', '浅蓝色', '天青色'];
      break;
    case 'beige':
      chineseColorName = [
        '米色',
        '浅棕色',
        '淡棕色',
        '棕色',
        '米黄色',
        '杏色',
        '灰棕色',
        '灰褐色',
      ];
      break;
    case 'bisque':
      chineseColorName = ['橘黄色', '橘色', '黄褐色', '桔黄色', '肉色', '米色'];
      break;
    case 'blanchedalmond':
      chineseColorName = ['白杏色', '杏色', '肉色', '米色'];
      break;
    case 'blueviolet':
      chineseColorName = ['紫色', '蓝紫色', '紫罗兰色'];
      break;
    case 'brown':
      chineseColorName = [
        '褐色',
        '棕色',
        '红棕色',
        '棕红色',
        '咖啡色',
        '深棕色',
        '黄褐色',
      ];
      break;
    case 'burlywood':
      chineseColorName = ['实木色', '棕色', '浅棕色'];
      break;
    case 'cadetblue':
      chineseColorName = ['蓝色', '军蓝色'];
      break;
    case 'chartreuse':
      chineseColorName = [
        '绿色',
        '黄绿色',
        '查特酒绿',
        '淡绿色',
        '黄绿色',
        '浅绿色',
      ];
      break;
    case 'chocolate':
      chineseColorName = [
        '褐色',
        '巧克力色',
        '黄褐色',
        '浅棕色',
        '橘色',
        '橘棕色',
      ];
      break;
    case 'coral':
      chineseColorName = ['橘红色', '珊瑚色', '浅橘红色', '肉粉色'];
      break;
    case 'cornflowerblue':
      chineseColorName = ['蓝色', '菊蓝色', '矢车菊蓝色', '浅蓝色', '矢车菊色'];
      break;
    case 'cornsilk':
      chineseColorName = ['金色', '玉米色', '米绸色', '黄色', '米白色'];
      break;
    case 'crimson':
      chineseColorName = ['红色', '深红色', '暗深红色', '猩红'];
      break;
    case 'cyan':
      chineseColorName = ['青色', '蓝绿色', '青蓝色', '蓝色'];
      break;
    case 'darkblue':
      chineseColorName = ['蓝色', '深蓝色', '暗蓝色', '碧蓝色'];
      break;
    case 'darkcyan':
      chineseColorName = ['青色', '深青色', '深青绿色', '青蓝色'];
      break;
    case 'darkgoldenrod':
      chineseColorName = ['暗金黄色', '暗金菊黄', '金色', '黄色'];
      break;
    case 'darkgray':
      chineseColorName = ['灰色', '深灰色', '暗灰色'];
      break;
    case 'darkgreen':
      chineseColorName = ['绿色', '深绿色', '青绿色', '碧绿', '暗绿色'];
      break;
    case 'darkgrey':
      chineseColorName = ['灰色', '深灰色', '暗灰色'];
      break;
    case 'darkkhaki':
      chineseColorName = [
        '黄色',
        '深黄色',
        '褐色',
        '暗黄褐色',
        '暗卡其色',
        '深卡其布',
      ];
      break;
    case 'darkmagenta':
      chineseColorName = ['紫色', '深紫色', '妃色', '深洋紫色'];
      break;
    case 'darkolivegreen':
      chineseColorName = [
        '绿色',
        '深橄榄绿色',
        '草绿色',
        '深绿色',
        '暗橄榄绿色',
      ];
      break;
    case 'darkorange':
      chineseColorName = [
        '橙色',
        '深橙色',
        '桔色',
        '深桔色',
        '暗橙色',
        '暗桔黄色',
      ];
      break;
    case 'darkorchid':
      chineseColorName = ['紫色', '暗紫色'];
      break;
    case 'darkred':
      chineseColorName = ['红色', '暗红色', '酒红色'];
      break;
    case 'darksalmon':
      chineseColorName = ['肉色', '暗肉色', '深鲜肉色', '深澄色', '肉粉色'];
      break;
    case 'darkseagreen':
      chineseColorName = [
        '绿色',
        '海绿色',
        '暗海蓝色',
        '暗海洋绿色',
        '深海洋绿色',
      ];
      break;
    case 'darkslateblue':
      chineseColorName = ['蓝色', '深板岩蓝', '暗灰蓝色', '蓝紫色'];
      break;
    case 'darkslategray':
      chineseColorName = ['绿色', '深绿色', '墨绿色', '灰绿色'];
      break;
    case 'darkslategrey':
      chineseColorName = ['绿色', '深绿色', '暗宝石绿色', '灰绿色'];
      break;
    case 'darkturquoise':
      chineseColorName = [
        '蓝色',
        '浅蓝色',
        '蓝绿色',
        '青色',
        '暗宝石绿色',
        '深宝石绿色',
      ];
      break;
    case 'darkviolet':
      chineseColorName = ['紫色', '深紫色', '暗紫罗兰色'];
      break;
    case 'deeppink':
      chineseColorName = ['粉色', '深粉色', '玫红色'];
      break;
    case 'deepskyblue':
      chineseColorName = ['蓝色', '天蓝色', '深天蓝色'];
      break;
    case 'dimgray':
      chineseColorName = ['灰色', '暗灰色', '深灰色'];
      break;
    case 'dimgrey':
      chineseColorName = ['灰色', '暗灰色', '深灰色'];
      break;
    case 'dodgerblue':
      chineseColorName = ['蓝色', '道奇蓝色', '闪蓝色'];
      break;
    case 'firebrick':
      chineseColorName = ['棕色', '深红色', '砖色', '红色'];
      break;
    case 'floralwhite':
      chineseColorName = ['白色', '花白色', '乳白色'];
      break;
    case 'forestgreen':
      chineseColorName = ['绿色', '森林绿'];
      break;
    case 'gainsboro':
      chineseColorName = ['灰色', '浅灰色', '亮灰色'];
      break;
    case 'ghostwhite':
      chineseColorName = ['白色', '幽灵白色', '灰白色', '白灰色'];
      break;
    case 'gold':
      chineseColorName = ['黄色', '金色', '金黄色'];
      break;
    case 'goldenrod':
      chineseColorName = ['黄色', '深黄色', '金菊黄'];
      break;
    case 'greenyellow':
      chineseColorName = ['绿色', '黄绿色', '浅绿色', '亮绿色'];
      break;
    case 'grey':
      chineseColorName = ['灰色'];
      break;
    case 'honeydew':
      chineseColorName = ['浅绿色', '淡绿色', '粉绿色', '蜜瓜色', '绿白色'];
      break;
    case 'hotpink':
      chineseColorName = ['粉色', '亮粉色', '艳粉色', '粉红色', '深粉色'];
      break;
    case 'indianred':
      chineseColorName = ['红色', '淡红色', '浅粉红色', '浅红色', '粉色'];
      break;
    case 'indigo':
      chineseColorName = ['紫色', '靛蓝色', '蓝色'];
      break;
    case 'ivory':
      chineseColorName = ['白色', '象牙白色', '乳白色'];
      break;
    case 'khaki':
      chineseColorName = ['黄色', '黄褐色', '卡其色', '浅黄褐色'];
      break;
    case 'lavender':
      chineseColorName = ['薰衣草色', '淡紫色', '紫色'];
      break;
    case 'lavenderblush':
      chineseColorName = ['粉色', '淡粉色', '浅粉色', '淡紫色', '粉紫色'];
      break;
    case 'lawngreen':
      chineseColorName = ['绿色', '亮绿色', '浅绿色', '草绿色', '淡绿色'];
      break;
    case 'lemonchiffon':
      chineseColorName = ['柠檬色', '柠檬沙色', '浅黄色'];
      break;
    case 'lightblue':
      chineseColorName = ['浅蓝色', '蓝色', '浅蓝色'];
      break;
    case 'lightcoral':
      chineseColorName = ['珊瑚色', '深粉色', '淡珊瑚色', '浅珊瑚色', '粉红色'];
      break;
    case 'lightcyan':
      chineseColorName = ['淡青色', '浅蓝色', '浅青色', '淡蓝色'];
      break;
    case 'lightgoldenrodyellow':
      chineseColorName = ['淡黄色', '浅金黄色', '浅黄色'];
      break;
    case 'lightgray':
      chineseColorName = ['灰色', '浅灰色', '亮灰色', '淡灰色'];
      break;
    case 'lightgreen':
      chineseColorName = ['绿色', '浅绿色', '淡绿色', '亮绿色'];
      break;
    case 'lightgrey':
      chineseColorName = ['灰色', '浅灰色', '亮灰色', '淡灰色'];
      break;
    case 'lightpink':
      chineseColorName = ['粉色', '浅粉色', '淡粉色'];
      break;
    case 'lightsalmon':
      chineseColorName = ['浅橙色', '肉色', '浅肉色', '浅橘色', '橘粉色'];
      break;
    case 'lightseagreen':
      chineseColorName = ['绿色', '浅绿色', '浅海洋绿', '亮海蓝色'];
      break;
    case 'lightskyblue':
      chineseColorName = ['蓝色', '浅蓝色', '浅天蓝色', '亮天蓝色'];
      break;
    case 'lightslategray':
      chineseColorName = [
        '灰色',
        '青灰色',
        '浅石板灰色',
        '亮蓝灰色',
        '亮石板灰色',
        '灰蓝色',
      ];
      break;
    case 'lightslategrey':
      chineseColorName = ['灰色', '亮蓝灰色', '灰蓝色'];
      break;
    case 'lightsteelblue':
      chineseColorName = ['蓝色', '灰色', '蓝灰色', '淡蓝色'];
      break;
    case 'lightyellow':
      chineseColorName = ['黄色', '鹅黄色', '浅黄色', '亮黄色'];
      break;
    case 'limegreen':
      chineseColorName = ['绿色', '暗绿色', '浅绿色'];
      break;
    case 'linen':
      chineseColorName = ['浅粉色', '亚麻色', '米色', '肉色'];
      break;
    case 'magenta':
      chineseColorName = ['洋红色', '紫红色', '红紫色'];
      break;
    case 'mediumaquamarine':
      chineseColorName = ['绿色', '浅绿色', '碧绿色', '蓝绿色', '绿蓝色'];
      break;
    case 'mediumblue':
      chineseColorName = ['蓝色', '深暖色', '中蓝色'];
      break;
    case 'mediumorchid':
      chineseColorName = ['紫色', '中紫色'];
      break;
    case 'mediumpurple':
      chineseColorName = ['紫色', '中紫色'];
      break;
    case 'mediumseagreen':
      chineseColorName = ['绿色', '海洋绿'];
      break;
    case 'mediumslateblue':
      chineseColorName = ['紫色', '板岩蓝色', '间暗蓝色'];
      break;
    case 'mediumspringgreen':
      chineseColorName = ['绿色', '春天绿色', '浅绿色', '中春绿色'];
      break;
    case 'mediumturquoise':
      chineseColorName = ['绿色', '浅海洋绿色', '宝石绿', '蓝绿色', '绿蓝色'];
      break;
    case 'mediumvioletred':
      chineseColorName = ['红紫色', '紫罗兰红色'];
      break;
    case 'midnightblue':
      chineseColorName = ['蓝色', '午夜蓝色', '深兰色', '中灰蓝色'];
      break;
    case 'mintcream':
      chineseColorName = ['浅绿色', '薄荷色', '薄荷白色'];
      break;
    case 'mistyrose':
      chineseColorName = ['浅粉色', '浅玫瑰色'];
      break;
    case 'moccasin':
      chineseColorName = ['浅棕色', '暗黄色', '米色', '木色'];
      break;
    case 'navajowhite':
      chineseColorName = ['浅棕色', '暗黄色', '印第安黄色', '木色'];
      break;
    case 'oldlace':
      chineseColorName = ['米白色', '浅米色'];
      break;
    case 'olivedrab':
      chineseColorName = ['深绿色', '草绿色', '草黄色'];
      break;
    case 'orangered':
      chineseColorName = ['橘红色', '橙红色', '红橙色'];
      break;
    case 'orchid':
      chineseColorName = ['淡紫色', '粉色'];
      break;
    case 'palegoldenrod':
      chineseColorName = ['淡橘黄色', '灰菊黄色'];
      break;
    case 'palegreen':
      chineseColorName = ['淡绿色'];
      break;
    case 'paleturquoise':
      chineseColorName = ['浅蓝色'];
      break;
    case 'palevioletred':
      chineseColorName = ['浅紫色', '浅紫红色', '粉色'];
      break;
    case 'papayawhip':
      chineseColorName = ['米色', '木瓜色', '米黄色'];
      break;
    case 'peachpuff':
      chineseColorName = ['肉色', '桃色', '桃肉色', '桃红色', '肉黄色'];
      break;
    case 'peru':
      chineseColorName = [
        '褐色',
        '秘鲁色',
        '巧克力色',
        '金色',
        '黄褐色',
        '褐黄色',
        '棕色',
      ];
      break;
    case 'pink':
      chineseColorName = ['粉色', '粉红色'];
      break;
    case 'plum':
      chineseColorName = ['浅紫色', '李子色', '梅红色', '紫粉色'];
      break;
    case 'powderblue':
      chineseColorName = ['蓝色', '浅蓝色'];
      break;
    case 'rosybrown':
      chineseColorName = ['棕色', '玫瑰棕色', '褐色'];
      break;
    case 'royalblue':
      chineseColorName = ['宝蓝色', '皇家蓝色'];
      break;
    case 'saddlebrown':
      chineseColorName = ['褐色', '深褐色', '棕色'];
      break;
    case 'salmon':
      chineseColorName = ['浅橙色', '粉红色', '深粉色', '橘粉色'];
      break;
    case 'sandybrown':
      chineseColorName = ['沙棕色', '黄褐色', '杂褐色', '褐黄色'];
      break;
    case 'seagreen':
      chineseColorName = ['海绿色', '深绿色', '海藻绿色'];
      break;
    case 'seashell':
      chineseColorName = ['浅粉色', '肉色', '贝壳色', '贝壳白色'];
      break;
    case 'sienna':
      chineseColorName = ['深棕色', '赭色', '土黄色', '土褐色'];
      break;
    case 'skyblue':
      chineseColorName = ['天蓝色', '蓝色'];
      break;
    case 'slateblue':
      chineseColorName = ['蓝色', '石蓝色', '深蓝色', '暗蓝色', '蓝紫色'];
      break;
    case 'slategray':
      chineseColorName = [
        '灰色',
        '石灰色',
        '石板灰色',
        '灰石色',
        '青灰色',
        '青色',
      ];
      break;
    case 'slategrey':
      chineseColorName = ['灰色', '石灰色', '石板灰色', '灰石色'];
      break;
    case 'snow':
      chineseColorName = ['白色', '雪白色', '泥白色'];
      break;
    case 'springgreen':
      chineseColorName = ['绿色', '春绿色', '嫩绿色', '亮绿色'];
      break;
    case 'steelblue':
      chineseColorName = ['蓝色', '青色', '铁青色', '钢蓝色'];
      break;
    case 'tan':
      chineseColorName = ['棕色', '浅褐色', '黄棕色', '棕黄色'];
      break;
    case 'thistle':
      chineseColorName = ['紫色', '浅紫色', '苍紫色', '紫粉色'];
      break;
    case 'tomato':
      chineseColorName = ['鲜红色', '番茄色', '橘红色'];
      break;
    case 'turquoise':
      chineseColorName = ['蓝绿色', '浅绿色', '绿青色', '青蓝色'];
      break;
    case 'violet':
      chineseColorName = ['紫色', '浅紫色', '紫罗兰色', '紫粉色'];
      break;
    case 'wheat':
      chineseColorName = ['浅黄色', '小麦色'];
      break;
    case 'whitesmoke':
      chineseColorName = ['烟白色', '白雾色'];
      break;
    case 'yellowgreen':
      chineseColorName = ['黄绿色', '嫩绿色'];
      break;
    case 'rebeccapurple':
      chineseColorName = ['紫色', '深紫色'];
      break;
    default:
      chineseColorName = ['未知色'];
      break;
  }
  return chineseColorName;
};

export default colorNameTranslateChinese;
