// --- 1. 工具函数 ---

function stringToArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val !== 'string') return [];
  return val.split(';').map(function(item) { return item.trim(); }).filter(function(item) { return item.length > 0; });
}

// 核心匹配函数：替代复杂的正则断言
function isRegionMatch(nodeName, includes, excludes) {
  var name = nodeName.toLowerCase();
  // 检查是否包含关键词
  var hasInclude = includes.some(function(it) { return name.indexOf(it.toLowerCase()) !== -1; });
  if (!hasInclude) return false;
  // 检查是否包含排除词
  var hasExclude = excludes.some(function(it) { return name.indexOf(it.toLowerCase()) !== -1; });
  return !hasExclude;
}

// --- 2. 静态配置 ---

var _skipIps = '10.0.0.0/8;100.64.0.0/10;127.0.0.0/8;169.254.0.0/16;172.16.0.0/12;192.168.0.0/16;198.18.0.0/16;FC00::/7;FE80::/10;::1/128';
var _chinaIpDns = '223.5.5.5;119.29.29.29';
var _foreignIpDns = '8.8.8.8;1.1.1.1';

var args = {
  enable: true,
  excludeHighPercentage: false, // 不排除高倍率
  ipv6: true,
  logLevel: 'info'
};

// --- 3. 地区定义 (使用关键词数组，避开正则) ---

