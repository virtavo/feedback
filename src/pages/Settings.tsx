import { useState } from 'react';
import { Users, Tag, Bell, Shield, MessageCircle, Mail, Plus, Trash2, Save, Check, Zap } from 'lucide-react';
import { TEAM_MEMBERS, CATEGORIES } from '@/data';

const TABS = [
  { id:'team',    icon:Users,         label:'人员管理' },
  { id:'notify',  icon:Bell,          label:'通知设置' },
  { id:'wechat',  icon:MessageCircle, label:'企业微信' },
  { id:'email',   icon:Mail,          label:'邮件集成' },
  { id:'category',icon:Tag,           label:'分类管理' },
  { id:'brand',   icon:Shield,        label:'品牌配置' },
];

function Toggle({ on, setOn }: { on:boolean; setOn:(v:boolean)=>void }) {
  return (
    <button onClick={()=>setOn(!on)} style={{width:44,height:24,borderRadius:99,background:on?'#4FA7A0':'#e2e8f0',border:'none',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
      <div style={{position:'absolute',top:2,left:on?22:2,width:20,height:20,borderRadius:99,background:'#fff',boxShadow:'0 1px 4px rgba(0,0,0,0.15)',transition:'left 0.2s'}}/>
    </button>
  );
}

export default function Settings() {
  const [tab, setTab] = useState('notify');
  const [notifs, setNotifs] = useState({ highPriority:true, overdue:true, statusChange:false, weekly:true, delay:true, resolved:false });
  const [wechatCfg, setWechatCfg] = useState({ enabled:true, webhook:'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxx', highOnly:true, atOwner:true, atReporter:true });
  const [emailCfg, setEmailCfg] = useState({ enabled:true, smtp:'smtp.puwell.com', port:'465', user:'aftersales@puwell.com', recipients:'lijie@puwell.com, wangfang@puwell.com' });

  const card = { background:'#fff', borderRadius:16, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' };
  const inp = { padding:'9px 13px', borderRadius:10, border:'1.5px solid #e2e8f0', fontSize:12, outline:'none', background:'#F8FAFC', color:'#1a2035', width:'100%', boxSizing:'border-box' as const };

  return (
    <div>
      <div style={{marginBottom:20}}><h1 style={{fontSize:22,fontWeight:700,color:'#1a2035',margin:0}}>系统设置</h1><p style={{fontSize:12,color:'#94a3b8',marginTop:4}}>通知集成 · 人员管理 · 品牌配置</p></div>
      <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:16}}>
        {/* Sidebar */}
        <div style={{background:'#fff',borderRadius:16,padding:8,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',height:'fit-content'}}>
          {TABS.map(({id,icon:Icon,label})=>(
            <button key={id} onClick={()=>setTab(id)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:12,border:'none',background:tab===id?'#4FA7A015':'transparent',color:tab===id?'#4FA7A0':'#64748b',fontWeight:tab===id?700:400,fontSize:12,cursor:'pointer',marginBottom:2,textAlign:'left'}}>
              <Icon size={14}/>{label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {tab==='notify' && (
            <div style={card}>
              <div style={{fontWeight:700,fontSize:14,color:'#1a2035',marginBottom:16}}>🔔 通知触发规则</div>
              <p style={{fontSize:12,color:'#94a3b8',marginBottom:16}}>以下事件将自动触发通知（企业微信 / 邮件 / 两者同时），按需开启</p>
              {[
                { key:'highPriority', label:'🔴 高优先级问题创建', sub:'新建高优先级问题立即通知负责人 + 提出者' },
                { key:'overdue',      label:'⚠️ 超时未处理催办',   sub:'超过 48 小时未更新自动发送催办，附逾期天数' },
                { key:'delay',        label:'📅 延期申请通知',     sub:'负责人申请延期时通知提出者审批；审批结果通知负责人' },
                { key:'statusChange', label:'🔄 状态变更通知',     sub:'问题状态发生变更时通知相关人员' },
                { key:'weekly',       label:'📊 周报自动推送',     sub:'每周一 09:00 自动推送周报至管理员' },
                { key:'resolved',     label:'✅ 问题解决通知',     sub:'问题标记已解决时通知提出者确认' },
              ].map(({key,label,sub})=>(
                <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',borderRadius:12,background:'#F8FAFC',border:'1px solid #e2e8f0',marginBottom:8}}>
                  <div style={{flex:1,marginRight:12}}>
                    <div style={{fontSize:13,fontWeight:600,color:'#1a2035'}}>{label}</div>
                    <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{sub}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:10,color:'#94a3b8'}}>企微+邮件</span>
                    <Toggle on={notifs[key as keyof typeof notifs]} setOn={v=>setNotifs(p=>({...p,[key]:v}))}/>
                  </div>
                </div>
              ))}
              <button onClick={()=>alert('通知设置已保存！')} style={{marginTop:8,background:'linear-gradient(135deg,#4FA7A0,#3a8f89)',color:'#fff',border:'none',borderRadius:12,padding:'10px 20px',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                <Save size={14}/>保存设置
              </button>
            </div>
          )}

          {tab==='wechat' && (
            <div style={card}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:14,color:'#1a2035',display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:32,height:32,borderRadius:10,background:'#07C160',display:'flex',alignItems:'center',justifyContent:'center'}}><MessageCircle size={16} color="#fff"/></div>
                  企业微信群机器人
                </div>
                <Toggle on={wechatCfg.enabled} setOn={v=>setWechatCfg(p=>({...p,enabled:v}))}/>
              </div>
              {wechatCfg.enabled && (
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:700,color:'#1a2035',display:'block',marginBottom:6}}>Webhook URL</label>
                    <input value={wechatCfg.webhook} onChange={e=>setWechatCfg(p=>({...p,webhook:e.target.value}))} style={inp} placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=..."/>
                    <p style={{fontSize:10,color:'#94a3b8',marginTop:4}}>在企业微信群 → 群机器人 → 创建机器人 获取 Webhook</p>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {[{k:'highOnly',l:'仅高优先级通知',s:'低/中优先级不发企微，减少干扰'},{k:'atOwner',l:'@负责人',s:'消息中@对应负责人'},{k:'atReporter',l:'@提出者（延期申请时）',s:'延期审批需提出者响应'}].map(({k,l,s})=>(
                      <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderRadius:12,background:'#F8FAFC',border:'1px solid #e2e8f0'}}>
                        <div><div style={{fontSize:12,fontWeight:600,color:'#1a2035'}}>{l}</div><div style={{fontSize:10,color:'#94a3b8',marginTop:1}}>{s}</div></div>
                        <Toggle on={wechatCfg[k as keyof typeof wechatCfg] as boolean} setOn={v=>setWechatCfg(p=>({...p,[k]:v}))}/>
                      </div>
                    ))}
                  </div>
                  {/* Preview */}
                  <div style={{background:'#f0f9f4',borderRadius:14,padding:14,border:'1px solid #07C16030'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#07C160',marginBottom:8}}>📱 消息预览</div>
                    <div style={{background:'#fff',borderRadius:10,padding:12,fontSize:12,color:'#1a2035',lineHeight:1.8}}>
                      <div>🔴 【高优先级问题】ISS-001</div>
                      <div style={{color:'#64748b'}}>标题：酒壶机2K配网失败 - 大量US用户反馈</div>
                      <div style={{color:'#64748b'}}>负责人：@李杰 | 预期完成：2026-05-14</div>
                      <div style={{color:'#FF6B6B',fontWeight:600}}>⚡ 逾期 3 天未申请延期，请及时处理！</div>
                      <div style={{color:'#4FA7A0'}}>→ 点击处理：aftersales.puwell.com/#/issues/ISS-001</div>
                    </div>
                  </div>
                  <button onClick={()=>alert('✅ 企业微信测试消息已发送！')} style={{background:'#07C16020',color:'#07C160',border:'none',borderRadius:12,padding:'9px 18px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,width:'fit-content'}}>
                    <Zap size={13}/>发送测试消息
                  </button>
                  <button onClick={()=>alert('企业微信配置已保存！')} style={{background:'linear-gradient(135deg,#4FA7A0,#3a8f89)',color:'#fff',border:'none',borderRadius:12,padding:'10px 20px',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6,width:'fit-content'}}>
                    <Save size={14}/>保存配置
                  </button>
                </div>
              )}
            </div>
          )}

          {tab==='email' && (
            <div style={card}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:14,color:'#1a2035',display:'flex',alignItems:'center',gap:8}}>
                  <div style={{width:32,height:32,borderRadius:10,background:'#6C63FF',display:'flex',alignItems:'center',justifyContent:'center'}}><Mail size={16} color="#fff"/></div>
                  邮件通知配置
                </div>
                <Toggle on={emailCfg.enabled} setOn={v=>setEmailCfg(p=>({...p,enabled:v}))}/>
              </div>
              {emailCfg.enabled && (
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div><label style={{fontSize:12,fontWeight:700,color:'#1a2035',display:'block',marginBottom:6}}>SMTP 服务器</label><input value={emailCfg.smtp} onChange={e=>setEmailCfg(p=>({...p,smtp:e.target.value}))} style={inp}/></div>
                    <div><label style={{fontSize:12,fontWeight:700,color:'#1a2035',display:'block',marginBottom:6}}>端口</label><input value={emailCfg.port} onChange={e=>setEmailCfg(p=>({...p,port:e.target.value}))} style={inp}/></div>
                  </div>
                  <div><label style={{fontSize:12,fontWeight:700,color:'#1a2035',display:'block',marginBottom:6}}>发件人账号</label><input value={emailCfg.user} onChange={e=>setEmailCfg(p=>({...p,user:e.target.value}))} style={inp}/></div>
                  <div><label style={{fontSize:12,fontWeight:700,color:'#1a2035',display:'block',marginBottom:6}}>默认收件人（逗号分隔）</label><input value={emailCfg.recipients} onChange={e=>setEmailCfg(p=>({...p,recipients:e.target.value}))} style={inp}/><p style={{fontSize:10,color:'#94a3b8',marginTop:4}}>各问题负责人/提出者的邮件地址已自动从人员管理中读取</p></div>
                  {/* Preview */}
                  <div style={{background:'#F5F3FF',borderRadius:14,padding:14,border:'1px solid #6C63FF30'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#6C63FF',marginBottom:8}}>📧 邮件模板预览</div>
                    <div style={{background:'#fff',borderRadius:10,padding:14,fontSize:12,color:'#1a2035',lineHeight:2}}>
                      <div style={{fontWeight:700,marginBottom:6}}>主题：[售后系统] ⚡ 催办通知 - ISS-001 酒壶机2K配网失败</div>
                      <div style={{color:'#64748b'}}>负责人 李杰，您好：</div>
                      <div style={{color:'#64748b'}}>以下问题已逾期 3 天未更新，请及时处理或提交延期申请：</div>
                      <div style={{background:'#f1f5f9',borderRadius:8,padding:'8px 12px',margin:'8px 0'}}>问题编号：ISS-001<br/>标题：酒壶机2K配网失败 - 大量US用户反馈<br/>预期完成：2026-05-12 → 逾期 3 天</div>
                      <div style={{color:'#4FA7A0'}}>→ 处理链接：https://aftersales.puwell.com/#/issues/ISS-001</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    <button onClick={()=>alert('✅ 测试邮件已发送至 lijie@puwell.com')} style={{background:'#6C63FF15',color:'#6C63FF',border:'none',borderRadius:12,padding:'9px 18px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                      <Mail size={13}/>发送测试邮件
                    </button>
                    <button onClick={()=>alert('邮件配置已保存！')} style={{background:'linear-gradient(135deg,#4FA7A0,#3a8f89)',color:'#fff',border:'none',borderRadius:12,padding:'9px 18px',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                      <Save size={14}/>保存配置
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab==='team' && (
            <div style={card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{fontWeight:700,fontSize:14,color:'#1a2035'}}>团队成员</span>
                <button style={{background:'linear-gradient(135deg,#4FA7A0,#3a8f89)',color:'#fff',border:'none',borderRadius:10,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={13}/>添加成员</button>
              </div>
              {TEAM_MEMBERS.map((m,idx)=>(
                <div key={m.name} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',borderRadius:14,background:'#F8FAFC',border:'1px solid #e2e8f0',marginBottom:8}}>
                  <div style={{width:40,height:40,borderRadius:99,background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{m.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:'#1a2035'}}>{m.name}</div>
                    <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{m.email} · 企微: @{m.wechat}</div>
                  </div>
                  <span style={{fontSize:11,background:'#4FA7A018',color:'#4FA7A0',borderRadius:20,padding:'3px 10px',fontWeight:600}}>VIRTAVO</span>
                  <span style={{fontSize:11,background:'#22c55e18',color:'#22c55e',borderRadius:20,padding:'3px 10px',fontWeight:600}}>在职</span>
                  <button style={{background:'none',border:'none',cursor:'pointer',padding:6,borderRadius:8,color:'#A0AEC0'}}><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          )}

          {tab==='category' && (
            <div style={card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                <span style={{fontWeight:700,fontSize:14,color:'#1a2035'}}>问题分类管理</span>
                <button style={{background:'linear-gradient(135deg,#4FA7A0,#3a8f89)',color:'#fff',border:'none',borderRadius:10,padding:'8px 16px',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Plus size={13}/>添加分类</button>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {CATEGORIES.map((c,i)=>{
                  const colors=['#4FA7A0','#6C63FF','#FF6B6B','#FF9F43','#22c55e','#A0AEC0'];
                  return (
                    <div key={c} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderRadius:12,background:'#F8FAFC',border:'1px solid #e2e8f0'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{width:8,height:8,borderRadius:99,background:colors[i%6],display:'inline-block'}}/>
                        <span style={{fontSize:13,fontWeight:500,color:'#1a2035'}}>{c}</span>
                      </div>
                      <button style={{background:'none',border:'none',cursor:'pointer',padding:4,color:'#A0AEC0'}}><Trash2 size={13}/></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab==='brand' && (
            <div style={card}>
              <div style={{fontWeight:700,fontSize:14,color:'#1a2035',marginBottom:16}}>品牌 & 产品配置</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                {[{name:'VIRTAVO',accent:'#4FA7A0',products:['酒壶机2K','酒壶机200ai','双目小蛋(EggSentry)','熊猫机']},{name:'ShowMo',accent:'#D1E83E',products:['MileHub Kit','WinEye','MileFlask MF.1','MileFlask MF.1.0']}].map(b=>(
                  <div key={b.name} style={{background:`${b.accent}10`,borderRadius:16,padding:16,border:`2px solid ${b.accent}30`}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                      <div style={{width:36,height:36,borderRadius:12,background:b.name==='ShowMo'?'#3d5200':b.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff'}}>{b.name[0]}</div>
                      <div><div style={{fontWeight:700,fontSize:14,color:'#1a2035'}}>{b.name}</div><div style={{fontSize:11,color:'#94a3b8'}}>{b.products.length} 款产品</div></div>
                    </div>
                    {b.products.map(p=>(
                      <div key={p} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 10px',borderRadius:10,background:'#fff',marginBottom:6}}>
                        <span style={{fontSize:12,color:'#64748b'}}>{p}</span>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:11,color:b.name==='ShowMo'?'#6b8c00':b.accent,fontWeight:600}}><Check size={11}/>启用</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
