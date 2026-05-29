
export type Brand = 'VIRTAVO' | 'ShowMo';
export type IssueSource = 'APP工单' | '邮件' | '运营反馈';
export type IssueStatus = '待处理' | '处理中' | '待确认' | '已解决' | '已关闭' | '搁置中';
export type Priority = '高' | '中' | '低';
export type DelayStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type Platform = 'iOS' | 'Android' | '双平台';
export type IssueType = '软件' | '硬件' | '服务器';

export interface DelayRequest {
  status: DelayStatus;
  reason: string;
  requestedDate: string;
  appliedAt: string;
  respondedAt?: string;
}

/** 开发反馈 — 记录技术侧的分析与处理信息 */
export interface DevelopmentFeedback {
  rootCause?: string;            // 问题原因分析
  solution?: string;             // 解决方案描述
  estimatedResolveTime?: string; // 技术侧预估解决时间
  actualResolveTime?: string;    // 实际解决时间
  devOwner?: string;             // 负责开发
  testOwner?: string;            // 负责测试
  updatedAt?: string;            // 最后更新时间
}

export interface Issue {
  id: string;
  title: string;
  brand: Brand;
  product: string;
  category: string;
  country: string;
  source: IssueSource;
  status: IssueStatus;
  priority: Priority;
  issueType?: IssueType;         // 软件 / 硬件 / 服务器
  platform?: Platform;
  feedbackCount?: number;
  deviceSN?: string;             // 设备 SN
  appAccount?: string;           // APP 账号（邮箱/手机）
  reporter: string;
  reporterAvatar: string;
  owner: string;
  ownerAvatar: string;
  expectedDate: string;
  estimatedDate?: string;
  progress: number;
  delayRequest?: DelayRequest;
  devFeedback?: DevelopmentFeedback;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  description: string;
  tags: string[];
}

export const PRODUCTS: Record<Brand, string[]> = {
  VIRTAVO: ['酒壶机2K', '酒壶机200ai', '双目小蛋(EggSentry)', '熊猫机'],
  ShowMo: ['MileHub Kit', 'WinEye', 'MileFlask'],
};

export const CATEGORIES = [
  '配网失败','设备离线','不开机','耗电快',
  '检测问题','账号相关','卡不识别','加载不出图',
  '客户咨询','意见建议','固件升级','云存储',
];

export const COUNTRIES = ['US','GB','IT','DE','JP','FR','CA','ES','AU','SE','CN'];

export const TEAM_MEMBERS = [
  { name: '李铧燕', avatar: 'LHY', color: '#4FA7A0', email: 'lihyuan@puwell.com',  wechat: 'lihyuan_pw', title: '市场与传播经理' },
  { name: '王芳',   avatar: 'WF',  color: '#6C63FF', email: 'wangfang@puwell.com', wechat: 'wangfang_pw', title: '产品经理' },
  { name: '张伟',   avatar: 'ZW',  color: '#FF9F43', email: 'zhangwei@puwell.com', wechat: 'zhangwei_pw', title: '固件工程师' },
  { name: '陈静',   avatar: 'CJ',  color: '#FF6B6B', email: 'chenjing@puwell.com', wechat: 'chenjing_pw', title: '客服主管' },
  { name: '刘洋',   avatar: 'LY',  color: '#22c55e', email: 'liuyang@puwell.com',  wechat: 'liuyang_pw',  title: '测试工程师' },
];

