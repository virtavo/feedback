import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle2, Clock, AlertTriangle, Send, CalendarClock, MessageSquare, Cpu, HardDrive, Server, Edit3, Save, Plus, User, Wrench } from 'lucide-react';
import { MOCK_ISSUES, STATUS_COLORS, SOURCE_COLORS, PRIORITY_COLORS, ISSUE_TYPE_COLORS, getOverdueDays, type IssueType, type ResolveType } from '@/data';

const TIMELINE = [
  { time: '2026-05-01 09:12', actor: '陈静',  role: '提出者',    action: '创建问题',  note: '收到大量用户反馈，归类为固件问题，预期完成：2026-05-12', color: '#4FA7A0' },
  { time: '2026-05-01 11:30', actor: '李铧燕', role: '负责人',    action: '接受问题',  note: '已接单，预估完成时间：2026-05-14，将同步固件组',       color: '#6C63FF' },
  { time: '2026-05-06 14:20', actor: '张伟',   role: '固件工程师', action: '添加备注',  note: '固件组已复现问题，测试修复方案中',                     color: '#FF9F43' },
  { time: '2026-05-10 09:00', actor: '李铧燕', role: '负责人',    action: '申请延期 ⚡', note: '申请延期至 2026-05-18，原因：固件组需更多时间复现边缘场景', color: '#FF6B6B' },
  { time: '2026-05-10 14:00', actor: '陈静',   role: '提出者',    action: '批准延期',  note: '已批准延期申请，新截止日期：2026-05-18',               color: '#22c55e' },
];

