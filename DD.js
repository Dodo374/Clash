// Clash Verge Rev 覆写脚本 - 完整版
function main(config) {
  // 1. 基础全局配置
  const baseConfig = {
    "mixed-port": 7890,
    "allow-lan": true,
    "bind-address": "*",
    "ipv6": false,
    "unified-delay": true,
    "tcp-concurrent": true,
    "log-level": "warning",
    "find-process-mode": "off",
    "global-client-fingerprint": "chrome",
    "profile": {
      "store-selected": true,
      "store-fake-ip": true
    },
    "sniffer": {
      "enable": true,
      "sniff": {
        "HTTP": { "ports": [80, "8080-8880"], "override-destination": false },
        "TLS": { "ports": [443, 8443] },
        "QUIC": { "ports": [443, 8443] }
      },
      "skip-domain": ["Mijia Cloud", "+.push.apple.com"]
    }
  };

  // 2. DNS 配置
  const dnsConfig = {
    "enable": true,
    "cache-algorithm": "arc",
    "listen": "0.0.0.0:1053",
    "ipv6": false,
    "respect-rules": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": ["rule-set:fakeipfilter_domain"],
    "default-nameserver": ["https://223.5.5.5/dns-query"],
    "proxy-server-nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "nameserver": ["223.5.5.5", "119.29.29.29"]
  };

  // 3. 自动测速组定义 (这里的 filter 与你 YAML 一致)
  const regionGroups = [
    { name: "香港-自动", filter: "(港|香港|(?i)HK|Hongkong)", icon: "Hong_Kong.png" },
    { name: "日本-自动", filter: "(日|(?i)JP|Japan)", icon: "Japan.png" },
    { name: "台湾-自动", filter: "(台|湾|灣|(?i)TW|Taiwan)", icon: "Taiwan.png" },
    { name: "新加坡-自动", filter: "(新加坡|坡|(?i)SG|Singapore)", icon: "Singapore.png" },
    { name: "韩国-自动", filter: "(韩|韩国|(?i)KR|Korea)", icon: "Korea.png" },
    { name: "美国-自动", filter: "(美|纽约|(?i)US|States|America)", icon: "United_States.png" },
    { name: "俄罗斯-自动", filter: "(俄|俄罗斯|(?i)RU|Russia)", icon: "Russia.png" },
    { name: "东南亚-自动", filter: "(越|越南|柬|马来西亚|泰|印尼|(?i)VN|MY|TH|ID)", icon: "Malaysia.png" },
    { name: "澳洲-自动", filter: "(澳洲|澳大利亚|新西兰|(?i)AU|NZ)", icon: "Australia.png" },
    { name: "欧洲-自动", filter: "(德国|英国|法国|荷兰|瑞士|(?i)UK|FR|DE|NL|CH)", icon: "European_Union.png" }
  ];

  // 4. 构建策略组
  const autoGroupNames = regionGroups.map(g => g.name);
  
  const proxyGroups = [
    {
      name: "默认代理",
      type: "select",
      proxies: ["自动选择", "手动选择", ...autoGroupNames],
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png"
    },
    {
      name: "自动选择",
      type: "url-test",
      "include-all": true,
      tolerance: 20,
      interval: 300,
      filter: "^((?!(直连)).)*$", // 解决你提到的直连 Timeout 问题
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png"
    },
    {
      name: "手动选择",
      type: "select",
      "include-all": true,
      icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Round_Robin.png"
    },
    // 以下为业务分流组
    { name: "AI", type: "select", proxies: ["默认代理", "美国-自动", "日本-自动", "新加坡-自动"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/ChatGPT.png" },
    { name: "YouTube", type: "select", proxies: ["默认代理", "香港-自动", "美国-自动"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png" },
    { name: "Google", type: "select", proxies: ["默认代理", "香港-自动", "美国-自动"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google_Search.png" },
    { name: "Telegram", type: "select", proxies: ["默认代理", "新加坡-自动", "香港-自动"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Telegram.png" },
    { name: "Apple", type: "select", proxies: ["直连", "默认代理"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple.png" },
    { name: "Microsoft", type: "select", proxies: ["直连", "默认代理"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png" },
    { name: "漏网之鱼", type: "select", proxies: ["直连", "默认代理", "自动选择"], icon: "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Available_1.png" }
  ];

  // 动态生成所有地区的自动测速组
  regionGroups.forEach(g => {
    proxyGroups.push({
      name: g.name,
      type: "url-test",
      "include-all": true,
      tolerance: 20,
      interval: 60,
      filter: `^(?=.*${g.filter}).*$`,
      icon: `https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/${g.icon}`
    });
  });

  // 5. 规则集配置 (Rule Providers)
  const ruleProviders = {
    "fakeipfilter_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/wwqgtxx/clash-rules/release/fakeip-filter.mrs" },
    "private_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs" },
    "proxylite": { type: "http", interval: 86400, behavior: "classical", format: "text", url: "https://raw.githubusercontent.com/qichiyuhub/rule/refs/heads/main/proxy.list" },
    "ai_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-ai-!cn.mrs" },
    "youtube_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs" },
    "google_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs" },
    "telegram_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs" },
    "cn_domain": { type: "http", interval: 86400, behavior: "domain", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs" },
    "private_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs" },
    "cn_ip": { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs", url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs" }
  };

  // 6. 分流规则
  const rules = [
    "RULE-SET,private_ip,直连",
    "RULE-SET,private_domain,直连",
    "RULE-SET,proxylite,默认代理",
    "RULE-SET,ai_domain,AI",
    "RULE-SET,youtube_domain,YouTube",
    "RULE-SET,google_domain,Google",
    "RULE-SET,telegram_domain,Telegram",
    "RULE-SET,cn_domain,直连",
    "RULE-SET,cn_ip,直连",
    "MATCH,漏网之鱼"
  ];

  // 7. 写入配置 (保持 proxies 部分不动，仅修改其他部分)
  config["mixed-port"] = baseConfig["mixed-port"];
  config["allow-lan"] = baseConfig["allow-lan"];
  config["ipv6"] = baseConfig["ipv6"];
  config["log-level"] = baseConfig["log-level"];
  config["unified-delay"] = baseConfig["unified-delay"];
  config["tcp-concurrent"] = baseConfig["tcp-concurrent"];
  config["dns"] = dnsConfig;
  config["rule-providers"] = ruleProviders;
  config["proxy-groups"] = proxyGroups;
  config["rules"] = rules;
  
  // 如果你有特殊的直连 Proxy 定义
  if (!config.proxies) config.proxies = [];
  config.proxies.push({ name: "直连", type: "direct" });

  return config;
}