export function getOverdueDays(issue: Issue): number {
  const deadline = issue.estimatedDate || issue.expectedDate;
  if (!deadline) return 0;
  const today = new Date();
  const due   = new Date(deadline);
  const diff  = Math.ceil((today.getTime() - due.getTime()) / 86400000);
  return diff > 0 && issue.status !== '已解决' && issue.status !== '已关闭' ? diff : 0;
}

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISS-001', title: '酒壶机2K配网失败 - 大量US用户反馈',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '配网失败',
    country: 'US', source: 'APP工单', status: '处理中', priority: '高',
    issueType: '软件', platform: 'iOS', feedbackCount: 470,
    deviceSN: 'HK2K-US-2024-XXXXX', appAccount: 'user@example.com',
    reporter: '陈静', reporterAvatar: 'CJ',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-05-12', estimatedDate: '2026-05-14',
    progress: 55,
    delayRequest: { status: 'approved', reason: '固件组需更多时间复现问题', requestedDate: '2026-05-18', appliedAt: '2026-05-12 10:30', respondedAt: '2026-05-12 14:00' },
    devFeedback: {
      rootCause: '2.4G WiFi 下 AP 隔离模式与设备广播报文冲突，固件版本 V5.20.40.01 的配网握手超时阈值过短（3s）导致批量失败',
      solution: '升级固件至 V5.20.44.00，将握手超时阈值调整为 8s，并增加重试机制（最多3次）',
      estimatedResolveTime: '2026-05-18',
      devOwner: '张伟',
      testOwner: '刘洋',
      updatedAt: '2026-05-13 16:00',
    },
    createdAt: '2026-05-01', updatedAt: '2026-05-13',
    description: '大量US用户反馈酒壶机2K在2.4G WiFi环境下无法配网，已收到470+工单，主要集中在iOS用户，固件版本V5.20.40.01。',
    tags: ['固件','iOS','批量'],
  },
  {
    id: 'ISS-002', title: '双目小蛋(EggSentry) 直播5分钟自动断开',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '加载不出图',
    country: 'GB', source: '邮件', status: '待确认', priority: '高',
    issueType: '软件', platform: 'iOS', feedbackCount: 38,
    appAccount: 'gb_user@gmail.com',
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-05-10', estimatedDate: '2026-05-11',
    progress: 80,
    delayRequest: { status: 'pending', reason: 'App后台限制需与iOS团队对接', requestedDate: '2026-05-16', appliedAt: '2026-05-11 09:15' },
    devFeedback: {
      rootCause: 'iOS 后台 App 刷新策略在低电量模式下强制挂起网络连接，导致 RTSP 流中断',
      solution: '修改 App 保活机制，使用 Background Task API 维持连接；同时在服务端增加断流自动重连逻辑',
      estimatedResolveTime: '2026-05-16',
      devOwner: '王芳',
      testOwner: '刘洋',
      updatedAt: '2026-05-11 10:00',
    },
    createdAt: '2026-04-28', updatedAt: '2026-05-11',
    description: 'GB用户反馈直播仅持续5分钟后自动停止，iPad端更为明显，疑为App后台限制问题。',
    tags: ['直播','iPad','App'],
  },
  {
    id: 'ISS-003', title: '熊猫机固件更新后设备无法开机',
    brand: 'VIRTAVO', product: '熊猫机', category: '不开机',
    country: 'GB', source: 'APP工单', status: '处理中', priority: '高',
    issueType: '硬件', platform: '双平台', feedbackCount: 15,
    deviceSN: 'PD-GB-2024-00392',
    reporter: '李铧燕', reporterAvatar: 'LHY',
    owner: '张伟', ownerAvatar: 'ZW',
    expectedDate: '2026-05-10',
    progress: 30,
    createdAt: '2026-05-02', updatedAt: '2026-05-11',
    description: '防火墙固件更新后设备关机，充电显示红灯，断电后闪绿灯然后无反应，共15+工单。',
    tags: ['固件','不开机','批量'],
  },
  {
    id: 'ISS-004', title: 'MileHub Kit 基站连接稳定性问题',
    brand: 'ShowMo', product: 'MileHub Kit', category: '设备离线',
    country: 'US', source: '运营反馈', status: '待处理', priority: '中',
    issueType: '硬件', platform: 'Android', feedbackCount: 12,
    deviceSN: 'MH-US-2025-10087',
    reporter: '陈静', reporterAvatar: 'CJ',
    owner: '陈静', ownerAvatar: 'CJ',
    expectedDate: '2026-05-20',
    progress: 0,
    createdAt: '2026-05-05', updatedAt: '2026-05-05',
    description: '运营团队测试发现MileHub Kit基站在超过500米距离时连接不稳定，部分摄像头频繁掉线。',
    tags: ['测试','距离','稳定性'],
  },
  {
    id: 'ISS-005', title: '酒壶机 SD卡不识别 - IT/DE用户',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '卡不识别',
    country: 'IT', source: 'APP工单', status: '搁置中', priority: '中',
    issueType: '硬件', platform: 'Android', feedbackCount: 87,
    deviceSN: 'HK2K-IT-2024-88821',
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '李铧燕', ownerAvatar: 'LHY',
    expectedDate: '2026-05-05', estimatedDate: '2026-05-07',
    progress: 20,
    delayRequest: { status: 'rejected', reason: '暂时无法复现，建议搁置', requestedDate: '2026-05-15', appliedAt: '2026-05-07 11:00', respondedAt: '2026-05-07 15:30' },
    devFeedback: {
      rootCause: '部分批次 SD 卡槽弹片弹力不足导致接触不良，IT/DE 批次集中在 2024-Q3 出货',
      solution: '已通知工厂对 2024-Q3 批次进行售后换件处理；新批次已更换弹片供应商',
      estimatedResolveTime: '2026-05-15',
      devOwner: '张伟',
      testOwner: '刘洋',
      updatedAt: '2026-05-10 14:30',
    },
    createdAt: '2026-04-16', updatedAt: '2026-05-10',
    description: '意大利、德国用户大量反馈SD卡不识别问题，已更新固件后仍存在，共收到87+工单。',
    tags: ['SD卡','硬件','IT','DE'],
  },
  {
    id: 'ISS-006', title: 'WinEye 窗装摄像头夜视效果差',
    brand: 'ShowMo', product: 'WinEye', category: '检测问题',
    country: 'US', source: '邮件', status: '处理中', priority: '中',
    issueType: '软件', platform: '双平台', feedbackCount: 24,
    appAccount: 'ks_backer_142@mail.com',
    reporter: '刘洋', reporterAvatar: 'LY',
    owner: '刘洋', ownerAvatar: 'LY',
    expectedDate: '2026-05-18', estimatedDate: '2026-05-17',
    progress: 60,
    createdAt: '2026-04-20', updatedAt: '2026-05-12',
    description: '多名Kickstarter支持者反馈夜视画质模糊，IR灯照射范围不足，需要固件优化。',
    tags: ['夜视','画质','Kickstarter'],
  },
  {
    id: 'ISS-007', title: '双目小蛋 配网成功率低于60% - JP市场',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '配网失败',
    country: 'JP', source: 'APP工单', status: '已解决', priority: '高',
    issueType: '软件', platform: 'iOS', feedbackCount: 203,
    reporter: '李铧燕', reporterAvatar: 'LHY',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-05-01', estimatedDate: '2026-05-01',
    progress: 100,
    devFeedback: {
      rootCause: '日本市场路由器普遍启用 AP 隔离，设备 mDNS 广播被过滤，导致配网握手失败',
      solution: '固件 V7.04.15 引入 unicast 配网模式，绕过 mDNS 依赖',
      estimatedResolveTime: '2026-05-01',
      actualResolveTime: '2026-05-01',
      devOwner: '张伟',
      testOwner: '刘洋',
      updatedAt: '2026-05-01 18:00',
    },
    createdAt: '2026-04-02', updatedAt: '2026-05-01', resolvedAt: '2026-05-01',
    description: '日本市场配网成功率长期低于60%，主要因AP隔离模式导致，已通过固件V7.04.15修复。',
    tags: ['固件','JP','已修复'],
  },
  {
    id: 'ISS-008', title: '酒壶机耗电过快 - 太阳能充电不足',
    brand: 'VIRTAVO', product: '酒壶机200ai', category: '耗电快',
    country: 'US', source: 'APP工单', status: '待处理', priority: '低',
    issueType: '硬件', platform: 'Android', feedbackCount: 23,
    deviceSN: 'HK200-US-2025-44012',
    reporter: '陈静', reporterAvatar: 'CJ',
    owner: '张伟', ownerAvatar: 'ZW',
    expectedDate: '2026-05-25',
    progress: 5,
    createdAt: '2026-05-08', updatedAt: '2026-05-08',
    description: '用户反馈在持续录制模式下太阳能充电速度不及耗电速度，约23+工单，建议优化工作模式。',
    tags: ['电池','太阳能','工作模式'],
  },
  {
    id: 'ISS-009', title: 'MileFlask 迷彩版首次绑定失败',
    brand: 'ShowMo', product: 'MileFlask', category: '配网失败',
    country: 'CA', source: '运营反馈', status: '处理中', priority: '中',
    issueType: '软件', platform: 'iOS', feedbackCount: 3,
    deviceSN: 'MF10-CA-2025-00312',
    reporter: '刘洋', reporterAvatar: 'LY',
    owner: '陈静', ownerAvatar: 'CJ',
    expectedDate: '2026-05-15', estimatedDate: '2026-05-16',
    progress: 45,
    delayRequest: { status: 'approved', reason: '需等待新批次设备到货测试', requestedDate: '2026-05-22', appliedAt: '2026-05-15 08:00', respondedAt: '2026-05-15 10:30' },
    createdAt: '2026-05-10', updatedAt: '2026-05-13',
    description: '新品MF.1.0迷彩版在首次绑定时部分设备无法完成配对，测试了20台中有3台存在此问题。',
    tags: ['新品','测试','绑定'],
  },
  {
    id: 'ISS-010', title: '熊猫机检测灵敏度过高误报',
    brand: 'VIRTAVO', product: '熊猫机', category: '检测问题',
    country: 'AU', source: '邮件', status: '已解决', priority: '低',
    issueType: '软件', platform: '双平台', feedbackCount: 56,
    appAccount: 'au_homeuser@outlook.com',
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '刘洋', ownerAvatar: 'LY',
    expectedDate: '2026-04-25', estimatedDate: '2026-04-24',
    progress: 100,
    devFeedback: {
      rootCause: '热成像算法温度阈值默认值过低（ΔT=1.2°C），正常环境光变化即触发报警',
      solution: 'App 4.0.8014 版本新增自定义检测区域与灵敏度调节（ΔT 可配置 1~5°C）',
      estimatedResolveTime: '2026-04-24',
      actualResolveTime: '2026-04-24',
      devOwner: '王芳',
      testOwner: '刘洋',
      updatedAt: '2026-04-24 17:30',
    },
    createdAt: '2026-04-10', updatedAt: '2026-04-25', resolvedAt: '2026-04-25',
    description: '澳大利亚用户反馈热成像检测误报严重，已通过App 4.0.8014新版本的检测区域设置功能解决。',
    tags: ['检测','误报','已修复'],
  },
  {
    id: 'ISS-011', title: '国内小蛋配网失败持续高发',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '配网失败',
    country: 'CN', source: '运营反馈', status: '处理中', priority: '高',
    issueType: '服务器', platform: '双平台', feedbackCount: 44,
    reporter: '李铧燕', reporterAvatar: 'LHY',
    owner: '李铧燕', ownerAvatar: 'LHY',
    expectedDate: '2026-05-12', estimatedDate: '2026-05-13',
    progress: 65,
    devFeedback: {
      rootCause: '国内 IoT 配网服务器 CDN 节点在华北区域存在间歇性丢包（丢包率约 8%），导致配网指令超时',
      solution: '联系 CDN 供应商扩容华北节点；同时优化配网协议增加服务端确认重传机制',
      estimatedResolveTime: '2026-05-13',
      devOwner: '李铧燕',
      testOwner: '刘洋',
      updatedAt: '2026-05-13 09:00',
    },
    createdAt: '2026-04-18', updatedAt: '2026-05-13',
    description: '国内4.18-5.14期间共44条配网失败客诉，安卓/iOS均有，主要集中在XD1-V129固件，已排查出路由器兼容性问题。',
    tags: ['国内','批量','路由器'],
  },
  {
    id: 'ISS-012', title: '酒壶机账号验证码收不到',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '账号相关',
    country: 'IT', source: 'APP工单', status: '已关闭', priority: '低',
    issueType: '服务器', platform: 'iOS', feedbackCount: 9,
    appAccount: 'it_user88@libero.it',
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-04-20', estimatedDate: '2026-04-19',
    progress: 100,
    devFeedback: {
      rootCause: '意大利 libero.it 邮件服务商将我方发信 IP 列入黑名单，验证码邮件被拒收',
      solution: '更换邮件发送服务商为 AWS SES，并添加 SPF/DKIM 记录提升到达率',
      estimatedResolveTime: '2026-04-19',
      actualResolveTime: '2026-04-20',
      devOwner: '王芳',
      testOwner: '刘洋',
      updatedAt: '2026-04-20 11:00',
    },
    createdAt: '2026-04-15', updatedAt: '2026-04-20', resolvedAt: '2026-04-20',
    description: '意大利用户注册时无法收到验证码，已确认为邮件服务商屏蔽问题，引导用户更换邮箱后解决。',
    tags: ['账号','邮件','已关闭'],
  },
];

