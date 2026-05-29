import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, Zap, Globe, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MOCK_ISSUES, WEEKLY_STATS, CATEGORY_STATS, SOURCE_STATS, MOCK_ISSUES as issues } from '@/data';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, sub, color, icon: Icon, trend }: { label: string; value: string | number; sub: string; color: string; icon: React.ElementType; trend?: number }) => (
  <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
    <div className="flex items-start justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium`} style={{ color: trend >= 0 ? '#FF6B6B' : '#22c55e' }}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-2xl font-bold mb-0.5" style={{ color: '#1a2035' }}>{value}</div>
    <div className="text-xs font-medium mb-0.5" style={{ color: '#1a2035' }}>{label}</div>
    <div className="text-xs" style={{ color: '#A0AEC0' }}>{sub}</div>
  </div>
);

const sourceColors: Record<string, string> = { 'APP工单': '#4FA7A0', '邮件': '#6C63FF', '运营反馈': '#FF9F43' };
const statusColors: Record<string, string> = { '待处理': '#FF9F43', '处理中': '#4FA7A0', '待确认': '#6C63FF', '已解决': '#22c55e', '已关闭': '#A0AEC0', '搁置中': '#FF6B6B' };

export default function Dashboard() {
  const navigate = useNavigate();
  const pending = issues.filter(i => i.status === '待处理').length;
  const inProgress = issues.filter(i => i.status === '处理中').length;
  const resolved = issues.filter(i => i.status === '已解决').length;
  const highPriority = issues.filter(i => i.priority === '高').length;
  const urgent = issues.filter(i => i.priority === '高' && (i.status === '待处理' || i.status === '处理中'));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>售后总览 Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>2026年第20周 · 更新于 2026-05-14 10:30</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: '#fff', color: '#64748b', border: '1px solid #e2e8f0' }}>本周报告</button>
          <button onClick={() => navigate('/new')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #4FA7A0 0%, #3a8f89 100%)' }}>+ 新建问题</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="待处理问题" value={pending} sub="需立即关注" color="#FF9F43" icon={AlertCircle} trend={12} />
        <StatCard label="处理中" value={inProgress} sub="跟进中的问题" color="#4FA7A0" icon={Clock} trend={-5} />
        <StatCard label="本月已解决" value={resolved} sub="解决率 78.4%" color="#22c55e" icon={CheckCircle2} trend={8} />
        <StatCard label="高优先级" value={highPriority} sub="需加急处理" color="#FF6B6B" icon={Zap} trend={15} />
      </div>

      {/* Brand Split */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {(['VIRTAVO', 'ShowMo'] as const).map(brand => {
          const brandIssues = issues.filter(i => i.brand === brand);
          const color = brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00';
          const bgColor = brand === 'VIRTAVO' ? 'rgba(79,167,160,0.06)' : 'rgba(209,232,62,0.08)';
          const accentColor = brand === 'VIRTAVO' ? '#4FA7A0' : '#D1E83E';
          return (
            <div key={brand} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', borderLeft: `4px solid ${accentColor}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: accentColor === '#D1E83E' ? '#6b8c00' : accentColor }}>
                    {brand === 'VIRTAVO' ? 'V' : 'S'}
                  </div>
                  <span className="font-bold text-sm" style={{ color: '#1a2035' }}>{brand}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ background: bgColor, color }}>{brandIssues.length} 条问题</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['待处理', '处理中', '已解决'] as const).map(s => (
                  <div key={s} className="rounded-xl p-3 text-center" style={{ background: bgColor }}>
                    <div className="text-xl font-bold" style={{ color }}>{brandIssues.filter(i => i.status === s).length}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>{s}</div>
                  </div>
                ))}
              </div>
              {brand === 'VIRTAVO' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium mb-2" style={{ color: '#64748b' }}>产品分布</div>
                  <div className="flex gap-2 flex-wrap">
                    {['酒壶机', '双目小蛋', '熊猫机'].map(p => (
                      <span key={p} className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#4FA7A020', color: '#4FA7A0' }}>{p} · {brandIssues.filter(i => i.product.includes(p.slice(0, 2))).length}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Weekly Trend */}
        <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-sm" style={{ color: '#1a2035' }}>每周问题趋势</div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#4FA7A0' }} />总量</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#22c55e' }} />已解决</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY_STATS} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="total" fill="#4FA7A0" radius={[6, 6, 0, 0]} name="总量" />
              <Bar dataKey="solved" fill="#22c55e" radius={[6, 6, 0, 0]} name="已解决" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>问题分类占比</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={CATEGORY_STATS} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                {CATEGORY_STATS.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_STATS.slice(0, 4).map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.fill }} />
                  <span className="text-[11px]" style={{ color: '#64748b' }}>{c.name}</span>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: '#1a2035' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Source + Country */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>问题来源分布</div>
          {SOURCE_STATS.map(s => (
            <div key={s.name} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: '#64748b' }}>{s.name}</span>
                <span style={{ color: '#1a2035', fontWeight: 600 }}>{s.value}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: '#F0F4F8' }}>
                <div className="h-2 rounded-full transition-all" style={{ width: `${s.value}%`, background: s.fill }} />
              </div>
            </div>
          ))}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="font-bold text-sm mb-3" style={{ color: '#1a2035' }}>Top 国家</div>
            {[{ c: 'US', n: 38 }, { c: 'GB', n: 22 }, { c: 'IT', n: 18 }, { c: 'JP', n: 12 }].map(({ c, n }) => (
              <div key={c} className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Globe size={12} style={{ color: '#A0AEC0' }} />
                  <span className="text-xs font-medium" style={{ color: '#1a2035' }}>{c}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full" style={{ width: n * 1.5, background: '#4FA7A0' }} />
                  <span className="text-xs" style={{ color: '#64748b' }}>{n}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Issues */}
        <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="font-bold text-sm" style={{ color: '#1a2035' }}>⚡ 待处理高优先级问题</div>
            <button onClick={() => navigate('/issues')} className="flex items-center gap-1 text-xs" style={{ color: '#4FA7A0' }}>全部 <ArrowRight size={12} /></button>
          </div>
          <div className="space-y-2">
            {urgent.map(issue => (
              <div key={issue.id} onClick={() => navigate(`/issues/${issue.id}`)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md" style={{ background: '#F8FAFC', border: '1px solid #e2e8f0' }}>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg" style={{ background: '#F0F4F8', color: '#64748b' }}>{issue.id}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: '#1a2035' }}>{issue.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px]" style={{ color: '#A0AEC0' }}>{issue.product}</span>
                    <span className="text-[11px]" style={{ color: '#A0AEC0' }}>·</span>
                    <span className="text-[11px]" style={{ color: '#A0AEC0' }}>{issue.country}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${sourceColors[issue.source]}18`, color: sourceColors[issue.source] }}>{issue.source}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${statusColors[issue.status]}18`, color: statusColors[issue.status] }}>{issue.status}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#4FA7A0' }}>{issue.ownerAvatar}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
