
export type Brand = 'VIRTAVO' | 'ShowMo';
export type IssueSource = 'APP工单' | '邮件' | '运营反馈';
export type IssueStatus = '待处理' | '处理中' | '待确认' | '已解决' | '已关闭' | '搁置中';
export type Priority = '高' | '中' | '低';

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
  owner: string;
  ownerAvatar: string;
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
  '配网失败', '设备离线', '不开机', '耗电快',
  '检测问题', '账号相关', '卡不识别', '加载不出图',
  '客户咨询', '意见建议', '固件升级', '云存储',
];

export const COUNTRIES = ['US', 'GB', 'IT', 'DE', 'JP', 'FR', 'CA', 'ES', 'AU', 'SE'];

export const TEAM_MEMBERS = [
  { name: '李杰', avatar: 'LJ', color: '#4FA7A0' },
  { name: '王芳', avatar: 'WF', color: '#D1E83E' },
  { name: '张伟', avatar: 'ZW', color: '#6C63FF' },
  { name: '陈静', avatar: 'CJ', color: '#FF6B6B' },
  { name: '刘洋', avatar: 'LY', color: '#FF9F43' },
];

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISS-001', title: '酒壶机2K配网失败 - 大量US用户反馈',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '配网失败',
    country: 'US', source: 'APP工单', status: '处理中', priority: '高',
    owner: '李杰', ownerAvatar: 'LJ',
    createdAt: '2026-05-01', updatedAt: '2026-05-10',
    description: '大量US用户反馈酒壶机2K在2.4G WiFi环境下无法配网，已收到470+工单，主要集中在iOS用户，固件版本V5.20.40.01。',
    tags: ['固件', 'iOS', '批量'],
  },
  {
    id: 'ISS-002', title: '双目小蛋(EggSentry) 直播5分钟自动断开',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '加载不出图',
    country: 'GB', source: '邮件', status: '待确认', priority: '高',
    owner: '王芳', ownerAvatar: 'WF',
    createdAt: '2026-04-28', updatedAt: '2026-05-08',
    description: 'GB用户反馈直播仅持续5分钟后自动停止，iPad端更为明显，疑为App后台限制问题。',
    tags: ['直播', 'iPad', 'App'],
  },
  {
    id: 'ISS-003', title: '熊猫机固件更新后设备无法开机',
    brand: 'VIRTAVO', product: '熊猫机', category: '不开机',
    country: 'GB', source: 'APP工单', status: '处理中', priority: '高',
    owner: '张伟', ownerAvatar: 'ZW',
    createdAt: '2026-05-02', updatedAt: '2026-05-11',
    description: '防火墙固件更新后设备关机，充电显示红灯，断电后闪绿灯然后无反应，共15+工单。',
    tags: ['固件', '不开机', '批量'],
  },
  {
    id: 'ISS-004', title: 'MileHub Kit 基站连接稳定性问题',
    brand: 'ShowMo', product: 'MileHub Kit', category: '设备离线',
    country: 'US', source: '运营反馈', status: '待处理', priority: '中',
    owner: '陈静', ownerAvatar: 'CJ',
    createdAt: '2026-05-05', updatedAt: '2026-05-05',
    description: '运营团队测试发现MileHub Kit基站在超过500米距离时连接不稳定，部分摄像头频繁掉线。',
    tags: ['测试', '距离', '稳定性'],
  },
  {
    id: 'ISS-005', title: '酒壶机 SD卡不识别 - IT/DE用户',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '卡不识别',
    country: 'IT', source: 'APP工单', status: '搁置中', priority: '中',
    owner: '李杰', ownerAvatar: 'LJ',
    createdAt: '2026-04-16', updatedAt: '2026-05-03',
    description: '意大利、德国用户大量反馈SD卡不识别问题，已更新固件后仍存在，共收到87+工单。',
    tags: ['SD卡', '硬件', 'IT', 'DE'],
  },
  {
    id: 'ISS-006', title: 'WinEye 窗装摄像头夜视效果差',
    brand: 'ShowMo', product: 'WinEye', category: '检测问题',
    country: 'US', source: '邮件', status: '处理中', priority: '中',
    owner: '刘洋', ownerAvatar: 'LY',
    createdAt: '2026-04-20', updatedAt: '2026-05-09',
    description: '多名Kickstarter支持者反馈夜视画质模糊，IR灯照射范围不足，需要固件优化。',
    tags: ['夜视', '画质', 'Kickstarter'],
  },
  {
    id: 'ISS-007', title: '双目小蛋 配网成功率低于60% - JP市场',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '配网失败',
    country: 'JP', source: 'APP工单', status: '已解决', priority: '高',
    owner: '王芳', ownerAvatar: 'WF',
    createdAt: '2026-04-02', updatedAt: '2026-05-01', resolvedAt: '2026-05-01',
    description: '日本市场配网成功率长期低于60%，主要因AP隔离模式导致，已通过固件V7.04.15修复。',
    tags: ['固件', 'JP', '已修复'],
  },
  {
    id: 'ISS-008', title: '酒壶机耗电过快 - 太阳能充电不足',
    brand: 'VIRTAVO', product: '酒壶机200ai', category: '耗电快',
    country: 'US', source: 'APP工单', status: '待处理', priority: '低',
    owner: '张伟', ownerAvatar: 'ZW',
    createdAt: '2026-05-08', updatedAt: '2026-05-08',
    description: '用户反馈在持续录制模式下太阳能充电速度不及耗电速度，约23+工单，建议优化工作模式。',
    tags: ['电池', '太阳能', '工作模式'],
  },
  {
    id: 'ISS-009', title: 'MileFlask 迷彩版绑定失败',
    brand: 'ShowMo', product: 'MileFlask', category: '配网失败',
    country: 'CA', source: '运营反馈', status: '待处理', priority: '中',
    owner: '陈静', ownerAvatar: 'CJ',
    createdAt: '2026-05-10', updatedAt: '2026-05-10',
    description: '新品MF.1.0迷彩版在首次绑定时部分设备无法完成配对，测试了20台中有3台存在此问题。',
    tags: ['新品', '测试', '绑定'],
  },
  {
    id: 'ISS-010', title: '熊猫机检测灵敏度过高误报',
    brand: 'VIRTAVO', product: '熊猫机', category: '检测问题',
    country: 'AU', source: '邮件', status: '已解决', priority: '低',
    owner: '刘洋', ownerAvatar: 'LY',
    createdAt: '2026-04-10', updatedAt: '2026-04-25', resolvedAt: '2026-04-25',
    description: '澳大利亚用户反馈热成像检测误报严重，已通过App 4.0.8014新版本的检测区域设置功能解决。',
    tags: ['检测', '误报', '已修复'],
  },
  {
    id: 'ISS-011', title: '国内客诉 - 小蛋配网失败持续高发',
    brand: 'VIRTAVO', product: '双目小蛋(EggSentry)', category: '配网失败',
    country: 'CN', source: '运营反馈', status: '处理中', priority: '高',
    owner: '李杰', ownerAvatar: 'LJ',
    createdAt: '2026-04-18', updatedAt: '2026-05-12',
    description: '国内4.18-5.14期间共44条配网失败客诉，安卓/iOS均有，主要集中在XD1-V129固件，已排查出路由器兼容性问题。',
    tags: ['国内', '批量', '路由器'],
  },
  {
    id: 'ISS-012', title: '酒壶机账号验证码收不到',
    brand: 'VIRTAVO', product: '酒壶机2K', category: '账号相关',
    country: 'IT', source: 'APP工单', status: '已关闭', priority: '低',
    owner: '王芳', ownerAvatar: 'WF',
    createdAt: '2026-04-15', updatedAt: '2026-04-20', resolvedAt: '2026-04-20',
    description: '意大利用户注册时无法收到验证码，已确认为邮件服务商屏蔽问题，引导用户更换邮箱后解决。',
    tags: ['账号', '邮件', '已关闭'],
  },
];

