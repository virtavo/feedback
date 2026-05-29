import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, HardDrive, Server, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Save, Bell } from 'lucide-react';
import { MOCK_ISSUES, ISSUE_TYPE_COLORS, PRIORITY_COLORS, STATUS_COLORS, type Issue, type IssueType } from '@/data';

/* ── 新问题通知横幅 ── */
function NewIssueBanner({ issues }: { issues: Issue[] }) {
  const newOnes = issues.filter(i => i.status === '待处理');
  if (!newOnes.length) return null;
  return (
    <div style={{ background: 'linear-gradient(135deg,#6C63FF12,#4FA7A008)', border: '1px solid #6C63FF30', borderRadius: 16, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#6C63FF,#5a52e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Bell size={18} color="#fff" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2035', marginBottom: 2 }}>
          你有 <span style={{ color: '#6C63FF' }}>{newOnes.length} 个</span> 新问题等待处理
        </div>
        <div style={{ fontSize: 11, color: '#64748b' }}>
          {newOnes.map(i => i.title).slice(0, 2).join('　·　')}
          {newOnes.length > 2 && ` 等 ${newOnes.length} 项`}
        </div>
      </div>
      <span style={{ background: '#FF6B6B', color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>待处理</span>
    </div>
  );
}

/* ── 进度条 ── */
const Bar = ({ p }: { p: number }) => {
  const c = p === 100 ? '#22c55e' : p >= 60 ? '#6C63FF' : p >= 30 ? '#FF9F43' : '#FF6B6B';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: '#e2e8f0' }}>
        <div style={{ height: 5, borderRadius: 99, background: c, width: `${p}%` }} />
      </div>
      <span style={{ fontSize: 10, color: c, fontWeight: 700, width: 28, textAlign: 'right' }}>{p}%</span>
    </div>
  );
};

/* ── 单个任务卡片 ── */
function TaskCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false);
  const [df, setDf] = useState({
    rootCause: issue.devFeedback?.rootCause || '',
    solution:  issue.devFeedback?.solution  || '',
    estimatedResolveTime: issue.devFeedback?.estimatedResolveTime || '',
    devOwner:  issue.devFeedback?.devOwner  || '',
    testOwner: issue.devFeedback?.testOwner || '',
  });
  const [saved, setSaved] = useState(false);
  const nav = useNavigate();

  const sc = STATUS_COLORS[issue.status];
  const tc = issue.issueType ? ISSUE_TYPE_COLORS[issue.issueType as IssueType] : null;
  const isNew = issue.status === '待处理';
  const hasFeedback = !!(issue.devFeedback?.rootCause);

  const inp = { padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', background: '#f8fafc', color: '#1a2035', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div style={{ background: isNew ? 'linear-gradient(135deg,#f0efff,#f5f9ff)' : '#fff', borderRadius: 14, border: `1.5px solid ${isNew ? '#6C63FF30' : '#e2e8f0'}`, marginBottom: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Card header */}
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setExpanded(v => !v)}>
        {isNew && <span style={{ width: 8, height: 8, borderRadius: 99, background: '#6C63FF', flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6C63FF', fontWeight: 700 }}>{issue.id}</span>
            {tc && <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{issue.issueType}</span>}
            <span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: '1px 7px', fontSize: 10 }}>{issue.status}</span>
            <span style={{ background: PRIORITY_COLORS[issue.priority]+'18', color: PRIORITY_COLORS[issue.priority], borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{issue.priority}</span>
            {hasFeedback && <span style={{ background: '#22c55e18', color: '#22c55e', borderRadius: 20, padding: '1px 7px', fontSize: 10 }}>已填写反馈</span>}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2035', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 100 }}><Bar p={issue.progress} /></div>
          {expanded ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f1f5f9' }}>
          {/* Issue info */}
          <div style={{ display: 'flex', gap: 16, marginTop: 14, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              ['产品', issue.product],
              ['国家', issue.country],
              ['来源', issue.source],
              ['提出者', issue.reporter],
              ['预期截止', issue.expectedDate],
              ...(issue.feedbackCount ? [['反馈次数', `${issue.feedbackCount} 次`]] : []),
              ...(issue.deviceSN ? [['设备SN', issue.deviceSN]] : []),
              ...(issue.appAccount ? [['APP账号', issue.appAccount]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1a2035' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#64748b', lineHeight: 1.7, marginBottom: 14 }}>{issue.description}</div>

          {/* Dev feedback form */}
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6C63FF', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={13} /> 填写开发反馈
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>问题原因分析 *</div>
                <textarea value={df.rootCause} onChange={e => setDf(p => ({ ...p, rootCause: e.target.value }))} rows={2} placeholder="描述根本原因..." style={{ ...inp, resize: 'vertical' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>解决方案 *</div>
                <textarea value={df.solution} onChange={e => setDf(p => ({ ...p, solution: e.target.value }))} rows={2} placeholder="描述解决方案和步骤..." style={{ ...inp, resize: 'vertical' }} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>负责开发</div>
                <input value={df.devOwner} onChange={e => setDf(p => ({ ...p, devOwner: e.target.value }))} placeholder="开发负责人" style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>负责测试</div>
                <input value={df.testOwner} onChange={e => setDf(p => ({ ...p, testOwner: e.target.value }))} placeholder="测试负责人" style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>预估解决时间</div>
                <input type="date" value={df.estimatedResolveTime} onChange={e => setDf(p => ({ ...p, estimatedResolveTime: e.target.value }))} style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {saved
                ? <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 12 }}><CheckCircle2 size={14} />已保存</div>
                : <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ background: 'linear-gradient(135deg,#6C63FF,#5a52e8)', color: '#fff', border: 'none', borderRadius: 9, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Save size={13} /> 保存反馈
                  </button>
              }
              <button onClick={() => nav(`/issues/${issue.id}`)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 9, padding: '8px 14px', fontSize: 12, cursor: 'pointer' }}>查看详情</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ 主页面 ══ */
export default function DevDashboard() {
  const [filterType, setFilterType] = useState<IssueType | ''>('');
  const [filterStatus, setFilterStatus] = useState('');

  const allIssues = MOCK_ISSUES;
  const filtered = allIssues.filter(i =>
    (!filterType   || i.issueType === filterType) &&
    (!filterStatus || i.status    === filterStatus)
  );

  const stats = {
    total:    allIssues.length,
    pending:  allIssues.filter(i => i.status === '待处理').length,
    inProg:   allIssues.filter(i => i.status === '处理中').length,
    done:     allIssues.filter(i => i.status === '已解决' || i.status === '已关闭').length,
    software: allIssues.filter(i => i.issueType === '软件').length,
    hardware: allIssues.filter(i => i.issueType === '硬件').length,
    server:   allIssues.filter(i => i.issueType === '服务器').length,
    noFeedback: allIssues.filter(i => !i.devFeedback?.rootCause && i.status !== '已解决' && i.status !== '已关闭').length,
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2035', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6C63FF,#5a52e8)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Cpu size={16} color="#fff" /></span>
          开发视角看板
        </h1>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>你负责的所有问题 · 可快速填写开发反馈</p>
      </div>

      {/* New issue banner */}
      <NewIssueBanner issues={allIssues} />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: '待开发处理', value: stats.noFeedback, color: '#FF6B6B', desc: '未填写开发反馈', icon: <AlertTriangle size={16} /> },
          { label: '处理中',     value: stats.inProg,     color: '#6C63FF', desc: '正在跟进',      icon: <Clock size={16} /> },
          { label: '已解决',     value: stats.done,       color: '#22c55e', desc: '本周关闭',      icon: <CheckCircle2 size={16} /> },
          { label: '总问题数',   value: stats.total,      color: '#94a3b8', desc: '全量',          icon: null },
        ].map(({ label, value, color, desc, icon }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{label}</div>
              {icon && <div style={{ color }}>{icon}</div>}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Type breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
        {([
          { type: '软件' as IssueType, count: stats.software, icon: <Cpu size={14} /> },
          { type: '硬件' as IssueType, count: stats.hardware, icon: <HardDrive size={14} /> },
          { type: '服务器' as IssueType, count: stats.server, icon: <Server size={14} /> },
        ]).map(({ type, count, icon }) => {
          const tc = ISSUE_TYPE_COLORS[type];
          const isActive = filterType === type;
          return (
            <button key={type} onClick={() => setFilterType(isActive ? '' : type)} style={{ background: isActive ? tc.bg : '#fff', borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${isActive ? tc.color+'60' : '#e2e8f0'}`, cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ color: tc.color }}>{icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: tc.color }}>{type}问题</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1a2035' }}>{count}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>点击筛选</div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '10px 14px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>状态：</span>
        {['', '待处理', '处理中', '待确认', '已解决'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: filterStatus === s ? '#6C63FF' : '#f1f5f9', color: filterStatus === s ? '#fff' : '#64748b', border: 'none', cursor: 'pointer' }}>
            {s || '全部'}
          </button>
        ))}
        {(filterType || filterStatus) && (
          <button onClick={() => { setFilterType(''); setFilterStatus(''); }} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, background: '#FF6B6B15', color: '#FF6B6B', border: '1px solid #FF6B6B30', cursor: 'pointer' }}>
            清除筛选
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8' }}>共 {filtered.length} 条</span>
      </div>

      {/* Task list */}
      <div>
        {filtered.filter(i => i.status === '待处理').length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6C63FF', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: '#6C63FF', display: 'inline-block' }} />新分配给你
            </div>
            {filtered.filter(i => i.status === '待处理').map(i => <TaskCard key={i.id} issue={i} />)}
          </div>
        )}
        {filtered.filter(i => i.status !== '待处理' && i.status !== '已解决' && i.status !== '已关闭').length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#FF9F43', marginBottom: 8 }}>进行中</div>
            {filtered.filter(i => i.status !== '待处理' && i.status !== '已解决' && i.status !== '已关闭').map(i => <TaskCard key={i.id} issue={i} />)}
          </div>
        )}
        {filtered.filter(i => i.status === '已解决' || i.status === '已关闭').length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>已解决</div>
            {filtered.filter(i => i.status === '已解决' || i.status === '已关闭').map(i => <TaskCard key={i.id} issue={i} />)}
          </div>
        )}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 13 }}>暂无匹配问题</div>
        )}
      </div>
    </div>
  );
}
