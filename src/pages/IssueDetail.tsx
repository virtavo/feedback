import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle2, Clock, AlertTriangle, Send, CalendarClock, MessageSquare } from 'lucide-react';
import { MOCK_ISSUES, STATUS_COLORS, SOURCE_COLORS, PRIORITY_COLORS, getOverdueDays, DELAY_COLORS } from '@/data';

const TIMELINE = [
  { time: '2026-05-01 09:12', actor: '陈静', role: '提出者', action: '创建问题', note: '收到大量用户反馈，归类为固件问题，预期完成：2026-05-12', color: '#4FA7A0' },
  { time: '2026-05-01 11:30', actor: '李杰',  role: '负责人', action: '接受问题', note: '已接单，预估完成时间：2026-05-14，将同步固件组', color: '#6C63FF' },
  { time: '2026-05-06 14:20', actor: '张伟',  role: '固件工程师', action: '添加备注', note: '固件组已复现问题，测试修复方案中', color: '#FF9F43' },
  { time: '2026-05-10 09:00', actor: '李杰',  role: '负责人', action: '申请延期 ⚡', note: '申请延期至 2026-05-18，原因：固件组需更多时间复现边缘场景', color: '#FF6B6B' },
  { time: '2026-05-10 14:00', actor: '陈静',  role: '提出者', action: '批准延期', note: '已批准延期申请，新截止日期：2026-05-18', color: '#22c55e' },
];

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
  const progColor = issue.progress === 100 ? '#22c55e' : issue.progress >= 60 ? '#4FA7A0' : issue.progress >= 30 ? '#FF9F43' : '#FF6B6B';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => nav(-1)} style={{ background: '#fff', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}><ArrowLeft size={16} color="#64748b" /></button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a2035', margin: 0 }}>{issue.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4FA7A0', fontWeight: 700 }}>{issue.id}</span>
            <span style={{ background: sc.bg, color: sc.text, borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{issue.status}</span>
            <span style={{ background: PRIORITY_COLORS[issue.priority]+'18', color: PRIORITY_COLORS[issue.priority], borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{issue.priority}优先级</span>
            {overdays > 0 && !issue.delayRequest && (
              <span style={{ background: '#FF6B6B18', color: '#FF6B6B', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11} />⚠ 未申请逾期 {overdays} 天</span>
            )}
            {issue.delayRequest?.status === 'pending' && (
              <span style={{ background: '#FF9F4320', color: '#FF9F43', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>🕐 延期申请待审批</span>
            )}
            {issue.delayRequest?.status === 'approved' && (
              <span style={{ background: '#22c55e18', color: '#22c55e', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>✓ 延期已批准至 {issue.delayRequest.requestedDate}</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        {/* Left */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
              <span>提出者预期截止：<strong style={{ color: '#1a2035' }}>{issue.expectedDate}</strong></span>
              {issue.estimatedDate && <span>负责人预估完成：<strong style={{ color: '#4FA7A0' }}>{issue.estimatedDate}</strong></span>}
              {issue.delayRequest?.status === 'approved' && <span>延期至：<strong style={{ color: '#22c55e' }}>{issue.delayRequest.requestedDate}</strong></span>}
            </div>
            {/* Status steps */}
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
                  <input value={delayDate} onChange={e => setDelayDate(e.target.value)} type="date" placeholder="申请延期至..." style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none' }} />
                  <textarea value={delayReason} onChange={e => setDelayReason(e.target.value)} placeholder="填写延期原因（将通知提出者审批）..." rows={3} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none', resize: 'none' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => alert('延期申请已发送给提出者审批！')} style={{ background: '#FF9F43', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Send size={12} />发送申请
                    </button>
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
              <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: idx < TIMELINE.length-1 ? 14 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 99, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.actor[0]}</div>
                  {idx < TIMELINE.length-1 && <div style={{ width: 2, flex: 1, background: '#f1f5f9', marginTop: 4, minHeight: 12 }} />}
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
            {/* Add note */}
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="添加跟进备注..." style={{ flex: 1, padding: '9px 14px', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, outline: 'none' }} />
              <button onClick={() => { if(note) { alert('备注已添加'); setNote(''); } }} style={{ background: '#4FA7A0', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>提交</button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Owner Set Estimate */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><CalendarClock size={14} color="#4FA7A0" />负责人：填写预估完成时间</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>提出者预期完成：<strong style={{ color: '#1a2035' }}>{issue.expectedDate}</strong></div>
            <input type="date" value={estDate} onChange={e => setEstDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 12, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
            <button onClick={() => alert(`预估完成时间已设为 ${estDate}，已通知提出者`)} style={{ width: '100%', background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>保存并通知提出者</button>
            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>若预估时间超过预期截止日，需提交延期申请由提出者批准。</p>
          </div>

          {/* Quick Actions */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10 }}>快捷操作</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => alert('催办通知已通过企业微信发送！')} style={{ background: 'linear-gradient(135deg,#FF9F43,#e8890f)', color: '#fff', border: 'none', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Zap size={13} />⚡ 一键催进度</button>
              <button onClick={() => alert('问题已标记为已解决！')} style={{ background: '#22c55e18', color: '#22c55e', border: 'none', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CheckCircle2 size={13} />标记已解决</button>
              {!issue.delayRequest && overdays > 0 && (
                <button onClick={() => setShowDelayForm(true)} style={{ background: '#FF9F4315', color: '#FF9F43', border: 'none', borderRadius: 10, padding: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Clock size={13} />申请延期</button>
              )}
            </div>
          </div>

          {/* Meta */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', marginBottom: 10 }}>问题信息</div>
            {[
              ['品牌', issue.brand, issue.brand==='VIRTAVO'?'#4FA7A0':'#6b8c00'],
              ['产品', issue.product, ''],
              ['来源', issue.source, SOURCE_COLORS[issue.source]],
              ['国家', issue.country, ''],
              ['提出者', issue.reporter, ''],
              ['负责人', issue.owner, ''],
              ['创建时间', issue.createdAt, ''],
              ['最后更新', issue.updatedAt, ''],
              ...(issue.resolvedAt ? [['解决时间', issue.resolvedAt, '#22c55e']] : []),
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{k}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: (c as string) || '#1a2035' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
