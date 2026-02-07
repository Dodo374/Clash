/**
 * Clash 全平台覆写脚本（PC + 手机）
 * 来源: MihomoPro YAML 转 JS
 * 适用: Clash Verge / FLClash
 * 作者: 改写自 YYDS666
 */

module.exports = (config) => {
  // ==================== 基础配置 ====================
  config.mode = "rule";
  config.port = 7890;
  config.socksPort = 7891;
  config.redirPort = 7892;       // PC 可用
  config.mixedPort = 7893;       // 可选，移动端忽略
  // config.tproxyPort = 7895;    // 移动端无用，已删除
  config.ipv6 = true;
  config.allowLan = true;
  config.unifiedDelay = true;
  config.tcpConcurrent = true;
  config.logLevel = "warning";
  config.bindAddress = "*";
  config.findProcessMode = "always";
  config.keepAliveInterval = 15;
  config.keepAliveIdle = 600;

  // sniffer
  config.sniffer = {
    enable: true,
    sniff: {
      HTTP: {
        ports: [80, 8080, 8880],
        overrideDestination: true
      },
      TLS: {
        ports: [443, 8443]
      },
      QUIC: {
        ports: [443, 8443]
      }
    },
    skipDomain: [
      "Mijia Cloud",
      "+.push.apple.com"
    ]
  };

  // tun 模式 (移动端 FLClash 会忽略)
  config.tun = {
    enable: false,
    stack: "mixed",
    dnsHijack: ["any:53", "tcp://any:53"],
    autoRoute: true,
    autoRedirect: true,
    autoDetectInterface: true
  };

  // DNS 配置
  config.dns = {
    enable: true,
    ipv6: true,
    enhancedMode: "fake-ip",
    fakeIpRange: "198.18.0.1/16",
    defaultNameserver: ["119.29.29.29","180.184.1.1","223.5.5.5"],
    nameserver: [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],
    fakeIpFilter: [
      { "rule-set": "Direct" },
      { "rule-set": "Private" },
      { "rule-set": "China" },
      "+.miwifi.com",
      "+.docker.io",
      "+.market.xiaomi.com",
      "+.push.apple.com",
      "+.dodo374.dynv6.net"
    ]
  };

  // ==================== 策略组 ====================
  config.proxyGroups = [
    // 主要策略组
    { name: "默认代理", type: "select", proxies: ["全球自动","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Proxy.png" },
    { name: "全球自动", type: "url-test", interval: 300, lazy: true, includeAll: true, hidden: false, url: "https://www.google.com/generate_204", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png" },
    { name: "国外流量", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Global.png" },
    { name: "国内流量", type: "select", proxies: ["直接连接","默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/China.png" },
    { name: "兜底流量", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Available_1.png" },
    { name: "直接连接", type: "select", proxies: ["DIRECT"], hidden: true, icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Direct.png" },

    // 功能组
    { name: "抖快书定位", type: "select", proxies: ["直接连接","香港自动","台湾自动","狮城自动","日本自动","韩国自动","美国自动","欧盟自动"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Area.png" },
    { name: "国外AI", type: "select", proxies: ["美国自动","默认代理","香港自动","狮城自动","日本自动","韩国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/ChatGPT.png" },

    // 媒体社交
    { name: "国际媒体", type: "select", proxies: ["港台自动","默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/YouTube.png" },
    { name: "社交平台", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Telegram.png" },

    // 商业服务
    { name: "货币平台", type: "select", proxies: ["狮城自动","默认代理","香港自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/Bitcloud.png" },
    { name: "游戏平台", type: "select", proxies: ["直接连接","默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Game.png" },
    { name: "GitHub", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/GitHub.png" },
    { name: "OneDrive", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/OneDrive.png" },
    { name: "微软服务", type: "select", proxies: ["直接连接","默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Microsoft.png" },
    { name: "谷歌服务", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Google_Search.png" },
    { name: "苹果服务", type: "select", proxies: ["默认代理","香港自动","狮城自动","日本自动","韩国自动","美国自动","台湾自动","港台自动","欧盟自动","其他节点","全球手动","直接连接"], icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png" },

    // 地区自动组
    { name: "香港自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png" },
    { name: "台湾自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png" },
    { name: "狮城自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png" },
    { name: "日本自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png" },
    { name: "韩国自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Korea.png" },
    { name: "美国自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(美|🇺🇸|US|USA|SJC|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png" },
    { name: "港台自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG|台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/HKMTMedia.png" },
    { name: "欧盟自动", type: "url-test", interval: 300, lazy: true, includeAll: true, filter: "^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU))(?!.*(排除1|排除2|5x)).*$", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/European_Union.png" },

    // 其他策略组
    { name: "其他节点", type: "select", includeAll: true, filter: "^(?!.*(DIRECT|直接连接|美|港|坡|台|新|日|韩|奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇭🇰|🇼🇸|🇹🇼|🇸🇬|🇯🇵|🇰🇷|🇺🇸|🇬🇧|🇦🇹|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|HK|TW|SG|JP|KR|US|GB|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU|HKG|TPE|TSA|KHH|SIN|XSP|NRT|HND|KIX|CTS|FUK|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD|LHR|LGW))", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_Nations.png" },
    { name: "全球手动", type: "select", includeAll: true, filter: "^(?!.*(DIRECT|直接连接|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))", icon: "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png" }
  ];

  // ==================== 规则 ====================
  config.rules = [
    "DOMAIN-SUFFIX,dodo374.dynv6.net,直接连接",
    "RULE-SET,Tracking,REJECT",
    "RULE-SET,Advertising,REJECT",
    "AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((GEOIP,CN)))),REJECT",
    "RULE-SET,LocationDKS,抖快书定位",
    "RULE-SET,Private,直接连接",
    "RULE-SET,Direct,直接连接",
    "RULE-SET,XPTV,直接连接",
    "RULE-SET,Download,直接连接",
    "RULE-SET,Gamedownload,直接连接",
    "RULE-SET,AppleCN,直接连接",
    "RULE-SET,AI,国外AI",
    "RULE-SET,GitHub,GitHub",
    "RULE-SET,TikTok,社交平台",
    "RULE-SET,Twitter,社交平台",
    "RULE-SET,Telegram,社交平台",
    "RULE-SET,SocialMedia,社交平台",
    "RULE-SET,Games,游戏平台",
    "RULE-SET,Crypto,货币平台",
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
    "RULE-SET,XPTVIP,直接连接,no-resolve",
    "RULE-SET,AIIP,国外AI,no-resolve",
    "RULE-SET,TelegramIP,社交平台,no-resolve",
    "RULE-SET,SocialMediaIP,社交平台,no-resolve",
    "RULE-SET,NetflixIP,国际媒体,no-resolve",
    "RULE-SET,StreamingIP,国际媒体,no-resolve",
    "RULE-SET,GoogleIP,谷歌服务,no-resolve",
    "RULE-SET,ProxyIP,国外流量,no-resolve",
    "RULE-SET,ChinaIP,国内流量,no-resolve",
    "MATCH,兜底流量"
  ];

  // ==================== 规则集 ====================
  const behaviorDN = { type: "http", behavior: "domain", format: "mrs", interval: 300 };
  config.ruleProviders = {
    Tracking: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Tracking/main/Tracking.yaml", interval: 3600 },
    Advertising: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Advertising/main/Advertising.yaml", interval: 3600 },
    LocationDKS: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/LocationDKS/main/LocationDKS.yaml", interval: 3600 },
    Private: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Private/main/Private.yaml", interval: 3600 },
    Direct: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Direct/main/Direct.yaml", interval: 3600 },
    AI: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/AI/main/AI.yaml", interval: 3600 },
    GitHub: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/GitHub/main/GitHub.yaml", interval: 3600 },
    AppleCN: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/AppleCN/main/AppleCN.yaml", interval: 3600 },
    TikTok: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/TikTok/main/TikTok.yaml", interval: 3600 },
    Telegram: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Telegram/main/Telegram.yaml", interval: 3600 },
    SocialMedia: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/SocialMedia/main/SocialMedia.yaml", interval: 3600 },
    Games: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Games/main/Games.yaml", interval: 3600 },
    Crypto: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Crypto/main/Crypto.yaml", interval: 3600 },
    Netflix: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Netflix/main/Netflix.yaml", interval: 3600 },
    YouTube: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/YouTube/main/YouTube.yaml", interval: 3600 },
    Streaming: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Streaming/main/Streaming.yaml", interval: 3600 },
    Apple: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Apple/main/Apple.yaml", interval: 3600 },
    Google: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Google/main/Google.yaml", interval: 3600 },
    OneDrive: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/OneDrive/main/OneDrive.yaml", interval: 3600 },
    Microsoft: { type: "http", behavior: "domain", url: "https://raw.githubusercontent.com/dahaha-365/Microsoft/main/Microsoft.yaml", interval: 3600 }
  };

  return config;
};
