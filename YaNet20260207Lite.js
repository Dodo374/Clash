// MihomoPro Override Script for Clash Verge (PC) & FLClash (Mobile)
// Version: v26.1.1
// 特点：稳定、精简、高效，保留地区分组和完整规则集

module.exports = {
  // ==================== 核心配置 ====================
  port: 7890,
  socksPort: 7891,
  mixedPort: 7893,
  mode: "rule",
  logLevel: "warning",
  allowLan: true,
  ipv6: true,
  unifiedDelay: true,
  tcpConcurrent: true,

  dns: {
    enable: true,
    ipv6: true,
    enhancedMode: "fake-ip",
    fakeIpRange: "198.18.0.1/16",
    defaultNameserver: [
      "119.29.29.29",
      "223.5.5.5"
    ],
    nameserver: [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],
    fakeIpFilter: [
      "+.push.apple.com",
      "+.docker.io",
      "+.market.xiaomi.com",
      "+.miwifi.com",
      "+.dodo374.dynv6.net"
    ]
  },

  profile: {
    storeSelected: true,
    storeFakeIp: true
  },

  sniffer: {
    enable: true,
    sniff: {
      HTTP: { ports: [80, "8080-8880"], overrideDestination: true },
      TLS: { ports: [443, 8443] },
      QUIC: { ports: [443, 8443] }
    },
    skipDomain: ["Mijia Cloud", "+.push.apple.com"]
  },

  tun: {
    enable: false,
    stack: "mixed",
    autoRoute: true,
    autoRedirect: true,
    autoDetectInterface: true,
    dnsHijack: ["any:53", "tcp://any:53"]
  },

  // ==================== 规则部分 ====================
  rules: [
    "DOMAIN-SUFFIX,dodo374.dynv6.net,DIRECT",

    // 广告 & 追踪
    "RULE-SET,Advertising,REJECT",
    "RULE-SET,Tracking,REJECT",

    // 阻止海外 QUIC
    "AND,((DST-PORT,443),(NETWORK,UDP),(NOT,((GEOIP,CN)))),REJECT",

    // 功能类
    "RULE-SET,LocationDKS,抖快书定位",
    "RULE-SET,AI,国外AI",
    "RULE-SET,GitHub,GitHub",
    "RULE-SET,Games,游戏平台",
    "RULE-SET,Crypto,货币平台",

    // 媒体 & 社交
    "RULE-SET,TikTok,社交平台",
    "RULE-SET,Twitter,社交平台",
    "RULE-SET,Telegram,社交平台",
    "RULE-SET,SocialMedia,社交平台",
    "RULE-SET,Netflix,国际媒体",
    "RULE-SET,YouTube,国际媒体",
    "RULE-SET,Streaming,国际媒体",
    "RULE-SET,XPTV,DIRECT",

    // 服务类
    "RULE-SET,Apple,苹果服务",
    "RULE-SET,Google,谷歌服务",
    "RULE-SET,OneDrive,OneDrive",
    "RULE-SET,Microsoft,微软服务",

    // 国内直连
    "RULE-SET,China,DIRECT",
    "RULE-SET,Private,DIRECT",
    "RULE-SET,Direct,DIRECT",
    "RULE-SET,Download,DIRECT",
    "RULE-SET,Gamedownload,DIRECT",
    "RULE-SET,AppleCN,DIRECT",

    // IP规则
    "RULE-SET,AdvertisingIP,REJECT,no-resolve",
    "RULE-SET,PrivateIP,DIRECT,no-resolve",
    "RULE-SET,XPTVIP,DIRECT,no-resolve",
    "RULE-SET,AIIP,国外AI,no-resolve",
    "RULE-SET,TelegramIP,社交平台,no-resolve",
    "RULE-SET,SocialMediaIP,社交平台,no-resolve",
    "RULE-SET,NetflixIP,国际媒体,no-resolve",
    "RULE-SET,StreamingIP,国际媒体,no-resolve",
    "RULE-SET,GoogleIP,谷歌服务,no-resolve",
    "RULE-SET,ProxyIP,国外流量,no-resolve",
    "RULE-SET,ChinaIP,DIRECT,no-resolve",

    // 兜底
    "MATCH,兜底流量"
  ],

  // ==================== 规则集 ====================
  ruleProviders: {
    // 域名规则
    Tracking:       { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Tracking.mrs" },
    Advertising:    { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Advertising.mrs" },
    Direct:         { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Direct.mrs" },
    LocationDKS:    { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/LocationDKS.mrs" },
    Private:        { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Private.mrs" },
    Download:       { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Download.mrs" },
    Gamedownload:   { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-game-platforms-download.mrs" },
    AI:             { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/AI.mrs" },
    GitHub:         { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/GitHub.mrs" },
    TikTok:         { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/TikTok.mrs" },
    Telegram:       { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Telegram.mrs" },
    Twitter:        { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Twitter.mrs" },
    SocialMedia:    { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/SocialMedia.mrs" },
    Games:          { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Games.mrs" },
    Crypto:         { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Crypto.mrs" },
    Netflix:        { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/Netflix.mrs" },
    YouTube:        { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release/mihomo/domain/YouTube.mrs" },
    XPTV:           { type: "http", behavior: "domain", format: "mrs", interval: 86400, url: "https://github.com/666OS/rules/raw/release