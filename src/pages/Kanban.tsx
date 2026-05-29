import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, AlertTriangle, Plus } from 'lucide-react';
import { MOCK_ISSUES, STATUS_COLORS, SOURCE_COLORS, PRIORITY_COLORS, getOverdueDays, type IssueStatus } from '@/data';

const COLS: { status: IssueStatus; color: string }[] = [
  { status: '待处理', color: '#FF9F43' },
  { status: '处理中', color: '#4FA7A0' },
  { status: '待确认', color: '#6C63FF' },
  { status: '已解决', color: '#22c55e' },
  { status: '搁置中', color: '#FF6B6B' },
  { status: '已关闭', color: '#A0AEC0' },
];

export default function Kanban() {
  const nav = useNavigate();
  const [overrides, setOverrides] = useState<Record<string, IssueStatus>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const getStatus = (id: string, orig: IssueStatus) => overrides[id] ?? orig;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2035', margin: 0 }}>看板视图</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>拖拽卡片更改状态 · 橙色=延期申请中 · 红色=未申请逾期</p>
        </div>
        <button onClick={() => nav('/new')} style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ 新建问题</button>
      </div>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, minHeight: 'calc(100vh - 200px)' }}>
        {COLS.map(col => {
          const colIssues = MOCK_ISSUES.filter(i => getStatus(i.id, i.status) === col.status);
          return (
            <div key={col.status} style={{ width: 250, flexShrink: 0, borderRadius: 16, background: `${col.color}08`, border: `1px solid ${col.color}25`, display: 'flex', flexDirection: 'column' }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (dragId) { setOverrides(p => ({ ...p, [dragId]: col.status })); setDragId(null); } }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: `1px solid ${col.color}20` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 99, background: col.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: col.color }}>{col.status}</span>
                  <span style={{ background: col.color, color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{colIssues.length}</span>
                </div>
                <Plus size={14} color={col.color} style={{ cursor: 'pointer' }} />
              </div>
              {/* Cards */}
              <div style={{ flex: 1, padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colIssues.map(issue => {
                  const overdays = getOverdueDays(issue);
                  const delay = issue.delayRequest;
                  const borderColor = issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#D1E83E';
                  const progColor = issue.progress === 100 ? '#22c55e' : issue.progress >= 60 ? '#4FA7A0' : issue.progress >= 30 ? '#FF9F43' : '#FF6B6B';
                  return (
                    <div key={issue.id} draggable onDragStart={() => setDragId(issue.id)} onClick={() => nav(`/issues/${issue.id}`)}
                      style={{ background: '#fff', borderRadius: 12, padding: 12, cursor: 'grab', borderLeft: `3px solid ${borderColor}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
                      {/* Top */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{issue.id}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 7, height: 7, borderRadius: 99, background: PRIORITY_COLORS[issue.priority], display: 'inline-block' }} title={`优先级:${issue.priority}`} />
                          {overdays > 0 && !delay && <AlertTriangle size={11} color="#FF6B6B" aria-label={`逾期${overdays}天`} />}
                          {delay?.status === 'pending' && <AlertTriangle size={11} color="#FF9F43" aria-label="延期申请中" />}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', marginBottom: 6, lineHeight: 1.4 }}>{issue.title}</div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '1px 6px', fontSize: 10 }}>{issue.product}</span>
                        <span style={{ background: SOURCE_COLORS[issue.source]+'18', color: SOURCE_COLORS[issue.source], borderRadius: 6, padding: '1px 6px', fontSize: 10 }}>{issue.source}</span>
                        <span style={{ background: issue.brand==='VIRTAVO'?'#4FA7A018':'#D1E83E20', color: issue.brand==='VIRTAVO'?'#4FA7A0':'#6b8c00', borderRadius: 6, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{issue.brand}</span>
                      </div>
                      {/* Progress */}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: '#94a3b8' }}>进度</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: progColor }}>{issue.progress}%</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: '#f1f5f9' }}>
                          <div style={{ height: 4, borderRadius: 99, background: progColor, width: `${issue.progress}%` }} />
                        </div>
                      </div>
                      {/* Dates */}
                      <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6 }}>
                        {issue.expectedDate && <span>期望 {issue.expectedDate}</span>}
                        {issue.estimatedDate && <span style={{ marginLeft: 6, color: '#4FA7A0' }}>预估 {issue.estimatedDate}</span>}
                      </div>
                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 99, background: '#4FA7A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{issue.ownerAvatar}</div>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{issue.owner}</span>
                        </div>
                        <button title="催进度" onClick={e => { e.stopPropagation(); alert(`已催办 ${issue.owner}`); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                          <Zap size={12} color="#FF9F43" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {colIssues.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: col.color, opacity: 0.4 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 99, background: `${col.color}20`, margin: '0 auto 8px' }} />
                    <span style={{ fontSize: 12 }}>暂无问题</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