const TYPE_ICON: Record<IssueType, React.ReactNode> = {
  '软件': <Cpu size={11} />,
  '硬件': <HardDrive size={11} />,
  '服务器': <Server size={11} />,
};

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const issue = MOCK_ISSUES.find(i => i.id === id) || MOCK_ISSUES[0];
  const sc = STATUS_COLORS[issue.status] || STATUS_COLORS['处理中'];
  const overdays = getOverdueDays(issue);
  const [estDate, setEstDate] = useState(issue.estimatedDate || '');
  const [showDelayForm, setShowDelayForm] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [delayDate, setDelayDate] = useState('');
  const [note, setNote] = useState('');
  const [supType, setSupType] = useState<'新用户反馈'|'技术进展'|'状态更新'|'其他'>('新用户反馈');
  const [supplements, setSupplements] = useState<{id:string;type:string;content:string;author:string;time:string}[]>([]);
  const [editingResolve, setEditingResolve] = useState(false);
  const [rd, setRd] = useState({
    type:        (issue.resolveDetails?.type        || '固件更新') as ResolveType,
    version:     issue.resolveDetails?.version     || '',
    releaseDate: issue.resolveDetails?.releaseDate || '',
    notes:       issue.resolveDetails?.notes       || '',
  });
  const progColor = issue.progress === 100 ? '#22c55e' : issue.progress >= 60 ? '#4FA7A0' : issue.progress >= 30 ? '#FF9F43' : '#FF6B6B';

  // Dev feedback edit state
  const [editingDev, setEditingDev] = useState(false);
  const [df, setDf] = useState({
    rootCause:             issue.devFeedback?.rootCause             || '',
    solution:              issue.devFeedback?.solution              || '',
    estimatedResolveTime:  issue.devFeedback?.estimatedResolveTime  || '',
    actualResolveTime:     issue.devFeedback?.actualResolveTime     || '',
    devOwner:              issue.devFeedback?.devOwner              || '',
    testOwner:             issue.devFeedback?.testOwner             || '',
  });

  const inp12 = { padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', background: '#F8FAFC', color: '#1a2035', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div>
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav(-1)} style={{ background: '#fff', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}><ArrowLeft size={16} color="#64748b" /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a2035', margin: 0 }}>{issue.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4FA7A0', fontWeight: 700 }}>{issue.id}</span>
            <span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{issue.status}</span>
            <span style={{ background: PRIORITY_COLORS[issue.priority]+'18', color: PRIORITY_COLORS[issue.priority], borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{issue.priority}优先级</span>
            {issue.issueType && (() => {
              const tc = ISSUE_TYPE_COLORS[issue.issueType];
              return (
                <span style={{ background: tc.bg, color: tc.color, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {TYPE_ICON[issue.issueType]} {issue.issueType}问题
                </span>
              );
            })()}
            {overdays > 0 && !issue.delayRequest && (
              <span style={{ background: '#FF6B6B18', color: '#FF6B6B', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11} /> 未申请逾期 {overdays} 天</span>
            )}
            {issue.delayRequest?.status === 'pending'  && <span style={{ background: '#FF9F4320', color: '#FF9F43', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🕐 延期申请待审批</span>}
            {issue.delayRequest?.status === 'approved' && <span style={{ background: '#22c55e18', color: '#22c55e', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ 延期已批准至 {issue.delayRequest.requestedDate}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* ──── Left Column ──── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Progress */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2035' }}>问题进度</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: progColor }}>{issue.progress}%</span>
            </div>
            <div style={{ height: 12, borderRadius: 99, background: '#f1f5f9', marginBottom: 8 }}>
              <div style={{ height: 12, borderRadius: 99, background: `linear-gradient(90deg, ${progColor}, ${progColor}aa)`, width: `${issue.progress}%`, transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', flexWrap: 'wrap', gap: 4 }}>
              <span>提出者预期截止：<strong style={{ color: '#1a2035' }}>{issue.expectedDate}</strong></span>
              {issue.estimatedDate && <span>负责人预估：<strong style={{ color: '#4FA7A0' }}>{issue.estimatedDate}</strong></span>}
              {issue.delayRequest?.status === 'approved' && <span>延期至：<strong style={{ color: '#22c55e' }}>{issue.delayRequest.requestedDate}</strong></span>}
            </div>
            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
              {['待处理','处理中','待确认','已解决','已关闭'].map((s, i) => {
                const statuses = ['待处理','处理中','待确认','已解决','已关闭'];
                const cur = statuses.indexOf(issue.status);
                const past = i < cur, active = issue.status === s;
                const c = active ? sc.text : past ? '#22c55e' : '#e2e8f0';
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: i < 4 ? 1 : undefined }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 99, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: (active||past)?'#fff':'#94a3b8' }}>
                        {past ? '✓' : i+1}
                      </div>
                      <span style={{ fontSize: 10, color: active ? sc.text : past ? '#22c55e' : '#94a3b8', whiteSpace: 'nowrap', fontWeight: active ? 700 : 400 }}>{s}</span>
                    </div>
                    {i < 4 && <div style={{ flex: 1, height: 2, background: past ? '#22c55e' : '#f1f5f9', borderRadius: 99, marginBottom: 14 }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Dev Feedback Card ── */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: editingDev ? '1.5px solid #4FA7A040' : '1px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={13} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2035' }}>开发反馈</span>
                {issue.devFeedback?.updatedAt && (
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>最后更新：{issue.devFeedback.updatedAt}</span>
                )}
              </div>
              <button onClick={() => setEditingDev(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: editingDev ? '#4FA7A0' : '#f1f5f9', color: editingDev ? '#fff' : '#64748b', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                {editingDev ? <><Save size={12} /> 保存</>  : <><Edit3 size={12} /> 编辑</>}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {/* Root cause */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: '#FF6B6B', display: 'inline-block' }} />问题原因分析
                </div>
                {editingDev
                  ? <textarea value={df.rootCause} onChange={e => setDf(p => ({ ...p, rootCause: e.target.value }))} rows={3} style={{ ...inp12, resize: 'vertical' }} placeholder="描述问题根本原因..." />
                  : <div style={{ background: '#FFF5F5', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#64748b', lineHeight: 1.7, minHeight: 40 }}>{df.rootCause || <span style={{ color: '#cbd5e1' }}>暂未填写</span>}</div>
                }
              </div>
              {/* Solution */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: '#22c55e', display: 'inline-block' }} />解决方案
                </div>
                {editingDev
                  ? <textarea value={df.solution} onChange={e => setDf(p => ({ ...p, solution: e.target.value }))} rows={3} style={{ ...inp12, resize: 'vertical' }} placeholder="描述解决方案和实施步骤..." />
                  : <div style={{ background: '#F0FFF4', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#64748b', lineHeight: 1.7, minHeight: 40 }}>{df.solution || <span style={{ color: '#cbd5e1' }}>暂未填写</span>}</div>
                }
              </div>
              {/* Dev / Test Owner */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>负责开发</div>
                {editingDev
                  ? <input value={df.devOwner} onChange={e => setDf(p => ({ ...p, devOwner: e.target.value }))} style={inp12} placeholder="开发负责人..." />
                  : <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', padding: '8px 0' }}>{df.devOwner || <span style={{ color: '#cbd5e1' }}>—</span>}</div>
                }
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>负责测试</div>
                {editingDev
                  ? <input value={df.testOwner} onChange={e => setDf(p => ({ ...p, testOwner: e.target.value }))} style={inp12} placeholder="测试负责人..." />
                  : <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', padding: '8px 0' }}>{df.testOwner || <span style={{ color: '#cbd5e1' }}>—</span>}</div>
                }
              </div>
              {/* Estimated Resolve / Actual Resolve */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>技术侧预估解决时间</div>
                {editingDev
                  ? <input type="date" value={df.estimatedResolveTime} onChange={e => setDf(p => ({ ...p, estimatedResolveTime: e.target.value }))} style={inp12} />
                  : <div style={{ fontSize: 12, color: '#FF9F43', fontWeight: 600, padding: '8px 0' }}>{df.estimatedResolveTime || <span style={{ color: '#cbd5e1' }}>—</span>}</div>
                }
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>实际解决时间</div>
                {editingDev
                  ? <input type="date" value={df.actualResolveTime} onChange={e => setDf(p => ({ ...p, actualResolveTime: e.target.value }))} style={inp12} />
                  : <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600, padding: '8px 0' }}>{df.actualResolveTime || <span style={{ color: '#cbd5e1' }}>未解决</span>}</div>
                }
              </div>
            </div>

            {editingDev && (
              <button onClick={() => { setEditingDev(false); alert('开发反馈已保存并通知相关人员'); }} style={{ width: '100%', background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Save size={13} /> 保存开发反馈
              </button>
            )}
          </div>

          {/* Delay Request */}
          {overdays > 0 && !issue.delayRequest && (
            <div style={{ background: '#FFF8F0', borderRadius: 14, padding: 16, border: '1px solid #FF9F4340' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <AlertTriangle size={16} color="#FF9F43" />
                <span style={{ fontWeight: 700, fontSize: 13, color: '#FF9F43' }}>已逾期 {overdays} 天 — 需要申请延期</span>
              </div>
              {!showDelayForm ? (
                <button onClick={() => setShowDelayForm(true)} style={{ background: 'linear-gradient(135deg,#FF9F43,#e8890f)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>申请延期</button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input value={delayDate} onChange={e => setDelayDate(e.target.value)} type="date" style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none' }} />
                  <textarea value={delayReason} onChange={e => setDelayReason(e.target.value)} placeholder="填写延期原因（将通知提出者审批）..." rows={3} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', resize: 'none' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => alert('延期申请已发送给提出者审批！')} style={{ background: '#FF9F43', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Send size={12} />发送申请</button>
                    <button onClick={() => setShowDelayForm(false)} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, cursor: 'pointer' }}>取消</button>
                  </div>
                </div>
              )}
            </div>
          )}
          {issue.delayRequest?.status === 'pending' && (
            <div style={{ background: '#FFF8F0', borderRadius: 14, padding: 16, border: '1px solid #FF9F4340' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#FF9F43', marginBottom: 6 }}>🕐 延期申请待提出者审批</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>申请延期至：<strong>{issue.delayRequest.requestedDate}</strong></div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>原因：{issue.delayRequest.reason}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => alert('已批准延期！')} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✓ 批准</button>
                <button onClick={() => alert('已驳回延期申请！')} style={{ background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>✗ 驳回</button>
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10 }}>问题描述</div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{issue.description}</p>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
              {issue.tags.map(t => <span key={t} style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>#{t}</span>)}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2035' }}>跟进记录 Timeline</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => alert('已发送催办通知！')} style={{ background: '#FF9F4315', color: '#FF9F43', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><Zap size={12} />催进度</button>
                <button style={{ background: '#4FA7A015', color: '#4FA7A0', border: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><MessageSquare size={12} />添加备注</button>
              </div>
            </div>
            {TIMELINE.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 99, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.actor[0]}</div>
                  <div style={{ width: 2, flex: 1, background: '#f1f5f9', marginTop: 4, minHeight: 12 }} />
                </div>
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1a2035' }}>{t.actor}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{t.role}</span>
                    <span style={{ background: t.color+'18', color: t.color, borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>{t.action}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>{t.time}</span>
                  </div>
                  <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{t.note}</div>
                </div>
              </div>
            ))}

            {/* Supplement nodes */}
            {supplements.map((s) => {
              const supColors: Record<string,string> = { '新用户反馈': '#FF6B6B', '技术进展': '#4FA7A0', '状态更新': '#6C63FF', '其他': '#94a3b8' };
              const c = supColors[s.type] || '#94a3b8';
              return (
                <div key={s.id} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 99, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Plus size={14} color="#fff" />
                    </div>
                    <div style={{ width: 2, flex: 1, background: '#f1f5f9', marginTop: 4, minHeight: 12 }} />
                  </div>
                  <div style={{ flex: 1, paddingBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#1a2035' }}>{s.author}</span>
                      <span style={{ background: c+'18', color: c, borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 600 }}>{s.type}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>{s.time}</span>
                    </div>
                    <div style={{ background: c+'0A', border: `1px solid ${c}20`, borderRadius: 10, padding: '8px 12px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{s.content}</div>
                  </div>
                </div>
              );
            })}

            {/* Add supplement node */}
            <div style={{ marginTop: 8, background: '#F8FAFC', borderRadius: 14, padding: 14, border: '1.5px dashed #e2e8f0' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a2035', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={13} color="#4FA7A0" />添加补充节点
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {(['新用户反馈','技术进展','状态更新','其他'] as const).map(t => (
                  <button key={t} onClick={() => setSupType(t)} style={{ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: supType === t ? '#4FA7A0' : '#fff', color: supType === t ? '#fff' : '#64748b', border: supType === t ? 'none' : '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.15s' }}>{t}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={`填写${supType}内容...`} rows={2} style={{ flex: 1, padding: '9px 14px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }} />
                <button onClick={() => {
                  if (!note.trim()) return;
                  setSupplements(prev => [...prev, { id: Date.now().toString(), type: supType, content: note.trim(), author: '李铧燕', time: new Date().toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(/\//g,'-') }]);
                  setNote('');
                }} style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end' }}>提交</button>
              </div>
            </div>
          </div>
        </div>

        {/* ──── Right Column ──── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Owner estimate */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><CalendarClock size={14} color="#4FA7A0" />负责人：填写预估完成时间</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>提出者预期完成：<strong style={{ color: '#1a2035' }}>{issue.expectedDate}</strong></div>
            <input type="date" value={estDate} onChange={e => setEstDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 12, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
            <button onClick={() => alert(`预估完成时间已设为 ${estDate}，已通知提出者`)} style={{ width: '100%', background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>保存并通知提出者</button>
            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>若预估时间超过预期截止日，需提交延期申请。</p>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10 }}>快捷操作</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => alert('催办通知已通过企业微信发送！')} style={{ background: 'linear-gradient(135deg,#FF9F43,#e8890f)', color: '#fff', border: 'none', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Zap size={13} /> 一键催进度</button>
              <button onClick={() => alert('问题已标记为已解决！')} style={{ background: '#22c55e18', color: '#22c55e', border: 'none', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CheckCircle2 size={13} />标记已解决</button>
              {!issue.delayRequest && overdays > 0 && (
                <button onClick={() => setShowDelayForm(true)} style={{ background: '#FF9F4315', color: '#FF9F43', border: 'none', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Clock size={13} />申请延期</button>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10 }}>问题信息</div>
            {[
              ['品牌',     issue.brand,     issue.brand==='VIRTAVO'?'#4FA7A0':'#6b8c00'],
              ['问题类型', issue.issueType || '—', issue.issueType ? ISSUE_TYPE_COLORS[issue.issueType as IssueType].color : '#94a3b8'],
              ['产品',     issue.product,   ''],
              ['来源',     issue.source,    SOURCE_COLORS[issue.source]],
              ['国家',     issue.country,   ''],
              ['提出者',   issue.reporter,  ''],
              ['负责人',   issue.owner,     ''],
              ...(issue.deviceSN  ? [['设备 SN',   issue.deviceSN,  '#4FA7A0']] : []),
              ...(issue.appAccount? [['APP 账号', issue.appAccount, '#6C63FF']] : []),
              ['创建时间', issue.createdAt, ''],
              ['最后更新', issue.updatedAt, ''],
              ...(issue.resolvedAt ? [['解决时间', issue.resolvedAt, '#22c55e']] : []),
            ].map(([k, v, c]) => (
              <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{k as string}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: (c as string) || '#1a2035', textAlign: 'right', wordBreak: 'break-all' }}>{v as string}</span>
              </div>
            ))}
          </div>

          {/* Resolve Details Card — only for 已解决/已关闭 */}
          {(issue.status === '已解决' || issue.status === '已关闭') && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1.5px solid #22c55e30' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#22c55e" />解决方案详情
                </div>
                <button onClick={() => setEditingResolve(e => !e)} style={{ background: editingResolve ? '#22c55e' : '#f1f5f9', color: editingResolve ? '#fff' : '#64748b', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {editingResolve ? <><Save size={11} />保存</> : <><Edit3 size={11} />编辑</>}
                </button>
              </div>
              {editingResolve ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>解决方式</div>
                    <select value={rd.type} onChange={e => setRd(p => ({ ...p, type: e.target.value as ResolveType }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, color: '#1a2035', background: '#f8fafc', outline: 'none' }}>
                      {(['固件更新','App版本更新','配置修复','硬件换件','服务器修复','文档指引','其他'] as ResolveType[]).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>版本 / 编号</div>
                    <input value={rd.version} onChange={e => setRd(p => ({ ...p, version: e.target.value }))} placeholder="如 V7.04.15 或 4.0.8014" style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>上线日期</div>
                    <input type="date" value={rd.releaseDate} onChange={e => setRd(p => ({ ...p, releaseDate: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>备注</div>
                    <textarea value={rd.notes} onChange={e => setRd(p => ({ ...p, notes: e.target.value }))} rows={2} style={{ width: '100%', padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  </div>
                  <button onClick={() => setEditingResolve(false)} style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>保存解决方案</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['解决方式', rd.type, '#22c55e'],
                    ['版本 / 编号', rd.version || '—', '#4FA7A0'],
                    ['上线日期', rd.releaseDate || '—', ''],
                    ['备注', rd.notes || '—', ''],
                  ].map(([k, v, c]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c || '#1a2035', textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
