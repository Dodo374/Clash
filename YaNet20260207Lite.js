/***
 * Clash Verge Rev / Mihomo Party 优化脚本 (定制版 v2)
 * 调整: 精简游戏规则、AI增加台湾、保留高倍率、DDNS直连
 */

// --- 1. 工具函数与静态配置 ---

function stringToArray(val) {
  if (Array.isArray(val)) return val
  if (typeof val !== 'string') return []
  return val.split(';').map((item) => item.trim()).filter((item) => item.length > 0)
}

const _skipIps = '10.0.0.0/8;100.64.0.0/10;127.0.0.0/8;169.254.0.0/16;172.16.0.0/12;192.168.0.0/16;198.18.0.0/16;FC00::/7;FE80::/10;::1/128'

// DNS 配置 (阿里+腾讯 / Google+Cloudflare)
const _chinaIpDns = '223.5.5.5;119.29.29.29'
const _foreignIpDns = "8.8.8.8;1.1.1.1"

const args = typeof $arguments !== 'undefined' ? $arguments : {
  enable: true,
  excludeHighPercentage: false, // 改为 false，不排除高倍率
  globalRatioLimit: 2,
  skipIps: _skipIps,
  ipv6: true,
  logLevel: 'info'
}

let {
  enable = args.enable || true,
  excludeHighPercentage = args.excludeHighPercentage || false, // 强制关闭
  skipIps = args.skipIps || _skipIps,
  ipv6 = args.ipv6 || true,
  logLevel = args.logLevel || 'info',
} = args

skipIps = stringToArray(skipIps)

// --- 2. 地区定义 (正则与图标) ---
const regionDefinitions = [
  {
    name: '🇭🇰 香港自动',
    regex: /^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除|5x)).*$/,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png',
  },
  {
    name: '🇹🇼 台湾自动',
    regex: /^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除|5x)).*$/,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png',
  },
  {
    name: '🇯🇵 日本自动',
    regex: /^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(排除|5x)).*$/,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png',
  },
  {
    name: '🇸🇬 狮城自动',
    regex: /^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除|5x)).*$/,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png',
  },
  {
    name: '🇺🇸 美国自动',
    regex: /^(?=.*(?i)(美|🇺🇸|US|USA|SJC|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(排除|5x)).*$/,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png',
  },
  {
    name: '🇭🇰🇹🇼 港台自动',
    regex: /^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG|台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除|5x)).*$/,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/HKMTMedia.png',
  }
]

// --- 3. 基础配置对象 ---

const dnsConfig = {
  enable: true,
  listen: '0.0.0.0:53',
  ipv6: ipv6,
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.0/16',
  'fake-ip-filter': [
    '+.lan', '+.local', '+.msftncsi.com', '+.msftconnecttest.com', '+.apple.com', '+.push.apple.com',
    'network.xiaomi.com', '+.miwifi.com', 'geosite:cn',
    '+.dodo374.dynv6.net' // 防止动态域名被 Fake-IP 劫持
  ],
  nameserver: [_chinaIpDns, 'https://doh.pub/dns-query'],
  'default-nameserver': [_chinaIpDns],
  fallback: [_foreignIpDns, 'https://1.1.1.1/dns-query'],
}

const ruleProviderCommon = { type: 'http', format: 'mrs', interval: 86400, behavior: 'domain' }
const rulesUrl = "https://github.com/666OS/rules/raw/release/mihomo/domain/"

// --- 4. 服务配置 (合并逻辑) ---
const serviceConfigs = [
  {
    name: '📲 媒体社交',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/DomesticMedia.png',
    type: 'merged', 
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
    type: 'merged',
    // 游戏只保留通用 Games 规则
    priority: ['DIRECT', '🇯🇵 日本自动', '🇭🇰 香港自动', '🇹🇼 台湾自动', '🇸🇬 狮城自动'],
    ruleSets: [
      { id: 'Games', url: rulesUrl + 'Games.mrs' }
    ]
  },
  {
    name: '🤖 人工智能',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/AI.png',
    type: 'merged',
    // 增加 台湾自动 到 AI 组
    priority: ['🇺🇸 美国自动', '🇸🇬 狮城自动', '🇯🇵 日本自动', '🇹🇼 台湾自动'],
    ruleSets: [
      { id: 'AI', url: rulesUrl + 'AI.mrs' }
    ]
  },
  {
    name: '🍎 苹果服务',
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png',
    type: 'merged',
    priority: ['DIRECT', '🚀 节点选择', '🇺🇸 美国自动'],
    ruleSets: [
      { id: 'Apple', url: rulesUrl + 'Apple.mrs' }
    ]
  }
]

// --- 5. 主程序 ---