export const WEEKLY_STATS = [
  { week: '4.2-4.8', total: 82, solved: 65, virtavo: 68, showmo: 14 },
  { week: '4.9-4.15', total: 91, solved: 72, virtavo: 78, showmo: 13 },
  { week: '4.16-4.22', total: 78, solved: 61, virtavo: 64, showmo: 14 },
  { week: '4.23-4.29', total: 95, solved: 74, virtavo: 80, showmo: 15 },
  { week: '4.30-5.6', total: 110, solved: 88, virtavo: 93, showmo: 17 },
  { week: '5.7-5.13', total: 98, solved: 71, virtavo: 82, showmo: 16 },
];

export const CATEGORY_STATS = [
  { name: '配网失败', value: 38, fill: '#4FA7A0' },
  { name: '设备离线', value: 22, fill: '#6C63FF' },
  { name: '不开机', value: 12, fill: '#FF6B6B' },
  { name: '检测问题', value: 10, fill: '#FF9F43' },
  { name: '卡不识别', value: 8, fill: '#D1E83E' },
  { name: '其他', value: 10, fill: '#A0AEC0' },
];

export const SOURCE_STATS = [
  { name: 'APP工单', value: 68, fill: '#4FA7A0' },
  { name: '邮件', value: 19, fill: '#6C63FF' },
  { name: '运营反馈', value: 13, fill: '#FF9F43' },
];

export const RESOLUTION_TIME = [
  { owner: '李杰', avg: 3.2, solved: 45 },
  { owner: '王芳', avg: 2.8, solved: 52 },
  { owner: '张伟', avg: 4.1, solved: 38 },
  { owner: '陈静', avg: 3.6, solved: 29 },
  { owner: '刘洋', avg: 2.5, solved: 61 },
];
