import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Zap, FileUp, BarChart2, HelpCircle, ChevronDown, Paperclip, Sparkles } from 'lucide-react';
import { MOCK_ISSUES, TEAM_MEMBERS, STATUS_COLORS } from '@/data';
import { useBrandStore } from '@/store/brandStore';
import { useNavigate } from 'react-router-dom';

/* ── Types ── */
interface Msg { id: string; role: 'user' | 'bot'; text: string; time: string; actions?: Action[] }
interface Action { label: string; onClick: () => void; color?: string }

/* ── 快捷指令 ── */
const QUICK_CMDS = [
  { icon: <BarChart2 size={13}/>, label: '本周统计',   cmd: '本周问题统计' },
  { icon: <FileUp    size={13}/>, label: '导入客诉',   cmd: '一键导入客诉' },
  { icon: <Zap       size={13}/>, label: '高优问题',   cmd: '有哪些高优先级问题' },
  { icon: <HelpCircle size={13}/>, label: '使用帮助',  cmd: '怎么使用这个系统' },
];

/* ── 简单统计工具 ── */
function getStats(brand?: string) {
  const issues = brand ? MOCK_ISSUES.filter(i => i.brand === brand) : MOCK_ISSUES;
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - (now.getDay()||7) + 1); weekStart.setHours(0,0,0,0);
  const weekNew = issues.filter(i => new Date(i.createdAt) >= weekStart).length;
  return {
    total: issues.length,
    pending: issues.filter(i => i.status === '待处理').length,
    inProg:  issues.filter(i => i.status === '处理中').length,
    resolved:issues.filter(i => i.status === '已解决' || i.status === '已关闭').length,
    weekNew,
    highPri: issues.filter(i => i.priority === '高').length,
    overdue: issues.filter(i => {
      const d = i.estimatedDate || i.expectedDate;
      return d && new Date(d) < now && i.status !== '已解决' && i.status !== '已关闭';
    }).length,
  };
}

