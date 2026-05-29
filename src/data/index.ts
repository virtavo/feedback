
export type Brand = 'VIRTAVO' | 'ShowMo';
export type IssueSource = 'APP工单' | '邮件' | '运营反馈';
export type IssueStatus = '待处理' | '处理中' | '待确认' | '已解决' | '已关闭' | '搁置中';
export type Priority = '高' | '中' | '低';
export type DelayStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface DelayRequest {
  status: DelayStatus;
  reason: string;
  requestedDate: string; // 申请延期到的目标日期
  appliedAt: string;     // 申请时间
  respondedAt?: string;
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
  reporter: string;        // 问题提出者
  reporterAvatar: string;
  owner: string;           // 负责人
  ownerAvatar: string;
  expectedDate: string;    // 提出者设定的预期完成时间
  estimatedDate?: string;  // 负责人填写的预估完成时间
  progress: number;        // 0-100 进度百分比
  delayRequest?: DelayRequest;
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
  { name: '李杰',  avatar: 'LJ', color: '#4FA7A0', email: 'lijie@puwell.com',   wechat: 'lijie_pw' },
  { name: '王芳',  avatar: 'WF', color: '#6C63FF', email: 'wangfang@puwell.com', wechat: 'wangfang_pw' },
  { name: '张伟',  avatar: 'ZW', color: '#FF9F43', email: 'zhangwei@puwell.com', wechat: 'zhangwei_pw' },
  { name: '陈静',  avatar: 'CJ', color: '#FF6B6B', email: 'chenjing@puwell.com', wechat: 'chenjing_pw' },
  { name: '刘洋',  avatar: 'LY', color: '#22c55e', email: 'liuyang@puwell.com',  wechat: 'liuyang_pw' },
];

