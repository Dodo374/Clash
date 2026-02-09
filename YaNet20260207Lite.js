/**
 * MihomoPro 高大全版 - 最终修复
 * 报错原因修复：简化对象声明方式，对齐 Mihomo 所有的键名规范
 */

function main(config) {
  // 1. 核心配置 (字符串键名，防止引擎报错)
  config["mode"] = "rule";
  config["ipv6"] = true;
  config["allow-lan"] = true;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;
  config["global-client-fingerprint"] = "chrome";

  // 2. DNS 配置
  config["dns"] = {
    "enable": true,
    "ipv6": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "default-nameserver": ["119.29.29.29", "180.184.1.1", "223.5.5.5"],
    "nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "fake-ip-filter": ["+.miwifi.com", "+.docker.io", "+.market.xiaomi.com", "+.push.apple.com", "+.dodo374.dynv6.net", "geosite:cn"]
  };

  // 3. 策略组逻辑 (1:1 像素级还原)
  const proxies = (config.proxies || []).map(function(p) { return p.name; });
  const regionNames = ['香港自动', '狮城自动', '日本自动', '韩国自动', '美国自动', '台湾自动', '港台自动', '欧盟自动'];
  
  const selectAL = ['全球自动'].concat(regionNames, ['其他节点', '全球手动', '直接连接']);
  const selectPY = ['默认代理'].concat(regionNames, ['其他节点', '全球手动', '直接连接']);
  const selectDC = ['直接连接', '默认代理'].concat(regionNames, ['其他节点', '全球手动']);
  const selectUS = ['美国自动', '默认代理', '香港自动', '狮城自动', '日本自动', '韩国自动', '台湾自动', '港台自动', '欧盟自动', '其他节点', '全球手动', '直接连接'];
  const selectHT = ['港台自动', '默认代理', '香港自动', '狮城自动', '日本自动', '韩国自动', '美国自动', '台湾自动', '欧盟自动', '其他节点', '全球手动', '直接连接'];
  const selectSG = ['狮城自动', '默认代理', '香港自动', '日本自动', '韩国自动', '美国自动', '台湾自动', '港台自动', '欧盟自动', '其他节点', '全球手动', '直接连接'];

  const businessGroups = [
    { "name": "默认代理", "type": "select", "proxies": selectAL, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Proxy.png" },
    { "name": "全球自动", "type": "url-test", "include-all": true, "url": "https://www.google.com/generate_204", "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png" },
    { "name": "国外流量", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Global.png" },
    { "name": "国内流量", "type": "select", "proxies": selectDC, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/China.png" },
    { "name": "兜底流量", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Available_1.png" },
    { "name": "直接连接", "type": "select", "proxies": ["DIRECT"], "hidden": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Direct.png" },
    { "name": "抖快书定位", "type": "select", "proxies": ["直接连接", "香港自动", "台湾自动", "狮城自动", "日本自动", "韩国自动", "美国自动", "欧盟自动"], "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Area.png" },
    { "name": "国外AI", "type": "select", "proxies": selectUS, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/ChatGPT.png" },
    { "name": "国际媒体", "type": "select", "proxies": selectHT, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/YouTube.png" },
    { "name": "社交平台", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Telegram.png" },
    { "name": "货币平台", "type": "select", "proxies": selectSG, "icon": "https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/Bitcloud.png" },
    { "name": "游戏平台", "type": "select", "proxies": selectDC, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Game.png" },
    { "name": "GitHub", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/GitHub.png" },
    { "name": "OneDrive", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/OneDrive.png" },
    { "name": "微软服务", "type": "select", "proxies": selectDC, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Microsoft.png" },
    { "name": "谷歌服务", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Google_Search.png" },
    { "name": "苹果服务", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png" }
  ];

  // 4. 动态地区组声明 (确保语法最简)
  const filters = {
    HK: /港|🇭🇰|HK|Hong|HKG/i, SG: /坡|🇸🇬|SG|Sing|SIN|XSP/i, JP: /日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK/i,
    KR: /韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South/i, US: /美|🇺🇸|US|USA|SJC|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD/i,
    TW: /台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH/i, HT: /港|🇭🇰|HK|Hong|HKG|台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH/i,
    EU: /奥|比|法|德|意|英|🇪🇺|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU/i
  };

  const autoGroups = [
    { name: '香港自动', regex: filters.HK, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png' },
    { name: '狮城自动', regex: filters.SG, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png' },
    { name: '日本自动', regex: filters.JP, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png' },
    { name: '韩国自动', regex: filters.KR, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Korea.png' },
    { name: '美国自动', regex: filters.US, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png' },
    { name: '台湾自动', regex: filters.TW, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png' },
    { name: '港台自动', regex: filters.HT, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/HKMTMedia.png' },
    { name: '欧盟自动', regex: filters.EU, icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/European_Union.png' }
  ].map(function(c) {
    const matched = proxies.filter(function(p) { return c.regex.test(p); });
    return {
      "name": c.name, "type": "url-test", "proxies": matched.length > 0 ? matched : ["DIRECT"],
      "url": "https://www.google.com/generate_204", "interval": 300, "lazy": true, "icon": c.icon
    };
  });

  config["proxy-groups"] = businessGroups.concat(autoGroups, [
    { "name": "其他节点", "type": "select", "proxies": ["DIRECT"], "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_Nations.png" },
    { "name": "全球手动", "type": "select", "include-all": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png" }
  ]);

  // 5. 规则列表 (1:1 还原)
  config["rules"] = [
    "DOMAIN-SUFFIX,dodo374.dynv6.net,直接连接",
    "RULE-SET,Tracking,REJECT", "RULE-SET,Advertising,REJECT",
    "AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((GEOIP,CN)))),REJECT",
    "RULE-SET,LocationDKS,抖快书定位", "RULE-SET,Private,直接连接", "RULE-SET,Direct,直接连接",
    "RULE-SET,XPTV,直接连接", "RULE-SET,Download,直接连接", "RULE-SET,Gamedownload,直接连接",
    "RULE-SET,AppleCN,直接连接", "RULE-SET,AI,国外AI", "RULE-SET,GitHub,GitHub",
    "RULE-SET,TikTok,社交平台", "RULE-SET,Twitter,社交平台", "RULE-SET,Telegram,社交平台",
    "RULE-SET,SocialMedia,社交平台", "RULE-SET,Games,游戏平台", "RULE-SET,Crypto,货币平台",
    "RULE-SET,Netflix,国际媒体", "RULE-SET,YouTube,国际媒体", "RULE-SET,Streaming,国际媒体",
    "RULE-SET,Apple,苹果服务", "RULE-SET,Google,谷歌服务", "RULE-SET,OneDrive,OneDrive",
    "RULE-SET,Microsoft,微软服务", "RULE-SET,Proxy,国外流量", "RULE-SET,China,国内流量",
    "RULE-SET,AdvertisingIP,REJECT,no-resolve", "RULE-SET,PrivateIP,直接连接,no-resolve",
    "RULE-SET,XPTVIP,直接连接,no-resolve", "RULE-SET,AIIP,国外AI,no-resolve",
    "RULE-SET,TelegramIP,社交平台,no-resolve", "RULE-SET,SocialMediaIP,社交平台,no-resolve",
    "RULE-SET,NetflixIP,国际媒体,no-resolve", "RULE-SET,StreamingIP,国际媒体,no-resolve",
    "RULE-SET,GoogleIP,谷歌服务,no-resolve", "RULE-SET,ProxyIP,国外流量,no-resolve",
    "RULE-SET,ChinaIP,国内流量,no-resolve", "GEOIP,CN,国内流量,no-resolve", "MATCH,兜底流量"
  ];

  // 6. 规则提供者 (补全版)
  config["rule-providers"] = {
    "Tracking": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Tracking.mrs" },
    "Advertising": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Advertising.mrs" },
    "LocationDKS": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/LocationDKS.mrs" },
    "Private": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Private.mrs" },
    "Direct": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Direct.mrs" },
    "XPTV": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/XPTV.mrs" },
    "Download": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Download.mrs" },
    "Gamedownload": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-game-platforms-download.mrs" },
    "AppleCN": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/AppleCN.mrs" },
    "AI": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/AI.mrs" },
    "GitHub": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/GitHub.mrs" },
    "TikTok": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/TikTok.mrs" },
    "Twitter": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Twitter.mrs" },
    "Telegram": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Telegram.mrs" },
    "SocialMedia": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/SocialMedia.mrs" },
    "Games": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Games.mrs" },
    "Crypto": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Crypto.mrs" },
    "Netflix": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Netflix.mrs" },
    "YouTube": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/YouTube.mrs" },
    "Streaming": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Streaming.mrs" },
    "Apple": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Apple.mrs" },
    "Google": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Google.mrs" },
    "OneDrive": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/OneDrive.mrs" },
    "Microsoft": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Microsoft.mrs" },
    "Proxy": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Proxy.mrs" },
    "China": { "type": "http", "behavior": "domain", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/China.mrs" },
    "AdvertisingIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Advertising.mrs" },
    "PrivateIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Private.mrs" },
    "AIIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/AI.mrs" },
    "TelegramIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Telegram.mrs" },
    "SocialMediaIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/SocialMedia.mrs" },
    "XPTVIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/XPTV.mrs" },
    "NetflixIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Netflix.mrs" },
    "StreamingIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Streaming.mrs" },
    "GoogleIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Google.mrs" },
    "ProxyIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Proxy.mrs" },
    "ChinaIP": { "type": "http", "behavior": "ipcidr", "format": "mrs", "interval": 86400, "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/China.mrs" }
  };

  return config;
}