/* ── 智能回复引擎 ── */
function buildReply(text: string, brand: string, nav: (p: string) => void): { text: string; actions?: Action[] } {
  const t = text.trim().toLowerCase();
  const stats = getStats(brand || undefined);

  /* 统计 */
  if (/统计|汇总|数量|几个|多少/.test(t)) {
    return {
      text: `📊 **${brand || '全品牌'}当前数据**\n\n` +
        `• 总问题数：**${stats.total}** 个\n` +
        `• 待处理：**${stats.pending}** 个 🔴\n` +
        `• 处理中：**${stats.inProg}** 个 🟡\n` +
        `• 已解决：**${stats.resolved}** 个 ✅\n` +
        `• 本周新增：**${stats.weekNew}** 个\n` +
        `• 高优先级：**${stats.highPri}** 个\n` +
        `• 逾期未解决：**${stats.overdue}** 个`,
      actions: [{ label: '查看问题列表', onClick: () => nav('/issues') }],
    };
  }

  /* 导入客诉 */
  if (/导入|上传|批量|客诉|import/.test(t)) {
    return {
      text: `📥 **一键导入客诉**\n\n我来帮你导入！支持以下方式：\n\n1️⃣ **Excel/CSV 批量导入**\n前往「新建问题」页面，点击「批量导入工单」，上传文件即可自动解析。\n\n2️⃣ **手动快速录入**\n告诉我问题标题、来源、产品，我帮你整理成导入格式。\n\n3️⃣ **粘贴文本**\n直接把客诉内容粘贴给我，我帮你提取关键信息。`,
      actions: [
        { label: '去新建问题页', onClick: () => nav('/new') },
        { label: '下载导入模板', onClick: () => { nav('/new'); } },
      ],
    };
  }

  /* 高优先级问题 */
  if (/高优|紧急|urgent|优先/.test(t)) {
    const high = MOCK_ISSUES.filter(i => i.priority === '高' && (brand ? i.brand === brand : true));
    if (!high.length) return { text: '🎉 当前没有高优先级未解决问题，状态良好！' };
    return {
      text: `🔴 **高优先级问题（${high.length} 个）**\n\n` +
        high.slice(0, 5).map(i => `• **${i.id}** ${i.title}\n  负责人：${i.owner} · 状态：${i.status}`).join('\n\n') +
        (high.length > 5 ? `\n\n…共 ${high.length} 个` : ''),
      actions: high.slice(0, 3).map(i => ({ label: `查看 ${i.id}`, onClick: () => nav(`/issues/${i.id}`) })),
    };
  }

  /* 逾期 */
  if (/逾期|超期|overdue|延期/.test(t)) {
    const now = new Date();
    const od = MOCK_ISSUES.filter(i => {
      const d = i.estimatedDate || i.expectedDate;
      return d && new Date(d) < now && i.status !== '已解决' && i.status !== '已关闭';
    });
    if (!od.length) return { text: '✅ 当前没有逾期问题，所有问题均在预期时间内！' };
    return {
      text: `⚠️ **逾期未解决（${od.length} 个）**\n\n` +
        od.map(i => `• **${i.id}** ${i.title}\n  截止：${i.estimatedDate || i.expectedDate} · 负责：${i.owner}`).join('\n\n'),
      actions: [{ label: '查看全部逾期', onClick: () => nav('/issues') }],
    };
  }

  /* 帮助 */
  if (/帮助|怎么|如何|使用|help|tutorial/.test(t)) {
    return {
      text: `📖 **系统使用指南**\n\n` +
        `🏠 **总览 Dashboard** — 查看本周新问题看板、高优问题、数据趋势\n\n` +
        `📋 **问题列表** — 筛选/搜索全部问题，支持近7/14/30/90天快选\n\n` +
        `🗂 **看板视图** — 拖拽式状态管理（待处理→处理中→待确认→已解决）\n\n` +
        `➕ **新建问题** — 手动创建或 Excel 批量导入客诉\n\n` +
        `👨‍💻 **开发视角** — 右上角切换，查看技术任务、填写开发反馈\n\n` +
        `📊 **数据统计** — 退款率趋势、问题分类占比分析`,
      actions: [
        { label: '新建问题',    onClick: () => nav('/new') },
        { label: '查看看板',    onClick: () => nav('/kanban') },
        { label: '数据统计',    onClick: () => nav('/analytics') },
      ],
    };
  }

  /* 修改问题 */
  const issueMatch = text.match(/ISS-\d+/i);
  if (issueMatch) {
    const id = issueMatch[0].toUpperCase();
    const issue = MOCK_ISSUES.find(i => i.id === id);
    if (issue) {
      return {
        text: `🔍 **找到问题 ${id}**\n\n` +
          `标题：${issue.title}\n状态：${issue.status}\n负责人：${issue.owner}\n优先级：${issue.priority}\n进度：${issue.progress}%`,
        actions: [{ label: `查看 ${id} 详情`, onClick: () => nav(`/issues/${issue.id}`) }],
      };
    }
  }

  /* 团队成员 */
  if (/成员|团队|同事|负责人|member/.test(t)) {
    return {
      text: `👥 **团队成员（${TEAM_MEMBERS.length} 人）**\n\n` +
        TEAM_MEMBERS.map(m => `• **${m.name}** · ${m.title} · ${m.email}`).join('\n'),
      actions: [{ label: '管理团队', onClick: () => nav('/settings') }],
    };
  }

  /* 周报 */
  if (/周报|报告|report|week/.test(t)) {
    return {
      text: `📝 **周报功能**\n\n前往「周报视图」自动生成本周问题汇总，可导出 PDF 分享给管理层。`,
      actions: [{ label: '查看周报', onClick: () => nav('/weekly') }],
    };
  }

  /* 品牌切换 */
  if (/virtavo|showmo|品牌|切换/.test(t)) {
    return {
      text: `🔀 **品牌切换**\n\n点击左侧侧边栏顶部的 **VIRTAVO / ShowMo** 标签即可切换品牌视图，所有数据会自动按品牌过滤。\n\n当前品牌：**${brand || 'VIRTAVO'}**`,
    };
  }

  /* 默认回复 */
  const suggestions = ['本周统计', '导入客诉', '高优先级问题', '使用帮助', '逾期问题'];
  return {
    text: `你好！我是小末 👋 售后问题处理助手。\n\n你可以问我：\n${suggestions.map(s => `• ${s}`).join('\n')}\n\n或者直接输入问题编号（如 ISS-001）查询详情。`,
    actions: QUICK_CMDS.slice(0, 3).map(q => ({ label: q.label, onClick: () => {} })),
  };
}

