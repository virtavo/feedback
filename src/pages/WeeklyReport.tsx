import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { MOCK_ISSUES, WEEKLY_STATS } from '@/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const sourceColors: Record<string, string> = { 'APP工单': '#4FA7A0', '邮件': '#6C63FF', '运营反馈': '#FF9F43' };
const statusColors: Record<string, string> = { '待处理': '#FF9F43', '处理中': '#4FA7A0', '待确认': '#6C63FF', '已解决': '#22c55e', '已关闭': '#A0AEC0', '搁置中': '#FF6B6B' };

const WEEKS = ['5.7-5.13', '4.30-5.6', '4.23-4.29', '4.16-4.22', '4.9-4.15', '4.2-4.8'];

export default function WeeklyReport() {
  const [weekIdx, setWeekIdx] = useState(0);
  const weekLabel = WEEKS[weekIdx];
  const cur = WEEKLY_STATS[WEEKLY_STATS.length - 1 - weekIdx];
  const prev = WEEKLY_STATS[WEEKLY_STATS.length - 2 - weekIdx];

  const weekIssues = MOCK_ISSUES.slice(0, Math.max(3, 12 - weekIdx * 2));
  const solveRate = Math.round((cur.solved / cur.total) * 100);
  const prevRate = prev ? Math.round((prev.solved / prev.total) * 100) : 0;
  const diff = solveRate - prevRate;

  const byCategory = weekIssues.reduce<Record<string, number>>((acc, i) => { acc[i.category] = (acc[i.category] || 0) + 1; return acc; }, {});
  const bySource = weekIssues.reduce<Record<string, number>>((acc, i) => { acc[i.source] = (acc[i.source] || 0) + 1; return acc; }, {});
  const byProduct = weekIssues.reduce<Record<string, number>>((acc, i) => { acc[i.product] = (acc[i.product] || 0) + 1; return acc; }, {});

  return (
    <div>
      {/* Header + Week Picker */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>周报视图</h1>
          <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>按周维度汇总售后问题数据</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl px-2 py-1.5" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <button onClick={() => setWeekIdx(Math.min(weekIdx + 1, WEEKS.length - 1))} disabled={weekIdx >= WEEKS.length - 1} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-gray-50">
            <ChevronLeft size={16} style={{ color: '#64748b' }} />
          </button>
          <span className="text-sm font-semibold px-2" style={{ color: '#1a2035' }}>第{WEEKS.length - weekIdx}周 ({weekLabel})</span>
          <button onClick={() => setWeekIdx(Math.max(weekIdx - 1, 0))} disabled={weekIdx <= 0} className="p-1.5 rounded-lg disabled:opacity-30 hover:bg-gray-50">
            <ChevronRight size={16} style={{ color: '#64748b' }} />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '本周总问题', value: cur.total, sub: `环比 ${cur.total > (prev?.total || 0) ? '+' : ''}${cur.total - (prev?.total || 0)}`, color: '#4FA7A0' },
          { label: '本周已解决', value: cur.solved, sub: `解决率 ${solveRate}%`, color: '#22c55e' },
          { label: 'VIRTAVO 问题', value: cur.virtavo, sub: `占比 ${Math.round(cur.virtavo / cur.total * 100)}%`, color: '#4FA7A0' },
          { label: 'ShowMo 问题', value: cur.showmo, sub: `占比 ${Math.round(cur.showmo / cur.total * 100)}%`, color: '#6b8c00' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="text-2xl font-bold mb-1" style={{ color }}>{value}</div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: '#1a2035' }}>{label}</div>
            <div className="text-xs flex items-center gap-1" style={{ color: '#A0AEC0' }}>
              {diff >= 0 ? <TrendingUp size={11} style={{ color: '#22c55e' }} /> : <TrendingDown size={11} style={{ color: '#FF6B6B' }} />}
              {sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Trend */}
        <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>近6周趋势</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEKLY_STATS}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Line type="monotone" dataKey="total" stroke="#4FA7A0" strokeWidth={2.5} dot={{ r: 4, fill: '#4FA7A0' }} name="总量" />
              <Line type="monotone" dataKey="solved" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: '#22c55e' }} name="已解决" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>本周分类</div>
          <div className="space-y-2.5">
            {Object.entries(byCategory).map(([cat, cnt]) => (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#64748b' }}>{cat}</span>
                  <span style={{ color: '#1a2035', fontWeight: 600 }}>{cnt}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#F0F4F8' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(cnt / weekIssues.length) * 100}%`, background: '#4FA7A0' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="font-bold text-sm" style={{ color: '#1a2035' }}>本周问题清单</div>
          <div className="flex gap-3 text-xs">
            {Object.entries(bySource).map(([src, cnt]) => (
              <span key={src} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: sourceColors[src] }} />
                <span style={{ color: '#64748b' }}>{src} {cnt}</span>
              </span>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
              {['编号', '标题', '品牌', '产品', '来源', '状态', '负责人', '处理时长'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekIssues.map((issue, idx) => {
              const days = issue.resolvedAt
                ? Math.ceil((new Date(issue.resolvedAt).getTime() - new Date(issue.createdAt).getTime()) / 86400000)
                : Math.ceil((new Date().getTime() - new Date(issue.createdAt).getTime()) / 86400000);
              const sc = statusColors[issue.status];
              return (
                <tr key={issue.id} style={{ borderBottom: idx < weekIssues.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                  <td className="px-4 py-3 text-[11px] font-mono font-semibold" style={{ color: '#4FA7A0' }}>{issue.id}</td>
                  <td className="px-4 py-3 text-xs font-medium max-w-[220px]" style={{ color: '#1a2035' }}>
                    <div className="truncate">{issue.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: issue.brand === 'VIRTAVO' ? '#4FA7A018' : '#D1E83E20', color: issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00' }}>{issue.brand}</span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#64748b' }}>{issue.product}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${sourceColors[issue.source]}18`, color: sourceColors[issue.source] }}>{issue.source}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: `${sc}18`, color: sc }}>{issue.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#4FA7A0' }}>{issue.ownerAvatar}</div>
                      <span className="text-xs" style={{ color: '#64748b' }}>{issue.owner}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold" style={{ color: days > 7 ? '#FF6B6B' : days > 3 ? '#FF9F43' : '#22c55e' }}>{days}天</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