/* ── 计算延期天数工具 ── */
export function getOverdueDays(issue: Issue): number {
  const deadline = issue.estimatedDate || issue.expectedDate;
  if (!deadline) return 0;
  const today = new Date();
  const due = new Date(deadline);
  const diff = Math.ceil((today.getTime() - due.getTime()) / 86400000);
  return diff > 0 && issue.status !== '已解决' && issue.status !== '已关闭' ? diff : 0;
}

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISS-001', title: '酒壶机2K配网失败 - 大量US用户反馈',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '配网失败',
    country: 'US', source: 'APP工单', status: '处理中', priority: '高',
    reporter: '陈静', reporterAvatar: 'CJ',
    owner: '李杰', ownerAvatar: 'LJ',
    expectedDate: '2026-05-12', estimatedDate: '2026-05-14',
    progress: 55,
    delayRequest: { status: 'approved', reason: '固件组需更多时间复现问题', requestedDate: '2026-05-18', appliedAt: '2026-05-12 10:30', respondedAt: '2026-05-12 14:00' },
    createdAt: '2026-05-01', updatedAt: '2026-05-13',
    description: '大量US用户反馈酒壶机2K在2.4G WiFi环境下无法配网，已收到470+工单，主要集中在iOS用户，固件版本V5.20.40.01。',
    tags: ['固件','iOS','批量'],
  },
  {
    id: 'ISS-002', title: '双目小蛋(EggSentry) 直播5分钟自动断开',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '加载不出图',
    country: 'GB', source: '邮件', status: '待确认', priority: '高',
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-05-10', estimatedDate: '2026-05-11',
    progress: 80,
    delayRequest: { status: 'pending', reason: 'App后台限制需与iOS团队对接', requestedDate: '2026-05-16', appliedAt: '2026-05-11 09:15' },
    createdAt: '2026-04-28', updatedAt: '2026-05-11',
    description: 'GB用户反馈直播仅持续5分钟后自动停止，iPad端更为明显，疑为App后台限制问题。',
    tags: ['直播','iPad','App'],
  },
  {
    id: 'ISS-003', title: '熊猫机固件更新后设备无法开机',
    brand: 'VIRTAVO', product: '熊猫机', category: '不开机',
    country: 'GB', source: 'APP工单', status: '处理中', priority: '高',
    reporter: '李杰', reporterAvatar: 'LJ',
    owner: '张伟', ownerAvatar: 'ZW',
    expectedDate: '2026-05-10',
    progress: 30,
    // 未申请延期，已逾期
    createdAt: '2026-05-02', updatedAt: '2026-05-11',
    description: '防火墙固件更新后设备关机，充电显示红灯，断电后闪绿灯然后无反应，共15+工单。',
    tags: ['固件','不开机','批量'],
  },
  {
    id: 'ISS-004', title: 'MileHub Kit 基站连接稳定性问题',
    brand: 'ShowMo', product: 'MileHub Kit', category: '设备离线',
    country: 'US', source: '运营反馈', status: '待处理', priority: '中',
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
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '李杰', ownerAvatar: 'LJ',
    expectedDate: '2026-05-05',
    estimatedDate: '2026-05-07',
    progress: 20,
    delayRequest: { status: 'rejected', reason: '暂时无法复现，建议搁置', requestedDate: '2026-05-15', appliedAt: '2026-05-07 11:00', respondedAt: '2026-05-07 15:30' },
    createdAt: '2026-04-16', updatedAt: '2026-05-10',
    description: '意大利、德国用户大量反馈SD卡不识别问题，已更新固件后仍存在，共收到87+工单。',
    tags: ['SD卡','硬件','IT','DE'],
  },
  {
    id: 'ISS-006', title: 'WinEye 窗装摄像头夜视效果差',
    brand: 'ShowMo', product: 'WinEye', category: '检测问题',
    country: 'US', source: '邮件', status: '处理中', priority: '中',
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
    reporter: '李杰', reporterAvatar: 'LJ',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-05-01', estimatedDate: '2026-05-01',
    progress: 100,
    createdAt: '2026-04-02', updatedAt: '2026-05-01', resolvedAt: '2026-05-01',
    description: '日本市场配网成功率长期低于60%，主要因AP隔离模式导致，已通过固件V7.04.15修复。',
    tags: ['固件','JP','已修复'],
  },
  {
    id: 'ISS-008', title: '酒壶机耗电过快 - 太阳能充电不足',
    brand: 'VIRTAVO', product: '酒壶机200ai', category: '耗电快',
    country: 'US', source: 'APP工单', status: '待处理', priority: '低',
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
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '刘洋', ownerAvatar: 'LY',
    expectedDate: '2026-04-25', estimatedDate: '2026-04-24',
    progress: 100,
    createdAt: '2026-04-10', updatedAt: '2026-04-25', resolvedAt: '2026-04-25',
    description: '澳大利亚用户反馈热成像检测误报严重，已通过App 4.0.8014新版本的检测区域设置功能解决。',
    tags: ['检测','误报','已修复'],
  },
  {
    id: 'ISS-011', title: '国内小蛋配网失败持续高发',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '配网失败',
    country: 'CN', source: '运营反馈', status: '处理中', priority: '高',
    reporter: '李杰', reporterAvatar: 'LJ',
    owner: '李杰', ownerAvatar: 'LJ',
    expectedDate: '2026-05-12', estimatedDate: '2026-05-13',
    progress: 65,
    createdAt: '2026-04-18', updatedAt: '2026-05-13',
    description: '国内4.18-5.14期间共44条配网失败客诉，安卓/iOS均有，主要集中在XD1-V129固件，已排查出路由器兼容性问题。',
    tags: ['国内','批量','路由器'],
  },
  {
    id: 'ISS-012', title: '酒壶机账号验证码收不到',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '账号相关',
    country: 'IT', source: 'APP工单', status: '已关闭', priority: '低',
    reporter: '王芳', reporterAvatar: 'WF',
    owner: '王芳', ownerAvatar: 'WF',
    expectedDate: '2026-04-20', estimatedDate: '2026-04-19',
    progress: 100,
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
  { owner: '李杰', avg: 3.2, solved: 45 },
  { owner: '王芳', avg: 2.8, solved: 52 },
  { owner: '张伟', avg: 4.1, solved: 38 },
  { owner: '陈静', avg: 3.6, solved: 29 },
  { owner: '刘洋', avg: 2.5, solved: 61 },
];

/* ── 颜色常量（多处复用） ── */
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
export const DELAY_COLORS: Record<string, { bg: string; text: string }> = {
  none:     { bg: 'transparent', text: 'transparent' },
  pending:  { bg: '#FF9F4320', text: '#FF9F43' },
  approved: { bg: '#22c55e18', text: '#22c55e' },
  rejected: { bg: '#FF6B6B18', text: '#FF6B6B' },
};