var regionDefinitions = [
  {
    name: '🇭🇰 香港自动',
    inc: ['港', '🇭🇰', 'HK', 'Hong', 'HKG'],
    exc: ['排除', '5x', '官网', '流量'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png'
  },
  {
    name: '🇹🇼 台湾自动',
    inc: ['台', '🇹🇼', 'TW', 'Tai', 'TPE'],
    exc: ['排除', '5x'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png'
  },
  {
    name: '🇯🇵 日本自动',
    inc: ['日', '🇯🇵', 'JP', 'Japan', 'NRT', 'HND'],
    exc: ['排除', '5x'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png'
  },
  {
    name: '🇸🇬 狮城自动',
    inc: ['坡', '🇸🇬', 'SG', 'Sing', 'SIN'],
    exc: ['排除', '5x'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png'
  },
  {
    name: '🇺🇸 美国自动',
    inc: ['美', '🇺🇸', 'US', 'USA', 'JFK', 'LAX'],
    exc: ['排除', '5x'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png'
  },
  {
    name: '🇭🇰🇹🇼 港台自动',
    inc: ['港', '🇭🇰', 'HK', '台', '🇹🇼', 'TW'],
    exc: ['排除', '5x'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/HKMTMedia.png'
  }
];

// --- 4. 基础配置对象 ---

var dnsConfig = {
  enable: true,
  ipv6: args.ipv6,
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.0/16',
  'fake-ip-filter': ['+.lan', '+.local', '+.apple.com', 'geosite:cn', '+.dodo374.dynv6.net'],
  nameserver: [_chinaIpDns, 'https://doh.pub/dns-query'],
  'default-nameserver': [_chinaIpDns],
  fallback: [_foreignIpDns, 'https://1.1.1.1/dns-query']
};

var ruleProviderCommon = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain' };
var rulesUrl = "https://github.com/666OS/rules/raw/release/mihomo/domain/";

// --- 5. 服务与规则配置 ---

var serviceConfigs = [
  {
    name: '📲 媒体社交',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/DomesticMedia.png',
    priority: ['🇭🇰 香港自动', '🇸🇬 狮城自动', '🇯🇵 日本自动', '🇹🇼 台湾自动', '🇺🇸 美国自动', '🇭🇰🇹🇼 港台自动'],
    ruleSets: [
      { id: 'Telegram', url: rulesUrl + 'Telegram.mrs' },
      { id: 'Twitter', url: rulesUrl + 'Twitter.mrs' },
      { id: 'SocialMedia', url: rulesUrl + 'SocialMedia.mrs' },
      { id: 'YouTube', url: rulesUrl + 'YouTube.mrs' },
      { id: 'Netflix', url: rulesUrl + 'Netflix.mrs' },
      { id: 'Emby', url: rulesUrl + 'Emby.mrs' },
      { id: 'Streaming', url: rulesUrl + 'Streaming.mrs' },
      { id: 'Google', url: rulesUrl + 'Google.mrs' }
    ]
  },
  {
    name: '🎮 游戏平台',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Game.png',
    priority: ['DIRECT', '🇯🇵 日本自动', '🇭🇰 香港自动', '🇹🇼 台湾自动', '🇸🇬 狮城自动'],
    ruleSets: [ { id: 'Games', url: rulesUrl + 'Games.mrs' } ]
  },
  {
    name: '🤖 人工智能',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/AI.png',
    priority: ['🇺🇸 美国自动', '🇹🇼 台湾自动', '🇸🇬 狮城自动', '🇯🇵 日本自动'],
    ruleSets: [ { id: 'AI', url: rulesUrl + 'AI.mrs' } ]
  },
  {
    name: '🍎 苹果服务',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png',
    priority: ['DIRECT', '🚀 节点选择', '🇺🇸 美国自动'],
    ruleSets: [ { id: 'Apple', url: rulesUrl + 'Apple.mrs' } ]
  }
];

// --- 6. 主程序 ---

function main(config) {
  if (!args.enable) return config;

  config['mode'] = 'rule';
  config['ipv6'] = args.ipv6;
  config['unified-delay'] = true;
  config['tcp-concurrent'] = true;
  config['dns'] = dnsConfig;

  var proxies = config.proxies || [];
  var regionGroups = {};
  regionDefinitions.forEach(function(r) { regionGroups[r.name] = []; });
  var otherProxies = [];

  // 节点分拣 (使用安全匹配逻辑)
  proxies.forEach(function(p) {
    var matchedAny = false;
    regionDefinitions.forEach(function(r) {
      if (isRegionMatch(p.name, r.inc, r.exc)) {
        regionGroups[r.name].push(p.name);
        matchedAny = true;
      }
    });
    if (!matchedAny && p.name !== 'DIRECT' && p.name !== 'REJECT') {
      otherProxies.push(p.name);
    }
  });

  // 构建地区策略组
  var generatedRegionGroups = [];
  regionDefinitions.forEach(function(r) {
    var nodes = regionGroups[r.name];
    generatedRegionGroups.push({
      name: r.name,
      type: 'url-test',
      url: 'https://www.google.com/generate_204',
      interval: 300,
      tolerance: 50,
      hidden: nodes.length === 0,
      icon: r.icon,
      proxies: nodes.length > 0 ? nodes : ['DIRECT']
    });
  });

  var regionGroupNames = generatedRegionGroups.map(function(g) { return g.name; });
  if (otherProxies.length > 0) {
    generatedRegionGroups.push({
      name: '🌌 其他地区',
      type: 'select',
      proxies: otherProxies,
      icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Europe_Map.png'
    });
    regionGroupNames.push('🌌 其他地区');
  }

  // 构建功能策略组
  var functionalGroups = [];
  functionalGroups.push({
    name: '🚀 节点选择',
    type: 'select',
    proxies: ['♻️ 故障转移'].concat(regionGroupNames, ['DIRECT']),
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Static.png'
  });

  functionalGroups.push({
    name: '♻️ 故障转移',
    type: 'fallback',
    url: 'https://www.google.com/generate_204',
    interval: 300,
    proxies: regionGroupNames,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/ULB.png'
  });

  // 处理规则与提供者
  var rules = ['DOMAIN-SUFFIX,dodo374.dynv6.net,DIRECT'];
  var ruleProviders = {};
  
  rules.push('RULE-SET,Tracking,REJECT', 'RULE-SET,Advertising,REJECT');
  ruleProviders['Tracking'] = ruleProviderCommon; 
  ruleProviders['Tracking'].url = rulesUrl + 'Tracking.mrs';
  ruleProviders['Advertising'] = ruleProviderCommon;
  ruleProviders['Advertising'].url = rulesUrl + 'Advertising.mrs';

  serviceConfigs.forEach(function(svc) {
    svc.ruleSets.forEach(function(rs) {
      ruleProviders[rs.id] = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain', url: rs.url };
      rules.push('RULE-SET,' + rs.id + ',' + svc.name);
    });
    functionalGroups.push({ name: svc.name, type: 'select', proxies: svc.priority.concat(['🚀 节点选择']), icon: svc.icon });
  });

  rules.push('RULE-SET,China,DIRECT', 'GEOIP,CN,DIRECT', 'RULE-SET,Proxy,🚀 节点选择', 'MATCH,🐟 漏网之鱼');
  ruleProviders['China'] = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain', url: rulesUrl + 'China.mrs' };
  ruleProviders['Proxy'] = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain', url: rulesUrl + 'Proxy.mrs' };

  functionalGroups.push({
    name: '🐟 漏网之鱼',
    type: 'select',
    proxies: ['🚀 节点选择', 'DIRECT'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Final.png'
  });

  config['proxy-groups'] = functionalGroups.concat(generatedRegionGroups);
  config['rules'] = rules;
  config['rule-providers'] = ruleProviders;

  return config;
}
