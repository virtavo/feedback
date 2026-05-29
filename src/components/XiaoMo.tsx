import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, Zap, FileUp, BarChart2, HelpCircle, Sparkles, Settings2, AlertCircle } from 'lucide-react';
import { MOCK_ISSUES, TEAM_MEMBERS } from '@/data';
import { useBrandStore } from '@/store/brandStore';
import { useNavigate } from 'react-router-dom';

/* ── Types ── */
interface Msg { id: string; role: 'user' | 'bot'; text: string; time: string; actions?: Action[]; streaming?: boolean }
interface Action { label: string; onClick: () => void }

const QUICK_CMDS = [
  { icon: <BarChart2 size={12}/>, label: '本周统计',  cmd: '请统计一下当前所有问题的数据情况' },
  { icon: <FileUp    size={12}/>, label: '导入客诉',  cmd: '我想批量导入客诉，怎么操作' },
  { icon: <Zap       size={12}/>, label: '高优问题',  cmd: '列出所有高优先级未解决的问题' },
  { icon: <HelpCircle size={12}/>, label: '使用帮助', cmd: '这个系统怎么用，有哪些功能' },
];

/* ── LocalStorage helpers ── */
const LS_KEY = 'xiaoMo_aiConfig';
export interface AiConfig { apiKey: string; model: string; baseUrl: string }
export function getAiConfig(): AiConfig {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return { apiKey:'', model:'deepseek-chat', baseUrl:'https://us2.ipc5g.com/openrouter' }; }
}
export function saveAiConfig(cfg: AiConfig) { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); }

/* ── Build system prompt with live data ── */
function buildSystemPrompt(brand: string): string {
  const issues = brand ? MOCK_ISSUES.filter(i => i.brand === brand) : MOCK_ISSUES;
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - (now.getDay()||7) + 1); weekStart.setHours(0,0,0,0);
  const stats = {
    total: issues.length,
    pending:  issues.filter(i => i.status === '待处理').length,
    inProg:   issues.filter(i => i.status === '处理中').length,
    waitConfirm: issues.filter(i => i.status === '待确认').length,
    resolved: issues.filter(i => i.status === '已解决' || i.status === '已关闭').length,
    weekNew:  issues.filter(i => new Date(i.createdAt) >= weekStart).length,
    highPri:  issues.filter(i => i.priority === '高').length,
    overdue:  issues.filter(i => { const d = i.estimatedDate||i.expectedDate; return d && new Date(d)<now && i.status!=='已解决' && i.status!=='已关闭'; }).length,
    software: issues.filter(i => i.issueType === '软件').length,
    hardware: issues.filter(i => i.issueType === '硬件').length,
    server:   issues.filter(i => i.issueType === '服务器').length,
  };
  const issuesSummary = issues.slice(0,15).map(i =>
    `[${i.id}] ${i.title} | 品牌:${i.brand} | 状态:${i.status} | 优先级:${i.priority} | 负责:${i.owner} | 进度:${i.progress}% | 截止:${i.estimatedDate||i.expectedDate||'未设置'}`
  ).join('\n');
  const members = TEAM_MEMBERS.map(m => `${m.name}(${m.title}, ${m.email})`).join('、');

  return `你是"小末"，${brand||'VIRTAVO/ShowMo'}品牌的售后智能助手，服务于 Puwell Technology 内部售后管理系统。
你的能力：帮助团队成员查询问题状态、分析售后数据、指导系统操作、协助整理和导入客诉。

【当前数据快照 - ${now.toLocaleDateString('zh-CN')}】
总问题数: ${stats.total} | 待处理: ${stats.pending} | 处理中: ${stats.inProg} | 待确认: ${stats.waitConfirm} | 已解决: ${stats.resolved}
本周新增: ${stats.weekNew} | 高优先级: ${stats.highPri} | 逾期: ${stats.overdue}
问题分类 - 软件: ${stats.software} | 硬件: ${stats.hardware} | 服务器: ${stats.server}

【最新问题列表（前15条）】
${issuesSummary}

【团队成员】${members}

【系统功能说明】
- 总览Dashboard：本周新问题看板、高优问题、趋势图
- 问题列表：支持筛选/搜索，近7/14/30/90天快选，平台/状态/类型过滤
- 看板视图：拖拽式状态流转（待处理→处理中→待确认→已解决）
- 新建问题：手动填写 或 Excel/CSV批量导入（下载模板→填写→上传）
- 问题详情：进度条、开发反馈卡、补充节点、延期申请、解决方案详情
- 开发视角：右上角切换，专为开发工程师设计
- 周报视图：自动生成周度汇报
- 数据统计：退款率、分类占比等深度分析

【回复要求】
1. 语言简洁专业，使用中文回复
2. 涉及具体问题时直接给出问题编号和关键信息
3. 可以给出操作建议和跳转提示（用括号标注如：【前往新建问题页】）
4. 数据分析要有洞察，不只是列数字
5. 如果用户想修改某个问题的信息，告知他们前往对应问题详情页操作`;
}