function main(config) {
  if (!enable) return config

  // 5.1 基础参数覆盖
  config['mode'] = 'rule'
  config['ipv6'] = ipv6
  config['mixed-port'] = 7890
  config['allow-lan'] = true
  config['unified-delay'] = true
  config['tcp-concurrent'] = true
  config['log-level'] = logLevel
  config['dns'] = dnsConfig
  
  // 5.2 提取代理并分类
  const proxies = config?.proxies || []
  const proxyCount = proxies.length
  
  const regionGroups = {}
  regionDefinitions.forEach(r => {
    regionGroups[r.name] = { ...r, proxies: [] }
  })
  const otherProxies = []

  for (let i = 0; i < proxyCount; i++) {
    const proxy = proxies[i]
    const name = proxy.name
    
    // 注意：此处已移除高倍率过滤逻辑，所有节点均会被保留

    let matchedAny = false
    for (const region of regionDefinitions) {
      if (new RegExp(region.regex).test(name)) {
        regionGroups[region.name].proxies.push(name)
        matchedAny = true
      }
    }

    if (!matchedAny && name !== 'DIRECT' && name !== 'REJECT') {
      otherProxies.push(name)
    }
  }

  // 5.3 构建地区策略组
  const generatedRegionGroups = []
  regionDefinitions.forEach(r => {
    const groupData = regionGroups[r.name]
    generatedRegionGroups.push({
      name: r.name,
      type: 'url-test',
      url: 'https://www.google.com/generate_204',
      interval: 300,
      tolerance: 50,
      lazy: true,
      hidden: groupData.proxies.length === 0, 
      icon: r.icon,
      proxies: groupData.proxies.length > 0 ? groupData.proxies : ['DIRECT']
    })
  })

  const regionGroupNames = generatedRegionGroups.map(g => g.name)
  
  const otherGroupName = '🌌 其他地区'
  if (otherProxies.length > 0) {
    generatedRegionGroups.push({
      name: otherGroupName,
      type: 'select',
      proxies: otherProxies,
      icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Europe_Map.png'
    })
    regionGroupNames.push(otherGroupName)
  }

  // 5.4 构建功能策略组
  const functionalGroups = []
  const allProxySelectOptions = ['♻️ 故障转移', ...regionGroupNames, 'DIRECT']

  // 主入口
  functionalGroups.push({
    name: '🚀 节点选择',
    type: 'select',
    proxies: allProxySelectOptions,
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Static.png'
  })

  // 故障转移
  functionalGroups.push({
    name: '♻️ 故障转移',
    type: 'fallback',
    url: 'https://www.google.com/generate_204',
    interval: 300,
    proxies: regionGroupNames.filter(n => n.includes('自动')),
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/ULB.png'
  })

  // 5.5 处理 Rules 和 Providers
  const rules = []
  const ruleProviders = {}

  // 优先直连: DDNS 动态域名
  rules.push('DOMAIN-SUFFIX,dodo374.dynv6.net,DIRECT')

  // 预置规则
  rules.push('RULE-SET,Tracking,REJECT')
  rules.push('RULE-SET,Advertising,REJECT')
  ruleProviders['Tracking'] = { ...ruleProviderCommon, url: rulesUrl + 'Tracking.mrs' }
  ruleProviders['Advertising'] = { ...ruleProviderCommon, url: rulesUrl + 'Advertising.mrs' }
  
  // 生成服务分组和规则
  serviceConfigs.forEach(svc => {
    svc.ruleSets.forEach(rs => {
      ruleProviders[rs.id] = { ...ruleProviderCommon, url: rs.url }
      rules.push(`RULE-SET,${rs.id},${svc.name}`)
    })

    functionalGroups.push({
      name: svc.name,
      type: 'select',
      proxies: [...svc.priority, '🚀 节点选择'],
      icon: svc.icon
    })
  })

  // 5.6 兜底规则
  rules.push('RULE-SET,China,DIRECT')
  rules.push('GEOIP,CN,DIRECT')
  rules.push('RULE-SET,Proxy,🚀 节点选择')
  rules.push('MATCH,🐟 漏网之鱼')

  ruleProviders['China'] = { ...ruleProviderCommon, url: rulesUrl + 'China.mrs' }
  ruleProviders['Proxy'] = { ...ruleProviderCommon, url: rulesUrl + 'Proxy.mrs' }

  // 漏网之鱼组
  functionalGroups.push({
    name: '🐟 漏网之鱼',
    type: 'select',
    proxies: ['🚀 节点选择', 'DIRECT'],
    icon: 'https://github.com/Koolson/Qure/raw/master/IconSet/Color/Final.png'
  })

  // 5.7 组装配置
  config['proxy-groups'] = [...functionalGroups, ...generatedRegionGroups]
  config['rules'] = rules
  config['rule-providers'] = ruleProviders

  if (!config.proxies.find(p => p.name === 'DIRECT')) {
    config.proxies.push({ name: 'DIRECT', type: 'direct', udp: true })
  }
  if (!config.proxies.find(p => p.name === 'REJECT')) {
    config.proxies.push({ name: 'REJECT', type: 'reject', udp: true })
  }

  return config
}