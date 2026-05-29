import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { PRODUCTS, CATEGORIES, COUNTRIES, TEAM_MEMBERS, PRIORITY_COLORS, SOURCE_COLORS } from '@/data';

export default function NewIssue() {
  const nav = useNavigate();
  const [brand, setBrand] = useState<'VIRTAVO'|'ShowMo'>('VIRTAVO');
  const [f, setF] = useState({ title:'', product:'', category:'', country:'', source:'APP工单', priority:'中', owner:'李杰', expectedDate:'', description:'', tags:'' });
  const set = (k: string, v: string) => setF(p => ({...p,[k]:v}));

  const Inp = ({label, req, children}: {label:string;req?:boolean;children:React.ReactNode}) => (
    <div style={{marginBottom:16}}>
      <label style={{display:'flex',alignItems:'center',gap:4,fontSize:12,fontWeight:700,color:'#1a2035',marginBottom:6}}>{label}{req&&<span style={{color:'#FF6B6B'}}>*</span>}</label>
      {children}
    </div>
  );
  const inp = {padding:'10px 14px',borderRadius:12,border:'1.5px solid #e2e8f0',fontSize:13,outline:'none',background:'#F8FAFC',color:'#1a2035',width:'100%',boxSizing:'border-box' as const};
  const sel = {...inp,appearance:'none' as const};

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <button onClick={()=>nav(-1)} style={{background:'#fff',border:'none',borderRadius:12,padding:8,cursor:'pointer',boxShadow:'0 1px 8px rgba(0,0,0,0.06)'}}><ArrowLeft size={16} color="#64748b"/></button>
        <div><h1 style={{fontSize:22,fontWeight:700,color:'#1a2035',margin:0}}>新建问题</h1><p style={{fontSize:12,color:'#94a3b8',marginTop:4}}>提出者填写问题信息、优先级及预期完成时间</p></div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:16}}>
        <div>
          {/* Basic */}
          <div style={{background:'#fff',borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:14,color:'#1a2035',marginBottom:16}}>📋 基本信息</div>
            <Inp label="问题标题" req>
              <input value={f.title} onChange={e=>set('title',e.target.value)} placeholder="简明描述问题，例：酒壶机配网失败-iOS大量反馈" style={inp}/>
            </Inp>
            <Inp label="品牌" req>
              <div style={{display:'flex',gap:10}}>
                {(['VIRTAVO','ShowMo'] as const).map(b=>(
                  <button key={b} onClick={()=>setBrand(b)} style={{flex:1,padding:'10px 0',borderRadius:12,border:brand===b?'2px solid transparent':'2px solid #e2e8f0',background:brand===b?(b==='VIRTAVO'?'#4FA7A0':'#D1E83E'):'#F8FAFC',color:brand===b?(b==='ShowMo'?'#3d5200':'#fff'):'#64748b',fontWeight:700,fontSize:13,cursor:'pointer'}}>{b}</button>
                ))}
              </div>
            </Inp>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Inp label="产品" req>
                <select value={f.product} onChange={e=>set('product',e.target.value)} style={sel}><option value="">选择产品...</option>{PRODUCTS[brand].map(p=><option key={p}>{p}</option>)}</select>
              </Inp>
              <Inp label="问题分类" req>
                <select value={f.category} onChange={e=>set('category',e.target.value)} style={sel}><option value="">选择分类...</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
              </Inp>
            </div>
            <Inp label="问题描述" req>
              <textarea value={f.description} onChange={e=>set('description',e.target.value)} rows={5} placeholder="详细描述问题现象、复现步骤、影响用户量..." style={{...inp,resize:'none'}}/>
            </Inp>
            <Inp label="标签（逗号分隔）"><input value={f.tags} onChange={e=>set('tags',e.target.value)} placeholder="例：固件, iOS, 批量" style={inp}/></Inp>
          </div>
        </div>

        {/* Right panel */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {/* Reporter sets deadline + priority */}
          <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 12px rgba(0,0,0,0.05)',border:'2px solid #4FA7A030'}}>
            <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontSize:16}}>📅</span> 提出者设定（必填）
            </div>
            <Inp label="预期完成时间" req>
              <input type="date" value={f.expectedDate} onChange={e=>set('expectedDate',e.target.value)} style={inp}/>
              <p style={{fontSize:10,color:'#94a3b8',marginTop:4}}>负责人需在此日期前完成，超期需申请延期</p>
            </Inp>
            <Inp label="优先级" req>
              <div style={{display:'flex',gap:8}}>
                {(['高','中','低'] as const).map(p=>{
                  const c = PRIORITY_COLORS[p];
                  return <button key={p} onClick={()=>set('priority',p)} style={{flex:1,padding:'9px 0',borderRadius:12,border:f.priority===p?`2px solid ${c}50`:'2px solid transparent',background:f.priority===p?`${c}20`:'#F8FAFC',color:f.priority===p?c:'#A0AEC0',fontWeight:700,fontSize:13,cursor:'pointer'}}>{p}</button>
                })}
              </div>
              {f.priority==='高' && <div style={{marginTop:8,background:'#FF6B6B10',borderRadius:10,padding:'6px 10px',fontSize:11,color:'#FF6B6B',display:'flex',alignItems:'center',gap:5}}><AlertCircle size={12}/>高优先级将自动发企微通知</div>}
            </Inp>
          </div>

          {/* Source + Country */}
          <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
            <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:12}}>来源 & 地区</div>
            <Inp label="问题来源" req>
              {(['APP工单','邮件','运营反馈'] as const).map(s=>(
                <button key={s} onClick={()=>set('source',s)} style={{display:'flex',alignItems:'center',gap:8,width:'100%',marginBottom:6,padding:'8px 12px',borderRadius:10,border:f.source===s?`1.5px solid ${SOURCE_COLORS[s]}50`:'1.5px solid transparent',background:f.source===s?`${SOURCE_COLORS[s]}12`:'#F8FAFC',color:f.source===s?SOURCE_COLORS[s]:'#64748b',fontWeight:f.source===s?700:400,fontSize:12,cursor:'pointer',textAlign:'left'}}>
                  <span style={{width:8,height:8,borderRadius:99,background:SOURCE_COLORS[s],flexShrink:0,display:'inline-block'}}/>
                  {s}
                </button>
              ))}
            </Inp>
            <Inp label="国家/地区" req>
              <select value={f.country} onChange={e=>set('country',e.target.value)} style={sel}><option value="">选择国家...</option>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select>
            </Inp>
          </div>

          {/* Assign */}
          <div style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'}}>
            <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:10}}>指派负责人</div>
            {TEAM_MEMBERS.map(m=>(
              <button key={m.name} onClick={()=>set('owner',m.name)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',marginBottom:6,padding:'8px 12px',borderRadius:12,border:f.owner===m.name?'1.5px solid #4FA7A050':'1.5px solid transparent',background:f.owner===m.name?'#4FA7A010':'#F8FAFC',cursor:'pointer',textAlign:'left'}}>
                <div style={{width:28,height:28,borderRadius:99,background:m.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',flexShrink:0}}>{m.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:f.owner===m.name?'#4FA7A0':'#1a2035'}}>{m.name}</div>
                  <div style={{fontSize:10,color:'#94a3b8'}}>{m.email}</div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={()=>{if(!f.title||!f.expectedDate){alert('请填写标题和预期完成时间');return;}alert(`问题已提交！将通知负责人 ${f.owner} 并发送${f.priority==='高'?'企微+':''}邮件提醒`);nav('/issues');}} style={{background:'linear-gradient(135deg,#4FA7A0,#3a8f89)',color:'#fff',border:'none',borderRadius:14,padding:'13px 0',fontSize:14,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 16px rgba(79,167,160,0.35)'}}>
            <Send size={15}/>提交问题
          </button>
          <button onClick={()=>nav(-1)} style={{background:'#F0F4F8',color:'#64748b',border:'none',borderRadius:14,padding:'11px 0',fontSize:13,fontWeight:500,cursor:'pointer'}}>取消</button>
        </div>
      </div>
    </div>
  );
}
