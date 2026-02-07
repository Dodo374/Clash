// Clash Verge / Verge Rev 进阶性能优化版
function main(config) {
  // ==================== 1. 性能增强配置 ====================
  config["mode"] = "rule";
  config["ipv6"] = true;
  config["allow-lan"] = true;
  config["unified-delay"] = true; // 统一延迟计算，让自动选路更准
  config["tcp-concurrent"] = true; // 并发建立 TCP 连接
  config["global-client-fingerprint"] = "chrome"; // 模拟浏览器指纹，减少被拦截

  // ==================== 2. 极速 DNS 优化 ====================
  config["dns"] = {
    "enable": true,
    "ipv6": true,
    "respect-rules": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "prefer-h3": true, // 开启 HTTP/3 DNS 解析，更安全且快
    "fast-query": true, // 并发请求所有 DNS，取最快响应
    "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1"],
    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query",
      "https://dns.volcengine.com/dns-query" // 字节跳动 DoH
    ],
    // 关键优化：专门解析代理服务器地址的 DNS，解决连接机场慢的问题
    "proxy-server-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://1.1.1.1/dns-query"
    ],
    "fake-ip-filter": ["rule-set:Direct", "rule-set:Private", "rule-set:China", "+.market.xiaomi.com", "+.push.apple.com", "+.dodo374.dynv6.net"]
  };

  // ==================== 3. 流量嗅探精简 ====================
  // 减少嗅探的端口范围，只处理 80/443，避免影响游戏和 P2P
  config["sniffer"] = {
    "enable": true,
    "sniff": {
      "HTTP": { "ports": [80], "override-destination": true },
      "TLS": { "ports": [443], "override-destination": true },
      "QUIC": { "ports": [443], "override-destination": true }
    },
    "skip-domain": ["Mijia Cloud", "+.push.apple.com", "BT服务器关键字"]
  };

  // ==================== 4. 地区过滤逻辑 (保持不排除倍率) ====================
  const filters = {
    HK: '^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG)).*$',
    SG: '^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP)).*$',
    JP: '^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK)).*$',
    KR: '^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South)).*$',
    US: '^(?=.*(?i)(美|🇺🇸|US|USA|SJC|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD)).*$',
    TW: '^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH)).*$',
    EU: '^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU)).*$',
    OT: '^(?!.*(DIRECT|直接连接|美|港|坡|台|新|日|韩|奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇭🇰|🇼🇸|🇹🇼|🇸🇬|🇯🇵|🇰🇷|🇺🇸|🇬🇧|🇦🇹|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|HK|TW|SG|JP|KR|US|GB|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU|HKG|TPE|TSA|KHH|SIN|XSP|NRT|HND|KIX|CTS|FUK|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD|LHR|LGW))'
  };

  // ==================== 5. 策略组还原 (包含 Icon) ====================
  const autoGroupsList = ["香港自动", "狮城自动", "日本自动", "韩国自动", "美国自动", "台湾自动", "欧盟自动"];
  const selectAL = ["故障转移", ...autoGroupsList, "冷门自选", "全球手动", "直接连接"];
  const selectPY = ["默认代理", ...autoGroupsList, "冷门自选", "全球手动", "直接连接"];
  const selectDC = ["直接连接", "默认代理", ...autoGroupsList, "冷门自选", "全球手动"];
  const selectHK = ["香港自动", "默认代理", "狮城自动", "日本自动", "韩国自动", "美国自动", "台湾自动", "欧盟自动", "冷门自选", "全球手动", "直接连接"];

  config["proxy-groups"] = [
    { name: "默认代理", type: "select", proxies: selectAL, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Proxy.png" },
    { name: "故障转移", type: "fallback", proxies: [...autoGroupsList, "全球手动", "冷门自选", "直接连接"], url: "https://www.google.com/generate_204", interval: 150, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/ULB.png" },
    { name: "国外流量", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Global.png" },
    { name: "国内流量", type: "select", proxies: selectDC, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/China.png" },
    { name: "兜底流量", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Available_1.png" },
    { name: "直接连接", type: "select", proxies: ["DIRECT"], hidden: true, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Direct.png" },

    { name: "抖快书定位", type: "select", proxies: ["直接连接", ...autoGroupsList], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Domestic.png" },
    { name: "人工智能", type: "select", proxies: ["AI自动", "美国自动", "狮城自动", "日本自动", "台湾自动", "欧盟自动"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/AI.png" },
    { name: "国际媒体", type: "select", proxies: selectHK, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/YouTube.png" },
    { name: "社交平台", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Telegram_X.png" },
    { name: "游戏平台", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Game.png" },
    { name: "OneDrive", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/OneDrive.png" },
    { name: "微软服务", type: "select", proxies: selectDC, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Microsoft.png" },
    { name: "谷歌服务", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Google_Search.png" },
    { name: "苹果服务", type: "select", proxies: selectPY, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png" },

    { name: "香港自动", type: "url-test", "include-all": true, filter: filters.HK, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png" },
    { name: "台湾自动", type: "url-test", "include-all": true, filter: filters.TW, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png" },
    { name: "狮城自动", type: "url-test", "include-all": true, filter: filters.SG, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png" },
    { name: "日本自动", type: "url-test", "include-all": true, filter: filters.JP, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png" },
    { name: "韩国自动", type: "url-test", "include-all": true, filter: filters.KR, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Korea.png" },
    { name: "美国自动", type: "url-test", "include-all": true, filter: filters.US, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png" },
    { name: "欧盟自动", type: "url-test", "include-all": true, filter: filters.EU, interval: 150, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/European_Union.png" },
    { name: "AI自动", type: "fallback", proxies: ["美国自动", "狮城自动", "日本自动", "台湾自动", "韩国自动", "欧盟自动"], interval: 200, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/ChatGPT.png" },

    { name: "冷门自选", type: "select", "include-all": true, filter: filters.OT, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Europe_Map.png" },
    { name: "全球手动", type: "select", "include-all": true, filter: '^(?!.*(群|邀请|返利|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))', icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Clubhouse.png" }
  ];

  // ==================== 6. 规则集映射 (保持原有逻辑) ====================
  const domainSets = ["Tracking", "Advertising", "Direct", "LocationDKS", "Private", "Download", "AI", "Telegram", "Twitter", "SocialMedia", "Games", "Netflix", "YouTube", "XPTV", "Streaming", "AppleCN", "Apple", "Google", "OneDrive", "Microsoft", "Proxy", "China"];
  const ipSets = ["Advertising", "Private", "AI", "Telegram", "SocialMedia", "XPTV", "Netflix", "Streaming", "Google", "Proxy", "China"];

  config["rule-providers"] = {};
  domainSets.forEach(s => { config["rule-providers"][s] = { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: `https://github.com/666OS/rules/raw/release/mihomo/domain/${s}.mrs` }; });
  ipSets.forEach(s => { config["rule-providers"][`${s}IP`] = { type: "http", behavior: "ipcidr", format: "mrs", interval: 86400, url: `https://github.com/666OS/rules/raw/release/mihomo/ip/${s}.mrs` }; });

  config["rules"] = [
    "DOMAIN-SUFFIX,dodo374.dynv6.net,直接连接",
    "RULE-SET,Tracking,REJECT",
    "RULE-SET,Advertising,REJECT",
    "AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((GEOIP,CN)))),REJECT",
    "RULE-SET,LocationDKS,抖快书定位",
    "RULE-SET,Private,直接连接",
    "RULE-SET,Direct,直接连接",
    "RULE-SET,XPTV,直接连接",
    "RULE-SET,Download,直接连接",
    "RULE-SET,AppleCN,直接连接",
    "RULE-SET,AI,人工智能",
    "RULE-SET,Twitter,社交平台",
    "RULE-SET,Telegram,社交平台",
    "RULE-SET,SocialMedia,社交平台",
    "RULE-SET,Games,游戏平台",
    "RULE-SET,Netflix,国际媒体",
    "RULE-SET,YouTube,国际媒体",
    "RULE-SET,Streaming,国际媒体",
    "RULE-SET,Apple,苹果服务",
    "RULE-SET,Google,谷歌服务",
    "RULE-SET,OneDrive,OneDrive",
    "RULE-SET,Microsoft,微软服务",
    "RULE-SET,Proxy,国外流量",
    "RULE-SET,China,国内流量",
    "RULE-SET,AdvertisingIP,REJECT,no-resolve",
    "RULE-SET,PrivateIP,直接连接,no-resolve",
    "RULE-SET,AIIP,人工智能,no-resolve",
    "RULE-SET,TelegramIP,社交平台,no-resolve",
    "RULE-SET,SocialMediaIP,社交平台,no-resolve",
    "RULE-SET,NetflixIP,国际媒体,no-resolve",
    "RULE-SET,StreamingIP,国际媒体,no-resolve",
    "RULE-SET,GoogleIP,谷歌服务,no-resolve",
    "RULE-SET,ProxyIP,国外流量,no-resolve",
    "RULE-SET,ChinaIP,国内流量",
    "MATCH,兜底流量"
  ];

  return config;
}