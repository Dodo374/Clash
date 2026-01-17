function main(config) {
  // 1. 基础配置
  const baseConfig = {
    "mixed-port": 7890,
    "allow-lan": true,
    "ipv6": false,
    "unified-delay": true,
    "tcp-concurrent": true,
    "log-level": "warning",
    "global-client-fingerprint": "chrome",
    "profile": { "store-selected": true, "store-fake-ip": true },
    "sniffer": {
      "enable": true,
      "sniff": {
        "HTTP": { "ports": [80, "8080-8880"] },
        "TLS": { "ports": [443, 8443] },
        "QUIC": { "ports": [443, 8443] }
      },
      "skip-domain": ["Mijia Cloud", "+.push.apple.com"]
    }
  };

  // 2. DNS 配置
  const dnsConfig = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "nameserver": ["223.5.5.5", "119.29.29.29"],
    "proxy-server-nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "fake-ip-filter": ["rule-set:fakeipfilter_domain"]
  };

  // 3. 地区自动组名称列表 (用于给业务组引用)
  const regionNames = ["香港-自动", "日本-自动", "台湾-自动", "新加坡-自动", "韩国-自动", "美国-自动", "俄罗斯-自动", "港台-自动", "东南亚-自动", "澳洲-自动", "欧洲-自动", "中东-自动", "拉丁美洲-自动"];

  // 4. 完整策略组 (图标地址完全按你提供的原稿手动填入)
  const proxyGroups = [
    { name: "默认代理", type: "select", proxies: ["自动选择", "手动选择", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png" },
    { name: "自动选择", type: "url-test", "include-all": true, tolerance: 20, interval: 300, filter: "^((?!(直连)).)*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png" },
    { name: "手动选择", type: "select", "include-all": true, icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Round_Robin.png" },
    
    // 游戏与业务组 (完全按原样填写)
    { name: "Steam", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Steam.png" },
    { name: "Xbox", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Xbox.png" },
    { name: "PlayStation", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/PlayStation_1.png" },
    { name: "Nintendo", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Nintendo.png" },
    { name: "AI", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/ChatGPT.png" },
    { name: "GitHub", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/GitHub.png" },
    { name: "Adobe", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Magic.png" },
    { name: "Apple", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple.png" },
    { name: "Google", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google_Search.png" },
    { name: "YouTube", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png" },
    { name: "PornHub", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Pornhub.png" },
    { name: "OneDrive", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/OneDrive.png" },
    { name: "Microsoft", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png" },
    { name: "TikTok", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/TikTok.png" },
    { name: "Telegram", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Telegram.png" },
    { name: "NETFLIX", type: "select", proxies: ["默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Netflix.png" },
    { name: "PayPal", type: "select", proxies: ["直连", "默认代理", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/PayPal.png" },

    // 地区自动组 (图标完全按你提供的第二段 YAML 原样填写)
    { name: "香港-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(港|香港|(?i)HK|Hongkong)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png" },
    { name: "日本-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(日|(?i)JP|Japan)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png" },
    { name: "台湾-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(台|湾|灣|(?i)TW|Taiwan)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png" },
    { name: "新加坡-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(新加坡|坡|狮城|SG|Singapore)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png" },
    { name: "韩国-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(韩|韩国|韓國|首尔|汉城|(?i)KR|Korea)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Korea.png" },
    { name: "美国-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(美|纽约|波特兰|达拉斯|俄勒|凤凰城|费利蒙|硅谷|拉斯|洛杉|圣何塞|圣克拉|西雅|芝加|(?i)US|States|America)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png" },
    { name: "俄罗斯-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 300, filter: "^(?=.*(俄|俄罗斯|(?i)RU|Russia)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Russia.png" },
    { name: "港台-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 60, filter: "^(?=.*(港|香港|(?i)HK|Hongkong|台|湾|灣|(?i)TW|Taiwan)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/HKMTMedia.png" },
    { name: "东南亚-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 100, filter: "^(?=.*(越|越南|柬|柬埔寨|马来西亚|泰|泰国|印度尼西亚|印尼|老挝|菲|菲律宾|(?i)VN|Vietnam|KH|Cambodia|MY|Malaysia|TH|Thailand|Indonesia|Laos|Philippines)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Malaysia.png" },
    { name: "澳洲-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 300, filter: "^(?=.*(澳洲|澳大利亚|新西兰|悉尼|墨尔本|(?i)AU|Australia|NewZealand|Sydney|Melbourne)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Australia.png" },
    { name: "欧洲-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 300, filter: "^(?=.*(德国|英国|希腊|芬兰|意大利|比利时|法国|荷兰|冰岛|瑞士|瑞典|西班牙|爱尔兰|挪威|立陶宛|波兰|(?i)GR|UK|FR|Germany|Greece|Finland|Italy|Belgium|France|Netherlands|Iceland|Switzerland|Sweden|Spain|Ireland|Norway|Poland)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/European_Union.png" },
    { name: "中东-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 300, filter: "^(?=.*(阿拉伯|迪拜|沙特|利雅得|吉达|卡塔尔|以色列|土耳其|埃及|约旦|开罗|巴林|利比亚|也门|(?i)Arab|Dubai|Saudi|Arabia|Riyadh|Jeddah|Qatar|Israel|Turkey|Egypt|Jordan|Cairo|Bahrain|Libya|Yemen)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Turkey.png" },
    { name: "拉丁美洲-自动", type: "url-test", "include-all": true, tolerance: 20, interval: 300, filter: "^(?=.*(巴西|阿根廷|墨西哥|秘鲁|玻利维亚|智利|哥伦比亚|厄瓜多尔|巴拉圭|乌拉圭|委内瑞拉|(?i)Brazil|Argentina|Mexico|Peru|Bolivia|Chile|Colombia|Ecuador|Paraguay|Venezuela|Uruguay)).*$", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Brazil.png" },
    
    { name: "漏网之鱼", type: "select", proxies: ["直连", "自动选择", ...regionNames], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Available_1.png" }
  ];

  // 5. Rule Providers (同步 YAML 原稿)
  const ruleProviders = {
    "fakeipfilter_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/wwqgtxx/clash-rules/release/fakeip-filter.mrs" },
    "private_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs" },
    "proxylite": { type: "http", interval: 86400, behavior: "classical", format: "text", url: "https://raw.githubusercontent.com/qichiyuhub/rule/refs/heads/main/proxy.list" },
    "gamedownload_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-game-platforms-download.mrs" },
    "Download_domain": { type: "http", interval: 86400, behavior: "classical", format: "text", url: "https://github.com/blackmatrix7/ios_rule_script/raw/refs/heads/master/rule/Clash/Download/Download.list" },
    "apple_cn_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple-cn.mrs" },
    "apple_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/apple.mrs" },
    "nvidia_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/nvidia.mrs" },
    "steam_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam.mrs" },
    "xbox_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/xbox.mrs" },
    "playstation_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/playstation.mrs" },
    "nintendo_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/nintendo.mrs" },
    "adobe_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/adobe.mrs" },
    "ai_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-ai-!cn.mrs" },
    "youtube_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs" },
    "pornhub_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/pornhub.mrs" },
    "google_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs" },
    "github_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs" },
    "telegram_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs" },
    "netflix_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs" },
    "paypal_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/paypal.mrs" },
    "onedrive_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/onedrive.mrs" },
    "microsoft_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs" },
    "speedtest_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/ookla-speedtest.mrs" },
    "tiktok_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs" },
    "geolocation-!cn": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs" },
    "cn_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs" },
    "private_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs" },
    "cn_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs" },
    "google_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs" },
    "telegram_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs" },
    "netflix_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs" },
    "apple_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta-lite/geoip/apple.mrs" }
  };

  // 6. 规则列表
  const rules = [
    "RULE-SET,private_ip,直连",
    "RULE-SET,private_domain,直连",
    "RULE-SET,proxylite,默认代理",
    "RULE-SET,speedtest_domain,默认代理",
    "RULE-SET,gamedownload_domain,直连",
    "RULE-SET,Download_domain,直连",
    "RULE-SET,apple_cn_domain,直连",
    "RULE-SET,nvidia_domain,直连",
    "RULE-SET,xbox_domain,Xbox",
    "RULE-SET,playstation_domain,PlayStation",
    "RULE-SET,nintendo_domain,Nintendo",
    "RULE-SET,steam_domain,Steam",
    "RULE-SET,adobe_domain,Adobe",
    "DOMAIN-SUFFIX,qichiyu.com,默认代理",
    "RULE-SET,ai_domain,AI",
    "RULE-SET,github_domain,GitHub",
    "RULE-SET,youtube_domain,YouTube",
    "RULE-SET,pornhub_domain,PornHub",
    "RULE-SET,google_domain,Google",
    "RULE-SET,onedrive_domain,OneDrive",
    "RULE-SET,microsoft_domain,Microsoft",
    "RULE-SET,apple_domain,Apple",
    "RULE-SET,tiktok_domain,TikTok",
    "RULE-SET,telegram_domain,Telegram",
    "RULE-SET,netflix_domain,NETFLIX",
    "RULE-SET,paypal_domain,PayPal",
    "RULE-SET,apple_ip,直连,no-resolve",
    "RULE-SET,google_ip,Google,no-resolve",
    "RULE-SET,netflix_ip,NETFLIX,no-resolve",
    "RULE-SET,telegram_ip,Telegram,no-resolve",
    "RULE-SET,geolocation-!cn,默认代理",
    "RULE-SET,cn_domain,直连",
    "RULE-SET,cn_ip,直连",
    "MATCH,漏网之鱼"
  ];

  // 合并配置
  config = { ...config, ...baseConfig, dns: dnsConfig, "rule-providers": ruleProviders, "proxy-groups": proxyGroups, rules: rules };
  if (!config.proxies) config.proxies = [];
  config.proxies.push({ name: "直连", type: "direct", icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Direct.png" });

  return config;
}