import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, AlertTriangle, ChevronDown } from 'lucide-react';
import { MOCK_ISSUES, STATUS_COLORS, SOURCE_COLORS, PRIORITY_COLORS, getOverdueDays } from '@/data';

const ProgressBar = ({ p }: { p: number }) => {
  const c = p === 100 ? '#22c55e' : p >= 60 ? '#4FA7A0' : p >= 30 ? '#FF9F43' : '#FF6B6B';
  return (
    <div style={{ width: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontSize: 10, color: c, fontWeight: 700 }}>{p}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: '#f1f5f9' }}>
        <div style={{ height: 5, borderRadius: 99, background: c, width: `${p}%` }} />
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
  const [search, setSearch] = useState('');
  const [fBrand, setFBrand] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fSource, setFSource] = useState('');
  const [fPriority, setFPriority] = useState('');
  const [fCountry, setFCountry] = useState('');

  const filtered = MOCK_ISSUES.filter(i => {
    const q = search.toLowerCase();
    return (!q || i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.product.toLowerCase().includes(q))
      && (!fBrand || i.brand === fBrand)
      && (!fStatus || i.status === fStatus)
      && (!fSource || i.source === fSource)
      && (!fPriority || i.priority === fPriority)
      && (!fCountry || i.country === fCountry);
  });

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2035', margin: 0 }}>问题列表</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>共 {filtered.length} 条 · 含进度 & 延期状态</p>
        </div>
        <button onClick={() => nav('/new')} style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ 新建问题</button>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '14px 16px', marginBottom: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '7px 12px', flex: 1, minWidth: 180 }}>
          <Search size={13} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索标题/编号/产品..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#1a2035' }} />
        </div>
        <Sel val={fBrand} setVal={setFBrand} opts={['VIRTAVO','ShowMo']} ph="全部品牌" />
        <Sel val={fStatus} setVal={setFStatus} opts={['待处理','处理中','待确认','已解决','已关闭','搁置中']} ph="全部状态" />
        <Sel val={fSource} setVal={setFSource} opts={['APP工单','邮件','运营反馈']} ph="全部来源" />
        <Sel val={fPriority} setVal={setFPriority} opts={['高','中','低']} ph="优先级" />
        <Sel val={fCountry} setVal={setFCountry} opts={['US','GB','IT','DE','JP','FR','CA','CN','AU']} ph="国家" />
        {(fBrand||fStatus||fSource||fPriority||fCountry) && (
          <button onClick={() => { setFBrand(''); setFStatus(''); setFSource(''); setFPriority(''); setFCountry(''); }} style={{ background: '#FF6B6B10', color: '#FF6B6B', border: 'none', borderRadius: 10, padding: '7px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>清除</button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
              {['编号','标题','品牌','产品','来源','国家','负责人','优先级','状态','进度','预期/预估','延期状态','操作'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((issue, idx) => {
              const sc = STATUS_COLORS[issue.status];
              const overdays = getOverdueDays(issue);
              const delay = issue.delayRequest;
              return (
                <tr key={issue.id} onClick={() => nav(`/issues/${issue.id}`)} style={{ borderBottom: idx < filtered.length-1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#f8fafc')} onMouseLeave={e => (e.currentTarget.style.background='')}>
                  <td style={{ padding: '10px 14px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#4FA7A0', whiteSpace: 'nowrap' }}>{issue.id}</td>
                  <td style={{ padding: '10px 14px', maxWidth: 200 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{issue.title}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                      {issue.tags.slice(0,2).map(t => <span key={t} style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '1px 6px', fontSize: 10 }}>{t}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: issue.brand==='VIRTAVO' ? '#4FA7A018' : '#D1E83E20', color: issue.brand==='VIRTAVO' ? '#4FA7A0' : '#6b8c00', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{issue.brand}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>{issue.product}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: SOURCE_COLORS[issue.source]+'18', color: SOURCE_COLORS[issue.source], borderRadius: 20, padding: '2px 8px', fontSize: 11 }}>{issue.source}</span></td>
                  <td style={{ padding: '10px 14px', fontSize: 12, fontWeight: 700, color: '#1a2035' }}>{issue.country}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 99, background: '#4FA7A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{issue.ownerAvatar}</div>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{issue.owner}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: PRIORITY_COLORS[issue.priority]+'18', color: PRIORITY_COLORS[issue.priority], borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{issue.priority}</span></td>
                  <td style={{ padding: '10px 14px' }}><span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{issue.status}</span></td>
                  <td style={{ padding: '10px 14px' }}><ProgressBar p={issue.progress} /></td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>期望: {issue.expectedDate}</div>
                    {issue.estimatedDate && <div style={{ fontSize: 11, color: '#4FA7A0', marginTop: 1 }}>预估: {issue.estimatedDate}</div>}
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {overdays > 0 && !delay && (
                      <span style={{ background: '#FF6B6B18', color: '#FF6B6B', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <AlertTriangle size={10} />逾期{overdays}天
                      </span>
                    )}
                    {delay && delay.status !== 'none' && DELAY_LABEL[delay.status] && (
                      <span style={{ background: DELAY_LABEL[delay.status].color+'18', color: DELAY_LABEL[delay.status].color, borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>
                        {DELAY_LABEL[delay.status].label}
                      </span>
                    )}
                    {!overdays && !delay && <span style={{ fontSize: 10, color: '#94a3b8' }}>正常</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
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
  );
}
