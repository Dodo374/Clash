/**
 * 适配方案：MihomoPro 终极完美版
 * 更新：2026.02.09
 * 优化点：全业务组补全、Icon 修复、DNS 嗅探分流、MRS 规则全量注入
 */

function main(config) {
  // --- 1. 基础配置优化 (增强游戏 NAT 与性能) ---
  config["mode"] = "rule";
  config["ipv6"] = true;
  config["allow-lan"] = true;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;
  
  // 流量嗅探：解决 App 硬编码 IP 导致分流失效的问题
  config["sniffer"] = {
    "enable": true,
    "sniff": {
      "HTTP": { "ports": [80, "8080-8888"], "override-destination": true },
      "TLS": { "ports": [443, 8443], "override-destination": true },
      "QUIC": { "ports": [443, 8443], "override-destination": true }
    }
  };

  // --- 2. DNS 深度优化 ---
  config["dns"] = {
    "enable": true,
    "ipv6": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    "nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "fake-ip-filter": ["+.miwifi.com", "+.docker.io", "+.market.xiaomi.com", "+.push.apple.com", "+.dodo374.dynv6.net", "geosite:cn"]
  };

  // --- 3. 节点提取与地区过滤 ---
  var proxies = (config.proxies || []).map(function(p) { return p.name; }).filter(function(n) { 
    return !/群|订阅|流量|到期|机场|官网/.test(n); 
  });

  var filter = function(re) { return proxies.filter(function(n) { return re.test(n); }); };
  var gHK = filter(/港|🇭🇰|HK|Hong|HKG/i);
  var gTW = filter(/台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH/i);
  var gJP = filter(/日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK/i);
  var gSG = filter(/坡|🇸🇬|SG|Sing|SIN|XSP/i);
  var gUS = filter(/美|🇺🇸|US|USA|SJC|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD/i);
  var gHT = filter(/港|🇭🇰|HK|Hong|HKG|台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH/i);
  var gOT = proxies.filter(function(n) { return !/港|HK|Hong|台|TW|Tai|日|JP|Japan|坡|SG|Sing|美|US|USA/i.test(n); });

  var allRegNames = ["香港自动", "台湾自动", "日本自动", "狮城自动", "美国自动", "港台自动"];

  // --- 4. 业务策略组 (优先级全量对齐) ---
  var selectAL = ["全球自动"].concat(allRegNames, ["其他节点", "全球手动", "直接连接"]);
  var selectPY = ["默认代理"].concat(allRegNames, ["其他节点", "全球手动", "直接连接"]);
  var selectDC = ["直接连接", "默认代理"].concat(allRegNames, ["其他节点", "全球手动"]);

  config["proxy-groups"] = [
    { "name": "默认代理", "type": "select", "proxies": selectAL, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Proxy.png" },
    { "name": "全球自动", "type": "url-test", "include-all": true, "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png" },
    { "name": "国外流量", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Global.png" },
    { "name": "国内流量", "type": "select", "proxies": selectDC, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/China.png" },
    { "name": "兜底流量", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Available_1.png" },
    { "name": "直接连接", "type": "select", "proxies": ["DIRECT"], "hidden": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Direct.png" },
    
    // 深度校准组
    { "name": "国外AI", "type": "select", "proxies": ["美国自动", "默认代理", "香港自动", "台湾自动", "日本自动", "狮城自动", "港台自动", "其他节点"], "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/ChatGPT.png" },
    { "name": "国际媒体", "type": "select", "proxies": ["港台自动", "默认代理", "香港自动", "台湾自动", "日本自动", "狮城自动", "美国自动", "其他节点"], "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/YouTube.png" },
    { "name": "货币平台", "type": "select", "proxies": ["狮城自动", "默认代理", "香港自动", "台湾自动", "日本自动", "港台自动", "其他节点", "直接连接",], "icon": "https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/Bitcloud.png" },

    { "name": "社交平台", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Telegram.png" },
    { "name": "游戏平台", "type": "select", "proxies": selectDC, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Game.png" },
    { "name": "GitHub", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/GitHub.png" },
    { "name": "OneDrive", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/OneDrive.png" },
    { "name": "微软服务", "type": "select", "proxies": selectDC, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Microsoft.png" },
    { "name": "谷歌服务", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Google_Search.png" },
    { "name": "苹果服务", "type": "select", "proxies": selectPY, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png" },

    // 地区详细组
    { "name": "香港自动", "type": "url-test", "proxies": gHK.length ? gHK : ["DIRECT"], "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png" },
    { "name": "台湾自动", "type": "url-test", "proxies": gTW.length ? gTW : ["DIRECT"], "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png" },
    { "name": "日本自动", "type": "url-test", "proxies": gJP.length ? gJP : ["DIRECT"], "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png" },
    { "name": "狮城自动", "type": "url-test", "proxies": gSG.length ? gSG : ["DIRECT"], "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png" },
    { "name": "美国自动", "type": "url-test", "proxies": gUS.length ? gUS : ["DIRECT"], "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png" },
    { "name": "港台自动", "type": "url-test", "proxies": gHT.length ? gHT : ["DIRECT"], "url": "https://www.google.com/generate_204", "tolerance": 50, "interval": 300, "lazy": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/HKMTMedia.png" },

    { "name": "其他节点", "type": "select", "proxies": gOT.length ? gOT : ["直接连接"], "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_Nations.png" },
    { "name": "全球手动", "type": "select", "include-all": true, "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png" }
  ];

  // --- 5. 规则列表 (1:1 还原) ---
config["rules"] = [
    "DOMAIN-SUFFIX,dodo374.dynv6.net,直接连接", 
    "RULE-SET,Tracking,REJECT", 
    "RULE-SET,Advertising,REJECT",
    "AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((GEOIP,CN)))),REJECT", 
    "RULE-SET,LocationDKS,直接连接",
    "RULE-SET,Private,直接连接", 
    "RULE-SET,Direct,直接连接", 
    "RULE-SET,XPTV,直接连接",
    "RULE-SET,Download,直接连接", 
    "RULE-SET,AppleCN,直接连接",
    "RULE-SET,Crypto,货币平台",
    "RULE-SET,Game,游戏平台",
    "RULE-SET,AI,国外AI", 
    "RULE-SET,GitHub,GitHub", 
    "RULE-SET,TikTok,社交平台",
    "RULE-SET,Twitter,社交平台", 
    "RULE-SET,Telegram,社交平台", 
    "RULE-SET,SocialMedia,社交平台",
    "RULE-SET,Netflix,国际媒体", 
    "RULE-SET,YouTube,国际媒体", 
    "RULE-SET,Streaming,国际媒体",
    "RULE-SET,Apple,苹果服务", 
    "RULE-SET,Google,谷歌服务", 
    "RULE-SET,OneDrive,OneDrive",
    "RULE-SET,Microsoft,微软服务", 
    "RULE-SET,Proxy,国外流量", 
    "RULE-SET,China,国内流量",
    
    // IP 相关规则
    "RULE-SET,AdvertisingIP,REJECT,no-resolve", 
    "RULE-SET,PrivateIP,直接连接,no-resolve",
    "RULE-SET,AIIP,国外AI,no-resolve", 
    "RULE-SET,TelegramIP,社交平台,no-resolve",
    "RULE-SET,NetflixIP,国际媒体,no-resolve", 
    "RULE-SET,GoogleIP,谷歌服务,no-resolve",
    "RULE-SET,ProxyIP,国外流量,no-resolve", 
    "RULE-SET,ChinaIP,国内流量,no-resolve",
    "GEOIP,CN,国内流量,no-resolve", 
    "MATCH,兜底流量"
  ];
  // --- 6. 规则提供者 (补全所有 mrs) ---
var dUrl = "https://github.com/666OS/rules/raw/release/mihomo/domain/";
  var iUrl = "https://github.com/666OS/rules/raw/release/mihomo/ip/";
  var r = function(u, b) { return { "type": "http", "behavior": b, "format": "mrs", "interval": 86400, "url": u }; };

  config["rule-providers"] = {
    // 基础防泄漏与直连
    "Tracking": r(dUrl+"Tracking.mrs", "domain"), 
    "Advertising": r(dUrl+"Advertising.mrs", "domain"),
    "LocationDKS": r(dUrl+"LocationDKS.mrs", "domain"), 
    "Private": r(dUrl+"Private.mrs", "domain"),
    "Direct": r(dUrl+"Direct.mrs", "domain"), 
    "XPTV": r(dUrl+"XPTV.mrs", "domain"),
    "Download": r(dUrl+"Download.mrs", "domain"), 
    "AppleCN": r(dUrl+"AppleCN.mrs", "domain"),
    
    // 常用业务
    "AI": r(dUrl+"AI.mrs", "domain"), 
    "Crypto": r(dUrl+"Crypto.mrs", "domain"),
    "Game": r(dUrl+"Games.mrs", "domain"), 
    "GitHub": r(dUrl+"GitHub.mrs", "domain"),
    "TikTok": r(dUrl+"TikTok.mrs", "domain"), 
    "Twitter": r(dUrl+"Twitter.mrs", "domain"),
    "Telegram": r(dUrl+"Telegram.mrs", "domain"), 
    "SocialMedia": r(dUrl+"SocialMedia.mrs", "domain"),
    "Netflix": r(dUrl+"Netflix.mrs", "domain"), 
    "YouTube": r(dUrl+"YouTube.mrs", "domain"),
    "Streaming": r(dUrl+"Streaming.mrs", "domain"), 
    "Apple": r(dUrl+"Apple.mrs", "domain"),
    "Google": r(dUrl+"Google.mrs", "domain"), 
    "OneDrive": r(dUrl+"OneDrive.mrs", "domain"),
    "Microsoft": r(dUrl+"Microsoft.mrs", "domain"), 
    "Proxy": r(dUrl+"Proxy.mrs", "domain"),
    "China": r(dUrl+"China.mrs", "domain"),
    
    // IP 类
    "AdvertisingIP": r(iUrl+"Advertising.mrs", "ipcidr"), 
    "PrivateIP": r(iUrl+"Private.mrs", "ipcidr"),
    "AIIP": r(iUrl+"AI.mrs", "ipcidr"), 
    "TelegramIP": r(iUrl+"Telegram.mrs", "ipcidr"),
    "NetflixIP": r(iUrl+"Netflix.mrs", "ipcidr"), 
    "GoogleIP": r(iUrl+"Google.mrs", "ipcidr"),
    "ProxyIP": r(iUrl+"Proxy.mrs", "ipcidr"), 
    "ChinaIP": r(iUrl+"China.mrs", "ipcidr"),
  };

  return config;
}