/* ══ 主组件 ══ */
export default function XiaoMo() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: '0', role: 'bot', time: now(),
    text: '你好！我是 **小末** 🤖\n\nVIRTAVO / ShowMo 售后智能助手，随时为你提供帮助。\n\n可以问我统计数据、导入客诉、查询问题，或者告诉我你想修改哪条问题的信息。',
    actions: QUICK_CMDS.map(q => ({ label: q.label, onClick: () => {} })),
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const { activeBrand } = useBrandStore();
  const nav = useNavigate();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  function now() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); }

  function sendMsg(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now().toString(), role: 'user', text, time: now() };
    setMsgs(p => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = buildReply(text, activeBrand, nav);
      // Wire up action onClick to re-send or navigate
      const actions = reply.actions?.map(a => ({
        ...a,
        onClick: () => { a.onClick(); if (!a.onClick.toString().includes('nav(')) { /* noop */ } },
      }));
      setMsgs(p => [...p, { id: Date.now().toString(), role: 'bot', text: reply.text, time: now(), actions: reply.actions }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  }

  /* Render message text with bold/newlines */
  function renderText(text: string) {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 52, height: 52, borderRadius: 99,
          background: 'linear-gradient(135deg, #4FA7A0, #6C63FF)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(79,167,160,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(79,167,160,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,167,160,0.45)'; }}
      >
        {open ? <X size={20} color="#fff" /> : <Sparkles size={20} color="#fff" />}
        {/* unread dot */}
        {!open && <span style={{ position:'absolute', top:6, right:6, width:10, height:10, borderRadius:99, background:'#FF6B6B', border:'2px solid #fff' }} />}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 28, zIndex: 999,
          width: 380, height: 560,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #e2e8f0',
          animation: 'xiaomoIn 0.2s ease',
        }}>
          <style>{`@keyframes xiaomoIn { from { opacity:0; transform:scale(0.92) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#4FA7A0,#6C63FF)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>小末</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>售后智能助手 · 随时为你服务</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: '#4ade80' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>在线</span>
            </div>
          </div>

          {/* Quick commands */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 12px', borderBottom: '1px solid #f1f5f9', flexShrink: 0, overflowX: 'auto' }}>
            {QUICK_CMDS.map(q => (
              <button key={q.label} onClick={() => sendMsg(q.cmd)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 20, background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#4FA7A018'; e.currentTarget.style.color='#4FA7A0'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#f1f5f9';   e.currentTarget.style.color='#64748b'; }}>
                {q.icon}{q.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
                {/* Avatar */}
                {m.role === 'bot' && (
                  <div style={{ width: 28, height: 28, borderRadius: 10, background: 'linear-gradient(135deg,#4FA7A0,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={14} color="#fff" />
                  </div>
                )}
                <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 6, alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {/* Bubble */}
                  <div style={{
                    background: m.role === 'user' ? 'linear-gradient(135deg,#4FA7A0,#3a8f89)' : '#F8FAFC',
                    color: m.role === 'user' ? '#fff' : '#1a2035',
                    borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    padding: '10px 13px', fontSize: 12, lineHeight: 1.7,
                    border: m.role === 'bot' ? '1px solid #e2e8f0' : 'none',
                  }}>
                    {renderText(m.text)}
                  </div>
                  {/* Action buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {m.actions.map((a, i) => (
                        <button key={i} onClick={a.onClick} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#4FA7A018', color: '#4FA7A0', border: '1px solid #4FA7A030', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background='#4FA7A0'; e.currentTarget.style.color='#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='#4FA7A018'; e.currentTarget.style.color='#4FA7A0'; }}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: 10, color: '#cbd5e1' }}>{m.time}</span>
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: 'linear-gradient(135deg,#4FA7A0,#6C63FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} color="#fff" />
                </div>
                <div style={{ background: '#F8FAFC', border: '1px solid #e2e8f0', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: '#4FA7A0', display: 'inline-block', animation: `bounce 1.2s ${i*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#f8fafc', borderRadius: 14, padding: '6px 6px 6px 14px', border: '1.5px solid #e2e8f0' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg(input)}
                placeholder="问我任何售后问题…"
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: '#1a2035', outline: 'none', lineHeight: 1.5 }}
              />
              <button onClick={() => sendMsg(input)} disabled={!input.trim()} style={{ width: 34, height: 34, borderRadius: 10, background: input.trim() ? 'linear-gradient(135deg,#4FA7A0,#6C63FF)' : '#e2e8f0', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}>
                <Send size={14} color={input.trim() ? '#fff' : '#94a3b8'} />
              </button>
            </div>
            <div style={{ fontSize: 10, color: '#cbd5e1', textAlign: 'center', marginTop: 6 }}>小末 · AI 售后助手 · Powered by Puwell</div>
          </div>

          <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }`}</style>
        </div>
      )}
    </>
  );
}
