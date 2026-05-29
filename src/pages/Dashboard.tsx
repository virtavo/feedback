import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, Zap, Globe, ArrowRight, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { MOCK_ISSUES, WEEKLY_STATS, CATEGORY_STATS, SOURCE_STATS, STATUS_COLORS, SOURCE_COLORS, PRIORITY_COLORS, getOverdueDays } from '@/data';
import { useNavigate } from 'react-router-dom';

const card = { background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' };

function IssueProgressBar({ progress, status }: { progress: number; status: string }) {
  const color = progress === 100 ? '#22c55e' : progress >= 60 ? '#4FA7A0' : progress >= 30 ? '#FF9F43' : '#FF6B6B';
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>进度</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{progress}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: '#f1f5f9' }}>
        <div style={{ height: 5, borderRadius: 99, background: color, width: `${progress}%`, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

function OverdueBadge({ issue }: { issue: (typeof MOCK_ISSUES)[0] }) {
  const days = getOverdueDays(issue);
  if (!days) return null;
  const hasRequest = issue.delayRequest && issue.delayRequest.status !== 'none';
  if (hasRequest && issue.delayRequest?.status === 'approved') return null;
  return (
    <span style={{ background: hasRequest ? '#FF9F4320' : '#FF6B6B18', color: hasRequest ? '#FF9F43' : '#FF6B6B', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <AlertTriangle size={10} />
      {hasRequest ? `延期申请中` : `逾期 ${days} 天`}
    </span>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const issues = MOCK_ISSUES;
  const pending = issues.filter(i => i.status === '待处理').length;
  const inProg = issues.filter(i => i.status === '处理中').length;
  const resolved = issues.filter(i => i.status === '已解决' || i.status === '已关闭').length;
  const overdue = issues.filter(i => getOverdueDays(i) > 0 && !i.delayRequest?.status?.match(/approved/)).length;
  const urgent = issues.filter(i => i.priority === '高' && !['已解决','已关闭'].includes(i.status)).slice(0, 6);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2035', margin: 0 }}>售后总览 Dashboard</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>2026年第20周 · 更新于 2026-05-14 10:30</p>
        </div>
        <button onClick={() => nav('/new')} style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ 新建问题</button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        {[
          { label: '待处理', value: pending, sub: '需立即关注', color: '#FF9F43', icon: AlertCircle, trend: 12 },
          { label: '处理中', value: inProg, sub: '跟进中', color: '#4FA7A0', icon: Clock, trend: -5 },
          { label: '已解决/关闭', value: resolved, sub: '解决率 78.4%', color: '#22c55e', icon: CheckCircle2, trend: 8 },
          { label: '⚠️ 无申请逾期', value: overdue, sub: '需立即跟进', color: '#FF6B6B', icon: AlertTriangle, trend: overdue },
        ].map(({ label, value, sub, color, icon: Icon, trend }) => (
          <div key={label} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} color={color} /></div>
              <span style={{ fontSize: 11, color: trend > 0 ? '#FF6B6B' : '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                {trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{Math.abs(trend)}%
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Brand Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        {(['VIRTAVO','ShowMo'] as const).map(brand => {
          const bi = issues.filter(i => i.brand === brand);
          const accent = brand === 'VIRTAVO' ? '#4FA7A0' : '#D1E83E';
          const textColor = brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00';
          return (
            <div key={brand} style={{ ...card, borderLeft: `4px solid ${accent}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: brand === 'ShowMo' ? '#3d5200' : accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>{brand[0]}</div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: '#1a2035' }}>{brand}</span>
                </div>
                <span style={{ background: `${accent}18`, color: textColor, borderRadius: 10, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>{bi.length} 条问题</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {(['待处理','处理中','已解决'] as const).map(s => (
                  <div key={s} style={{ background: `${accent}10`, borderRadius: 12, padding: '10px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>{bi.filter(i => i.status === s).length}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2035' }}>每周问题趋势</span>
            <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: '#4FA7A0', display: 'inline-block' }} />总量</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 99, background: '#22c55e', display: 'inline-block' }} />已解决</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={WEEKLY_STATS} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Bar dataKey="total" fill="#4FA7A0" radius={[5,5,0,0]} name="总量" />
              <Bar dataKey="solved" fill="#22c55e" radius={[5,5,0,0]} name="已解决" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', display: 'block', marginBottom: 12 }}>问题分类占比</span>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart><Pie data={CATEGORY_STATS} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value">
              {CATEGORY_STATS.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Pie><Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8 }}>
            {CATEGORY_STATS.slice(0,4).map(c => (
              <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}><span style={{ width: 7, height: 7, borderRadius: 99, background: c.fill, display: 'inline-block' }} />{c.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1a2035' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent Issues */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2035' }}>⚡ 高优先级问题（含进度 & 延期状态）</span>
          <button onClick={() => nav('/issues')} style={{ background: 'none', border: 'none', color: '#4FA7A0', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>全部 <ArrowRight size={12} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {urgent.map(issue => {
            const overdays = getOverdueDays(issue);
            const sc = STATUS_COLORS[issue.status];
            return (
              <div key={issue.id} onClick={() => nav(`/issues/${issue.id}`)} style={{ background: '#F8FAFC', borderRadius: 14, padding: 14, cursor: 'pointer', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow='none')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#4FA7A0', fontWeight: 700 }}>{issue.id}</span>
                    <span style={{ background: issue.brand === 'VIRTAVO' ? '#4FA7A018' : '#D1E83E20', color: issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00', borderRadius: 20, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{issue.brand}</span>
                  </div>
                  <OverdueBadge issue={issue} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', marginBottom: 4, lineHeight: 1.4 }}>{issue.title}</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{issue.product} · {issue.country}</span>
                  <span style={{ background: SOURCE_COLORS[issue.source]+'18', color: SOURCE_COLORS[issue.source], borderRadius: 20, padding: '1px 6px', fontSize: 10 }}>{issue.source}</span>
                  <span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: '1px 6px', fontSize: 10, fontWeight: 600 }}>{issue.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                  <span>预期: {issue.expectedDate}</span>
                  {issue.estimatedDate && <span>预估: {issue.estimatedDate}</span>}
                </div>
                <IssueProgressBar progress={issue.progress} status={issue.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