export const WEEKLY_STATS = [
  { week: '4.2-4.8',   total: 82,  solved: 65, virtavo: 68, showmo: 14 },
  { week: '4.9-4.15',  total: 91,  solved: 72, virtavo: 78, showmo: 13 },
  { week: '4.16-4.22', total: 78,  solved: 61, virtavo: 64, showmo: 14 },
  { week: '4.23-4.29', total: 95,  solved: 74, virtavo: 80, showmo: 15 },
  { week: '4.30-5.6',  total: 110, solved: 88, virtavo: 93, showmo: 17 },
  { week: '5.7-5.13',  total: 98,  solved: 71, virtavo: 82, showmo: 16 },
];

export const CATEGORY_STATS = [
  { name: '配网失败', value: 38, fill: '#4FA7A0' },
  { name: '设备离线', value: 22, fill: '#6C63FF' },
  { name: '不开机',   value: 12, fill: '#FF6B6B' },
  { name: '检测问题', value: 10, fill: '#FF9F43' },
  { name: '卡不识别', value:  8, fill: '#D1E83E' },
  { name: '其他',     value: 10, fill: '#A0AEC0' },
];

export const SOURCE_STATS = [
  { name: 'APP工单',  value: 68, fill: '#4FA7A0' },
  { name: '邮件',     value: 19, fill: '#6C63FF' },
  { name: '运营反馈', value: 13, fill: '#FF9F43' },
];

