import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell } from 'recharts';
import { RESOLUTION_TIME, CATEGORY_STATS, WEEKLY_STATS } from '@/data';
import { Trophy, Clock, TrendingUp } from 'lucide-react';

const PRODUCT_TREND = [
  { week: '4.2', 酒壶机: 38, 双目小蛋: 28, 熊猫机: 6, ShowMo: 10 },
  { week: '4.9', 酒壶机: 42, 双目小蛋: 32, 熊猫机: 8, ShowMo: 9 },
  { week: '4.16', 酒壶机: 35, 双目小蛋: 25, 熊猫机: 8, ShowMo: 10 },
  { week: '4.23', 酒壶机: 45, 双目小蛋: 34, 熊猫机: 9, ShowMo: 7 },
  { week: '4.30', 酒壶机: 52, 双目小蛋: 39, 熊猫机: 11, ShowMo: 8 },
  { week: '5.7',  酒壶机: 44, 双目小蛋: 36, 熊猫机: 10, ShowMo: 8 },
];

const OWNER_RADAR = [
  { metric: '解决速度', 李杰: 78, 王芳: 85, 张伟: 65, 陈静: 72, 刘洋: 90 },
  { metric: '问题数量', 李杰: 82, 王芳: 75, 张伟: 60, 陈静: 55, 刘洋: 88 },
  { metric: '及时率', 李杰: 76, 王芳: 88, 张伟: 70, 陈静: 68, 刘洋: 92 },
  { metric: '复发率', 李杰: 85, 王芳: 80, 张伟: 75, 陈静: 78, 刘洋: 88 },
  { metric: '客满意度', 李杰: 80, 王芳: 86, 张伟: 72, 陈静: 74, 刘洋: 90 },
];

const COUNTRY_DATA = [
  { country: 'US', total: 312, solved: 248, avg: 3.1 },
  { country: 'GB', total: 124, solved: 98, avg: 2.8 },
  { country: 'IT', total: 98, solved: 76, avg: 3.6 },
  { country: 'DE', total: 67, solved: 52, avg: 4.1 },
  { country: 'JP', total: 54, solved: 48, avg: 2.4 },
  { country: 'FR', total: 42, solved: 31, avg: 3.9 },
];

export default function Analytics() {
  const medal = ['🥇', '🥈', '🥉'];
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>数据统计</h1>
        <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>问题处理时效 · 负责人绩效 · 分类趋势分析</p>
      </div>

      {/* Avg Resolution Time */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '平均解决时长', value: '3.2天', sub: '本月', color: '#4FA7A0', icon: Clock },
          { label: '最快解决', value: '2.5天', sub: '刘洋', color: '#22c55e', icon: TrendingUp },
          { label: '本月解决率', value: '78.4%', sub: '↑ 5.2%', color: '#6C63FF', icon: Trophy },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 flex items-center gap-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs font-medium" style={{ color: '#1a2035' }}>{label}</div>
              <div className="text-xs" style={{ color: '#A0AEC0' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Owner Performance Bar */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>负责人解决效率排名</div>
          {RESOLUTION_TIME.sort((a, b) => a.avg - b.avg).map((r, idx) => (
            <div key={r.owner} className="flex items-center gap-3 mb-3">
              <div className="text-sm w-6 text-center">{medal[idx] || `${idx + 1}`}</div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: ['#4FA7A0','#22c55e','#6C63FF','#FF9F43','#FF6B6B'][idx] }}>
                {r.owner.slice(0, 1)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#1a2035', fontWeight: 600 }}>{r.owner}</span>
                  <span style={{ color: '#64748b' }}>平均 {r.avg}天 · 解决 {r.solved}件</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#F0F4F8' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${(1 - (r.avg - 2) / 3) * 100}%`, background: ['#4FA7A0','#22c55e','#6C63FF','#FF9F43','#FF6B6B'][idx] }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Trend */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-1" style={{ color: '#1a2035' }}>产品分类趋势（近6周）</div>
          <div className="flex gap-3 mb-3 flex-wrap">
            {[['酒壶机','#4FA7A0'],['双目小蛋','#6C63FF'],['熊猫机','#FF9F43'],['ShowMo','#D1E83E']].map(([n,c]) => (
              <span key={n} className="flex items-center gap-1 text-[11px]">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: c }} /><span style={{ color: '#64748b' }}>{n}</span>
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={PRODUCT_TREND} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#A0AEC0' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
              <Bar dataKey="酒壶机" fill="#4FA7A0" radius={[4,4,0,0]} />
              <Bar dataKey="双目小蛋" fill="#6C63FF" radius={[4,4,0,0]} />
              <Bar dataKey="熊猫机" fill="#FF9F43" radius={[4,4,0,0]} />
              <Bar dataKey="ShowMo" fill="#D1E83E" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Category Pie */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-3" style={{ color: '#1a2035' }}>问题分类分布</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={CATEGORY_STATS} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
                {CATEGORY_STATS.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {CATEGORY_STATS.map(c => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: c.fill }} />
                  <span className="text-[11px]" style={{ color: '#64748b' }}>{c.name}</span>
                </div>
                <span className="text-[11px] font-semibold" style={{ color: '#1a2035' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Country Stats */}
        <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>各国问题统计</div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #f0f4f8' }}>
                {['国家', '总问题数', '已解决', '解决率', '平均处理时长', '趋势'].map(h => (
                  <th key={h} className="pb-2 text-left text-xs font-semibold" style={{ color: '#64748b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COUNTRY_DATA.map((row, idx) => {
                const rate = Math.round((row.solved / row.total) * 100);
                return (
                  <tr key={row.country} style={{ borderBottom: idx < COUNTRY_DATA.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <td className="py-2.5 text-sm font-bold" style={{ color: '#1a2035' }}>{row.country}</td>
                    <td className="py-2.5 text-sm" style={{ color: '#64748b' }}>{row.total}</td>
                    <td className="py-2.5 text-sm" style={{ color: '#22c55e', fontWeight: 600 }}>{row.solved}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 rounded-full flex-1" style={{ background: '#F0F4F8', maxWidth: 60 }}>
                          <div className="h-1.5 rounded-full" style={{ width: `${rate}%`, background: rate > 80 ? '#22c55e' : rate > 60 ? '#4FA7A0' : '#FF9F43' }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: rate > 80 ? '#22c55e' : '#FF9F43' }}>{rate}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-sm" style={{ color: row.avg > 3.5 ? '#FF6B6B' : '#4FA7A0', fontWeight: 600 }}>{row.avg}天</td>
                    <td className="py-2.5">
                      <div className="flex gap-0.5 items-end h-5">
                        {[3,5,4,6,4,5].map((h, i) => (
                          <div key={i} className="w-2 rounded-t" style={{ height: h * 3, background: i === 5 ? '#4FA7A0' : '#E2E8F0' }} />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