/* ── OpenAI streaming call ── */
async function callOpenAI(
  messages: { role: string; content: string }[],
  config: AiConfig,
  onChunk: (t: string) => void,
  onDone: () => void,
  onError: (e: string) => void,
) {
  const url = (config.baseUrl || 'https://us2.ipc5g.com/openrouter').replace(/\/$/, '') + '/chat/completions';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
      body: JSON.stringify({ model: config.model || 'gpt-4o', messages, stream: true, temperature: 0.7, max_tokens: 1000 }),
    });
    if (!res.ok) { const e = await res.text(); onError(`API 错误 ${res.status}: ${e}`); return; }
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) { onDone(); break; }
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.replace(/^data: /, '').trim();
        if (!trimmed || trimmed === '[DONE]') continue;
        try {
          const j = JSON.parse(trimmed);
          const delta = j.choices?.[0]?.delta?.content;
          if (delta) onChunk(delta);
        } catch { /* skip */ }
      }
    }
  } catch (e: any) { onError(`连接失败：${e.message}。如在国内请使用 DeepSeek (api.deepseek.com/v1) 或 Moonshot，OpenAI 在国内需要代理。`); }
}

function tsNow() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); }

/* ── Render markdown-lite text ── */
function RenderText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={i}>
            {parts.map((p, j) =>
              p.startsWith('**') && p.endsWith('**')
                ? <strong key={j}>{p.slice(2,-2)}</strong>
                : <span key={j}>{p}</span>
            )}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