export const RESOLUTION_TIME = [
  { owner: '李铧燕', avg: 3.2, solved: 45 },
  { owner: '王芳',   avg: 2.8, solved: 52 },
  { owner: '张伟',   avg: 4.1, solved: 38 },
  { owner: '陈静',   avg: 3.6, solved: 29 },
  { owner: '刘洋',   avg: 2.5, solved: 61 },
];

/* ── 颜色常量 ── */
export const STATUS_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  '待处理': { bg: '#FF9F4318', text: '#FF9F43', bar: '#FF9F43' },
  '处理中': { bg: '#4FA7A018', text: '#4FA7A0', bar: '#4FA7A0' },
  '待确认': { bg: '#6C63FF18', text: '#6C63FF', bar: '#6C63FF' },
  '已解决': { bg: '#22c55e18', text: '#22c55e', bar: '#22c55e' },
  '已关闭': { bg: '#A0AEC018', text: '#A0AEC0', bar: '#A0AEC0' },
  '搁置中': { bg: '#FF6B6B18', text: '#FF6B6B', bar: '#FF6B6B' },
};
export const PRIORITY_COLORS: Record<string, string> = { '高': '#FF6B6B', '中': '#FF9F43', '低': '#A0AEC0' };
export const SOURCE_COLORS: Record<string, string> = { 'APP工单': '#4FA7A0', '邮件': '#6C63FF', '运营反馈': '#FF9F43' };
export const PLATFORM_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  'iOS':    { color: '#007AFF', bg: '#007AFF15', icon: '🍎' },
  'Android':{ color: '#34A853', bg: '#34A85315', icon: '🤖' },
  '双平台': { color: '#6C63FF', bg: '#6C63FF15', icon: '🔀' },
};
export const ISSUE_TYPE_COLORS: Record<IssueType, { color: string; bg: string }> = {
  '软件': { color: '#3B82F6', bg: '#3B82F615' },
  '硬件': { color: '#F97316', bg: '#F9731615' },
  '服务器': { color: '#8B5CF6', bg: '#8B5CF615' },
};
export const DELAY_COLORS: Record<string, { bg: string; text: string }> = {
  none:     { bg: 'transparent', text: 'transparent' },
  pending:  { bg: '#FF9F4320', text: '#FF9F43' },
  approved: { bg: '#22c55e18', text: '#22c55e' },
  rejected: { bg: '#FF6B6B18', text: '#FF6B6B' },
};
