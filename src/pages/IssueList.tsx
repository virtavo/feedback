import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, AlertTriangle, ChevronDown, Calendar } from 'lucide-react';
import { MOCK_ISSUES, STATUS_COLORS, SOURCE_COLORS, PRIORITY_COLORS, PLATFORM_COLORS, ISSUE_TYPE_COLORS, getOverdueDays, type IssueType } from '@/data';
import { useBrandStore } from '@/store/brandStore';

const ProgressBar = ({ p }: { p: number }) => {
  const c = p === 100 ? '#22c55e' : p >= 60 ? '#4FA7A0' : p >= 30 ? '#FF9F43' : '#FF6B6B';
  return (
    <div style={{ width: 72 }}>
      <span style={{ fontSize: 10, color: c, fontWeight: 700 }}>{p}%</span>
      <div style={{ height: 4, borderRadius: 99, background: '#f1f5f9', marginTop: 2 }}>
        <div style={{ height: 4, borderRadius: 99, background: c, width: `${p}%`, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
};

const DELAY_LABEL: Record<string, { label: string; color: string }> = {
  pending:  { label: '延期申请中', color: '#FF9F43' },
  approved: { label: '延期已批准', color: '#22c55e' },
  rejected: { label: '延期被驳回', color: '#FF6B6B' },
};

export default function IssueList() {
  const nav = useNavigate();
  const { activeBrand, setActiveBrand } = useBrandStore();

  const [search, setSearch]       = useState('');
  const [fStatus, setFStatus]     = useState('');
  const [fSource, setFSource]     = useState('');
  const [fPriority, setFPriority] = useState('');
  const [fCountry, setFCountry]   = useState('');
  const [fPlatform, setFPlatform] = useState('');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');

  const filtered = MOCK_ISSUES.filter(i => {
    const q = search.toLowerCase();
    return (
      i.brand === activeBrand
      && (!q || i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.product.toLowerCase().includes(q))
      && (!fStatus   || i.status   === fStatus)
      && (!fSource   || i.source   === fSource)
      && (!fPriority || i.priority === fPriority)
      && (!fCountry  || i.country  === fCountry)
      && (!fPlatform || i.platform === fPlatform)
      && (!dateFrom  || i.createdAt >= dateFrom)
      && (!dateTo    || i.createdAt <= dateTo)
    );
  });

  const hasFilter = !!(fStatus || fSource || fPriority || fCountry || fPlatform || dateFrom || dateTo);

  const brandAccent = activeBrand === 'VIRTAVO' ? '#4FA7A0' : '#c8dc00';
  const brandText   = activeBrand === 'VIRTAVO' ? '#fff'    : '#3d5200';

  const Sel = ({ val, setVal, opts, ph }: { val: string; setVal: (v: string) => void; opts: string[]; ph: string }) => (
    <div style={{ position: 'relative' }}>
      <select value={val} onChange={e => setVal(e.target.value)} style={{ appearance: 'none', paddingLeft: 10, paddingRight: 24, paddingTop: 7, paddingBottom: 7, borderRadius: 10, fontSize: 11, fontWeight: 600, background: val ? '#4FA7A010' : '#f1f5f9', color: val ? '#4FA7A0' : '#64748b', border: val ? '1px solid #4FA7A040' : '1px solid transparent', cursor: 'pointer', outline: 'none' }}>
        <option value="">{ph}</option>
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: brandAccent, display: 'inline-block' }} />
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2035', margin: 0 }}>{activeBrand} 问题列表</h1>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>共 <b style={{ color: '#1a2035' }}>{filtered.length}</b> 条 · 含进度 &amp; 延期状态</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Brand switcher */}
          <div style={{ display: 'flex', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            {(['VIRTAVO', 'ShowMo'] as const).map(b => {
              const active = activeBrand === b;
              const bg   = b === 'VIRTAVO' ? '#4FA7A0' : '#c8dc00';
              const text = b === 'VIRTAVO' ? '#fff'    : '#3d5200';
              return (
                <button key={b} onClick={() => setActiveBrand(b)} style={{ padding: '8px 16px', fontSize: 12, fontWeight: 700, background: active ? bg : 'transparent', color: active ? text : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>{b}</button>
              );
            })}
          </div>
          <button onClick={() => nav('/new')} style={{ background: `linear-gradient(135deg,${brandAccent},${activeBrand === 'VIRTAVO' ? '#3a8f89' : '#a8bb00'})`, color: brandText, border: 'none', borderRadius: 12, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ 新建问题</button>
        </div>
      </div>

      {/* Filters row 1: search + dropdowns */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '12px 16px', marginBottom: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '7px 12px', flex: 1, minWidth: 180 }}>
          <Search size={13} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索标题 / 编号 / 产品..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#1a2035' }} />
        </div>
        <Sel val={fStatus}   setVal={setFStatus}   opts={['待处理','处理中','待确认','已解决','已关闭','搁置中']} ph="全部状态" />
        <Sel val={fSource}   setVal={setFSource}   opts={['APP工单','邮件','运营反馈']} ph="全部来源" />
        <Sel val={fPriority} setVal={setFPriority} opts={['高','中','低']} ph="优先级" />
        <Sel val={fCountry}  setVal={setFCountry}  opts={['US','GB','IT','DE','JP','FR','CA','CN','AU']} ph="国家" />
        {hasFilter && (
          <button onClick={() => { setFStatus(''); setFSource(''); setFPriority(''); setFCountry(''); setFPlatform(''); setDateFrom(''); setDateTo(''); }} style={{ background: '#FF6B6B10', color: '#FF6B6B', border: 'none', borderRadius: 10, padding: '7px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✕ 清除</button>
        )}
      </div>

      {/* Filters row 2: platform + date range */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '10px 16px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Platform filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>平台：</span>
          {[
            { key: '',        label: '全部',    icon: '' },
            { key: 'iOS',     label: 'iOS',     icon: '🍎' },
            { key: 'Android', label: 'Android', icon: '🤖' },
            { key: '双平台',  label: '双平台',  icon: '🔀' },
          ].map(({ key, label, icon }) => {
            const isActive = fPlatform === key;
            return (
              <button key={label} onClick={() => setFPlatform(key)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: isActive ? brandAccent : '#f1f5f9', color: isActive ? brandText : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
                {icon && <span style={{ marginRight: 3 }}>{icon}</span>}{label}
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />

        {/* Date range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={13} color="#94a3b8" />
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>创建时间：</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: '5px 8px', borderRadius: 8, border: dateFrom ? '1px solid #4FA7A060' : '1px solid #e2e8f0', fontSize: 11, color: '#1a2035', background: dateFrom ? '#4FA7A008' : '#f8fafc', outline: 'none', cursor: 'pointer' }} />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: '5px 8px', borderRadius: 8, border: dateTo ? '1px solid #4FA7A060' : '1px solid #e2e8f0', fontSize: 11, color: '#1a2035', background: dateTo ? '#4FA7A008' : '#f8fafc', outline: 'none', cursor: 'pointer' }} />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>清除</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1150 }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
                {['编号','标题','类型','平台','反馈次数','产品','来源','国家','负责人','优先级','状态','进度','预期/预估','延期状态','操作'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={14} style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    暂无 {activeBrand} 问题数据
                  </td>
                </tr>
              ) : filtered.map((issue, idx) => {
                const sc       = STATUS_COLORS[issue.status];
                const overdays = getOverdueDays(issue);
                const delay    = issue.delayRequest;
                const pc       = issue.platform ? PLATFORM_COLORS[issue.platform] : null;

                return (
                  <tr key={issue.id}
                    onClick={() => nav(`/issues/${issue.id}`)}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    {/* ID */}
                    <td style={{ padding: '10px 12px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#4FA7A0', whiteSpace: 'nowrap' }}>{issue.id}</td>

                    {/* Title */}
                    <td style={{ padding: '10px 12px', maxWidth: 200 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 190 }}>{issue.title}</div>
                      <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                        {issue.tags.slice(0, 2).map(t => (
                          <span key={t} style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '1px 5px', fontSize: 10 }}>{t}</span>
                        ))}
                      </div>
                    </td>

                    {/* Issue Type */}
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      {issue.issueType ? (() => {
                        const tc = ISSUE_TYPE_COLORS[issue.issueType as IssueType];
                        return <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>{issue.issueType}</span>;
                      })() : <span style={{ color: '#cbd5e1', fontSize: 11 }}>—</span>}
                    </td>

                    {/* Platform */}
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      {pc ? (
                        <span style={{ background: pc.bg, color: pc.color, borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          {PLATFORM_COLORS[issue.platform!].icon} {issue.platform}
                        </span>
                      ) : <span style={{ color: '#cbd5e1', fontSize: 11 }}>—</span>}
                    </td>

                    {/* Feedback count */}
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {issue.feedbackCount ? (
                        <span style={{ background: '#6C63FF12', color: '#6C63FF', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          🔄 {issue.feedbackCount}
                        </span>
                      ) : <span style={{ color: '#cbd5e1', fontSize: 11 }}>—</span>}
                    </td>

                    {/* Product */}
                    <td style={{ padding: '10px 12px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{issue.product}</td>

                    {/* Source */}
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: SOURCE_COLORS[issue.source] + '18', color: SOURCE_COLORS[issue.source], borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{issue.source}</span>
                    </td>

                    {/* Country */}
                    <td style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#1a2035' }}>{issue.country}</td>

                    {/* Owner */}
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 99, background: '#4FA7A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{issue.ownerAvatar}</div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{issue.owner}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: PRIORITY_COLORS[issue.priority] + '18', color: PRIORITY_COLORS[issue.priority], borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{issue.priority}</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{issue.status}</span>
                    </td>

                    {/* Progress */}
                    <td style={{ padding: '10px 12px' }}><ProgressBar p={issue.progress} /></td>

                    {/* Dates */}
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>期望: {issue.expectedDate}</div>
                      {issue.estimatedDate && <div style={{ fontSize: 11, color: '#4FA7A0', marginTop: 1 }}>预估: {issue.estimatedDate}</div>}
                    </td>

                    {/* Delay / overdue */}
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      {overdays > 0 && !delay && (
                        <span style={{ background: '#FF6B6B18', color: '#FF6B6B', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <AlertTriangle size={10} />逾期{overdays}天
                        </span>
                      )}
                      {delay && delay.status !== 'none' && DELAY_LABEL[delay.status] && (
                        <span style={{ background: DELAY_LABEL[delay.status].color + '18', color: DELAY_LABEL[delay.status].color, borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                          {DELAY_LABEL[delay.status].label}
                        </span>
                      )}
                      {!overdays && (!delay || delay.status === 'none') && (
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>正常</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '10px 12px' }}>
                      <button title="催进度" onClick={e => { e.stopPropagation(); alert(`已催办 ${issue.owner}`); }} style={{ background: '#FF9F4315', border: 'none', borderRadius: 8, padding: '5px 7px', cursor: 'pointer', color: '#FF9F43' }}>
                        <Zap size={13} />
                      </button>
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