/* ══ 主组件 ══ */
export default function XiaoMo() {
  const [open, setOpen]     = useState(false);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [showCfg, setShowCfg] = useState(false);
  const [cfgForm, setCfgForm] = useState<AiConfig>({ apiKey: '', model: 'deepseek-chat', baseUrl: 'https://us2.ipc5g.com/openrouter' });
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: '0', role: 'bot', time: tsNow(),
    text: '你好！我是 **小末** 🤖\n\n售后智能助手，已连接实时数据。\n\n你可以问我统计数据、导入客诉、查询具体问题，或者让我帮你分析售后趋势。',
  }]);
  const [openHistory, setOpenHistory] = useState<{ role: string; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const { activeBrand } = useBrandStore();
  const nav = useNavigate();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);
  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 120); setCfgForm(getAiConfig()); } }, [open]);

  const aiConfig = getAiConfig();
  const hasKey   = !!aiConfig.apiKey;

  const sendMsg = useCallback(async (text: string) => {
    if (!text.trim() || typing) return;
    const userMsg: Msg = { id: Date.now().toString(), role: 'user', text, time: tsNow() };
    const newHistory = [...openHistory, { role: 'user', content: text }];
    setMsgs(p => [...p, userMsg]);
    setInput('');
    setTyping(true);

    const cfg = getAiConfig();
    if (!cfg.apiKey) {
      /* No key — show config prompt */
      setTimeout(() => {
        setMsgs(p => [...p, {
          id: Date.now().toString(), role: 'bot', time: tsNow(),
          text: '⚙️ 还没有配置 AI 密钥。\n\n点击右上角 **设置** 图标，填写你的 OpenAI API Key 即可启用真实 AI 对话。',
          actions: [{ label: '立即配置', onClick: () => setShowCfg(true) }],
        }]);
        setTyping(false);
      }, 400);
      return;
    }

    /* Streaming AI call */
    const botId = (Date.now() + 1).toString();
    setMsgs(p => [...p, { id: botId, role: 'bot', text: '', time: tsNow(), streaming: true }]);

    const systemMsg = { role: 'system', content: buildSystemPrompt(activeBrand) };
    const apiMsgs   = [systemMsg, ...newHistory];
    let fullText = '';

    await callOpenAI(
      apiMsgs, cfg,
      (chunk) => {
        fullText += chunk;
        setMsgs(p => p.map(m => m.id === botId ? { ...m, text: fullText } : m));
      },
      () => {
        setMsgs(p => p.map(m => m.id === botId ? { ...m, streaming: false } : m));
        setOpenHistory([...newHistory, { role: 'assistant', content: fullText }]);
        setTyping(false);
        /* Auto-inject nav actions */
        const lower = fullText.toLowerCase();
        const actions: Action[] = [];
        if (/问题列表|issue/.test(lower))    actions.push({ label: '前往问题列表', onClick: () => nav('/issues') });
        if (/新建|导入|import/.test(lower))  actions.push({ label: '前往新建问题', onClick: () => nav('/new') });
        if (/看板/.test(lower))              actions.push({ label: '前往看板', onClick: () => nav('/kanban') });
        if (/周报/.test(lower))              actions.push({ label: '前往周报', onClick: () => nav('/weekly') });
        if (/统计|analytics/.test(lower))   actions.push({ label: '前往统计', onClick: () => nav('/analytics') });
        if (actions.length) setMsgs(p => p.map(m => m.id === botId ? { ...m, actions } : m));
      },
      (err) => {
        setMsgs(p => p.map(m => m.id === botId ? { ...m, text: `❌ ${err}`, streaming: false } : m));
        setTyping(false);
      },
    );
  }, [typing, openHistory, activeBrand, nav]);

  function saveCfg() { saveAiConfig(cfgForm); setShowCfg(false); setMsgs(p => [...p, { id: Date.now().toString(), role: 'bot', time: tsNow(), text: '✅ AI 配置已保存！现在可以开始真实对话了。' }]); }
  function clearHistory() { setOpenHistory([]); setMsgs([{ id: '0', role: 'bot', time: tsNow(), text: '对话已清空，重新开始！' }]); }

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(v => !v)} title="小末 AI 助手" style={{ position:'fixed', bottom:28, right:28, zIndex:1000, width:52, height:52, borderRadius:99, background:'linear-gradient(135deg,#4FA7A0,#6C63FF)', border:'none', cursor:'pointer', boxShadow:'0 4px 20px rgba(79,167,160,0.5)', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 0.2s,box-shadow 0.2s' }}
        onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.1)';e.currentTarget.style.boxShadow='0 8px 28px rgba(79,167,160,0.6)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';e.currentTarget.style.boxShadow='0 4px 20px rgba(79,167,160,0.5)';}}>
        {open ? <X size={20} color="#fff"/> : <Sparkles size={20} color="#fff"/>}
        {!open && <span style={{position:'absolute',top:5,right:5,width:11,height:11,borderRadius:99,background: hasKey ? '#4ade80' : '#FF9F43',border:'2px solid #fff'}}/>}
      </button>

      {/* Panel */}
      {open && (
        <div style={{ position:'fixed', bottom:92, right:28, zIndex:999, width:400, height:580, background:'#fff', borderRadius:20, boxShadow:'0 16px 56px rgba(0,0,0,0.18)', display:'flex', flexDirection:'column', overflow:'hidden', border:'1px solid #e2e8f0', animation:'xmIn 0.18s ease' }}>
          <style>{`@keyframes xmIn{from{opacity:0;transform:scale(0.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}} @keyframes blink{0%,80%,100%{opacity:0.2}40%{opacity:1}}`}</style>

          {/* Header */}
          <div style={{ background:'linear-gradient(135deg,#4FA7A0,#6C63FF)', padding:'12px 14px', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bot size={17} color="#fff"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.2 }}>小末</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:99, background: hasKey ? '#4ade80' : '#fbbf24', display:'inline-block' }}/>
                {hasKey ? 'AI 已连接 · ' + (aiConfig.model||'gpt-4o') : '未配置 API Key'}
              </div>
            </div>
            <button onClick={clearHistory} title="清空对话" style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, padding:'4px 8px', fontSize:10, color:'#fff', cursor:'pointer' }}>清空</button>
            <button onClick={() => setShowCfg(v=>!v)} title="AI设置" style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, padding:6, cursor:'pointer', display:'flex', alignItems:'center' }}>
              <Settings2 size={14} color="#fff"/>
            </button>
          </div>

          {/* AI Config panel */}
          {showCfg && (
            <div style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0', padding:'12px 14px', flexShrink:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#1a2035', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}><Settings2 size={13} color="#6C63FF"/>AI 配置</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <input value={cfgForm.apiKey} onChange={e=>setCfgForm(p=>({...p,apiKey:e.target.value}))} placeholder="API Key (sk-...)" type="password" style={{ padding:'7px 10px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:12, outline:'none', background:'#fff' }}/>
                <div style={{ display:'flex', gap:6 }}>
                  <input value={cfgForm.model} onChange={e=>setCfgForm(p=>({...p,model:e.target.value}))} placeholder="模型 (deepseek-chat / gpt-4o)" style={{ flex:1, padding:'7px 10px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:12, outline:'none', background:'#fff' }}/>
                  <button onClick={saveCfg} style={{ background:'linear-gradient(135deg,#4FA7A0,#6C63FF)', color:'#fff', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer' }}>保存</button>
                </div>
                <input value={cfgForm.baseUrl} onChange={e=>setCfgForm(p=>({...p,baseUrl:e.target.value}))} placeholder="Base URL (deepseek.com/v1 或 openai.com/v1)" style={{ padding:'7px 10px', borderRadius:8, border:'1px solid #e2e8f0', fontSize:11, outline:'none', background:'#fff', color:'#94a3b8' }}/>
                <div style={{ fontSize:10, color:'#94a3b8' }}>Key 仅存于本地浏览器。国内推荐 DeepSeek (api.deepseek.com/v1) 或 Moonshot (api.moonshot.cn/v1)，OpenAI 需代理。</div>
              </div>
            </div>
          )}

          {/* Quick commands */}
          {!showCfg && (
            <div style={{ display:'flex', gap:5, padding:'8px 12px', borderBottom:'1px solid #f1f5f9', flexShrink:0, overflowX:'auto' }}>
              {QUICK_CMDS.map(q => (
                <button key={q.label} onClick={()=>sendMsg(q.cmd)} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:20, background:'#f1f5f9', color:'#64748b', border:'none', cursor:'pointer', fontSize:11, fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#4FA7A018';e.currentTarget.style.color='#4FA7A0';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#f1f5f9';e.currentTarget.style.color='#64748b';}}>
                  {q.icon}{q.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px 12px 6px', display:'flex', flexDirection:'column', gap:10 }}>
            {msgs.map(m => (
              <div key={m.id} style={{ display:'flex', flexDirection: m.role==='user'?'row-reverse':'row', gap:7, alignItems:'flex-start' }}>
                {m.role==='bot' && (
                  <div style={{ width:26, height:26, borderRadius:9, background:'linear-gradient(135deg,#4FA7A0,#6C63FF)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                    <Bot size={13} color="#fff"/>
                  </div>
                )}
                <div style={{ maxWidth:'80%', display:'flex', flexDirection:'column', gap:5, alignItems: m.role==='user'?'flex-end':'flex-start' }}>
                  <div style={{ background: m.role==='user'?'linear-gradient(135deg,#4FA7A0,#3a8f89)':'#F8FAFC', color: m.role==='user'?'#fff':'#1a2035', borderRadius: m.role==='user'?'16px 4px 16px 16px':'4px 16px 16px 16px', padding:'9px 12px', fontSize:12, lineHeight:1.75, border: m.role==='bot'?'1px solid #e2e8f0':'none', wordBreak:'break-word', whiteSpace:'pre-wrap' }}>
                    <RenderText text={m.text||''}/>
                    {m.streaming && <span style={{ display:'inline-block', width:8, height:8, borderRadius:99, background:'#4FA7A0', marginLeft:3, animation:'blink 1.2s infinite' }}/>}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {m.actions.map((a,i) => (
                        <button key={i} onClick={a.onClick} style={{ padding:'3px 9px', borderRadius:20, fontSize:11, fontWeight:600, background:'#4FA7A018', color:'#4FA7A0', border:'1px solid #4FA7A030', cursor:'pointer' }}
                          onMouseEnter={e=>{e.currentTarget.style.background='#4FA7A0';e.currentTarget.style.color='#fff';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='#4FA7A018';e.currentTarget.style.color='#4FA7A0';}}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize:10, color:'#cbd5e1' }}>{m.time}</span>
                </div>
              </div>
            ))}
            {typing && !msgs.at(-1)?.streaming && (
              <div style={{ display:'flex', gap:7 }}>
                <div style={{ width:26, height:26, borderRadius:9, background:'linear-gradient(135deg,#4FA7A0,#6C63FF)', display:'flex', alignItems:'center', justifyContent:'center' }}><Bot size={13} color="#fff"/></div>
                <div style={{ background:'#F8FAFC', border:'1px solid #e2e8f0', borderRadius:'4px 16px 16px 16px', padding:'12px 14px', display:'flex', gap:4 }}>
                  {[0,1,2].map(i=><span key={i} style={{ width:6, height:6, borderRadius:99, background:'#4FA7A0', display:'inline-block', animation:`blink 1.2s ${i*0.2}s infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:'1px solid #f1f5f9', flexShrink:0 }}>
            {!hasKey && (
              <div style={{ display:'flex', alignItems:'center', gap:6, background:'#FFF7ED', borderRadius:8, padding:'6px 10px', marginBottom:8, fontSize:11, color:'#92400e' }}>
                <AlertCircle size={12}/> 未配置 API Key —
                <button onClick={()=>setShowCfg(true)} style={{ background:'none', border:'none', color:'#F59E0B', fontWeight:700, cursor:'pointer', fontSize:11, padding:0 }}>立即配置</button>
              </div>
            )}
            <div style={{ display:'flex', gap:7, alignItems:'center', background:'#f8fafc', borderRadius:13, padding:'6px 6px 6px 13px', border:'1.5px solid #e2e8f0' }}>
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMsg(input)} placeholder={hasKey?'问我任何售后问题…':'请先配置 API Key'} style={{ flex:1, border:'none', background:'transparent', fontSize:13, color:'#1a2035', outline:'none' }}/>
              <button onClick={()=>sendMsg(input)} disabled={!input.trim()||typing} style={{ width:34, height:34, borderRadius:10, background: input.trim()&&!typing?'linear-gradient(135deg,#4FA7A0,#6C63FF)':'#e2e8f0', border:'none', cursor: input.trim()&&!typing?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s', flexShrink:0 }}>
                <Send size={14} color={input.trim()&&!typing?'#fff':'#94a3b8'}/>
              </button>
            </div>
            <div style={{ fontSize:10, color:'#e2e8f0', textAlign:'center', marginTop:5 }}>小末 · Powered by Puwell Technology</div>
          </div>
        </div>
      )}
    </>
  );
}
