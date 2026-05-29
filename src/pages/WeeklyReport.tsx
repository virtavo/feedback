import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { MOCK_ISSUES, WEEKLY_STATS, STATUS_COLORS, SOURCE_COLORS, getOverdueDays } from '@/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const WEEKS = ['5.7-5.13','4.30-5.6','4.23-4.29','4.16-4.22','4.9-4.15','4.2-4.8'];

export default function WeeklyReport() {
  const [wi, setWi] = useState(0);
  const cur = WEEKLY_STATS[WEEKLY_STATS.length-1-wi];
  const prev = WEEKLY_STATS[WEEKLY_STATS.length-2-wi];
  const wIssues = MOCK_ISSUES.slice(0, Math.max(4, 12-wi*2));
  const solveRate = Math.round((cur.solved/cur.total)*100);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:'#1a2035',margin:0}}>周报视图</h1><p style={{fontSize:12,color:'#94a3b8',marginTop:4}}>按周维度汇总售后问题数据</p></div>
        <div style={{display:'flex',alignItems:'center',gap:6,background:'#fff',borderRadius:14,padding:'6px 10px',boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
          <button onClick={()=>setWi(Math.min(wi+1,WEEKS.length-1))} disabled={wi>=WEEKS.length-1} style={{background:'none',border:'none',cursor:'pointer',padding:6,borderRadius:8,opacity:wi>=WEEKS.length-1?0.3:1}}><ChevronLeft size={15} color="#64748b"/></button>
          <span style={{fontSize:13,fontWeight:700,color:'#1a2035',padding:'0 8px'}}>第{WEEKS.length-wi}周 ({WEEKS[wi]})</span>
          <button onClick={()=>setWi(Math.max(wi-1,0))} disabled={wi<=0} style={{background:'none',border:'none',cursor:'pointer',padding:6,borderRadius:8,opacity:wi<=0?0.3:1}}><ChevronRight size={15} color="#64748b"/></button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[{l:'本周总问题',v:cur.total,c:'#4FA7A0'},{l:'本周已解决',v:cur.solved,sub:`解决率 ${solveRate}%`,c:'#22c55e'},{l:'VIRTAVO',v:cur.virtavo,c:'#4FA7A0'},{l:'ShowMo',v:cur.showmo,c:'#6b8c00'}].map(({l,v,c,sub})=>(
          <div key={l} style={{background:'#fff',borderRadius:16,padding:16,boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:26,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:12,fontWeight:600,color:'#1a2035',marginTop:4}}>{l}</div>
            {sub && <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{sub}</div>}
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:16}}>
        <div style={{background:'#fff',borderRadius:16,padding:18,boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
          <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:12}}>近6周趋势</div>
          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={WEEKLY_STATS}><CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8"/>
              <XAxis dataKey="week" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:12,border:'none',fontSize:12}}/>
              <Line type="monotone" dataKey="total" stroke="#4FA7A0" strokeWidth={2.5} dot={{r:4,fill:'#4FA7A0'}} name="总量"/>
              <Line type="monotone" dataKey="solved" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 3" dot={{r:3,fill:'#22c55e'}} name="已解决"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:'#fff',borderRadius:16,padding:18,boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
          <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:12}}>本周来源分布</div>
          {[{n:'APP工单',v:68,c:'#4FA7A0'},{n:'邮件',v:19,c:'#6C63FF'},{n:'运营反馈',v:13,c:'#FF9F43'}].map(s=>(
            <div key={s.n} style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:4}}><span style={{color:'#64748b'}}>{s.n}</span><span style={{fontWeight:700,color:'#1a2035'}}>{s.v}%</span></div>
              <div style={{height:7,borderRadius:99,background:'#f1f5f9'}}><div style={{height:7,borderRadius:99,background:s.c,width:`${s.v}%`}}/></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 10px rgba(0,0,0,0.05)'}}>
        <div style={{padding:'14px 18px',borderBottom:'1px solid #f1f5f9',fontWeight:700,fontSize:13,color:'#1a2035'}}>本周问题清单</div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr style={{background:'#F8FAFC',borderBottom:'1px solid #e2e8f0'}}>
            {['编号','标题','品牌','来源','状态','负责人','进度','预期/预估','延期状态'].map(h=>(
              <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:700,color:'#64748b',whiteSpace:'nowrap'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{wIssues.map((issue,idx)=>{
            const sc = STATUS_COLORS[issue.status];
            const od = getOverdueDays(issue);
            const progColor = issue.progress===100?'#22c55e':issue.progress>=60?'#4FA7A0':'#FF9F43';
            return (
              <tr key={issue.id} style={{borderBottom:idx<wIssues.length-1?'1px solid #f1f5f9':'none'}}>
                <td style={{padding:'10px 14px',fontFamily:'monospace',fontSize:11,fontWeight:700,color:'#4FA7A0'}}>{issue.id}</td>
                <td style={{padding:'10px 14px',fontSize:12,fontWeight:600,color:'#1a2035',maxWidth:180}}><div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{issue.title}</div></td>
                <td style={{padding:'10px 14px'}}><span style={{background:issue.brand==='VIRTAVO'?'#4FA7A018':'#D1E83E20',color:issue.brand==='VIRTAVO'?'#4FA7A0':'#6b8c00',borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:700}}>{issue.brand}</span></td>
                <td style={{padding:'10px 14px'}}><span style={{background:SOURCE_COLORS[issue.source]+'18',color:SOURCE_COLORS[issue.source],borderRadius:20,padding:'2px 8px',fontSize:11}}>{issue.source}</span></td>
                <td style={{padding:'10px 14px'}}><span style={{background:sc.bg,color:sc.text,borderRadius:20,padding:'2px 8px',fontSize:11,fontWeight:600}}>{issue.status}</span></td>
                <td style={{padding:'10px 14px',fontSize:12,color:'#64748b'}}>{issue.owner}</td>
                <td style={{padding:'10px 14px'}}>
                  <div style={{width:70}}>
                    <div style={{fontSize:10,fontWeight:700,color:progColor,marginBottom:3}}>{issue.progress}%</div>
                    <div style={{height:5,borderRadius:99,background:'#f1f5f9'}}><div style={{height:5,borderRadius:99,background:progColor,width:`${issue.progress}%`}}/></div>
                  </div>
                </td>
                <td style={{padding:'10px 14px',whiteSpace:'nowrap'}}>
                  <div style={{fontSize:11,color:'#94a3b8'}}>期望 {issue.expectedDate}</div>
                  {issue.estimatedDate&&<div style={{fontSize:11,color:'#4FA7A0'}}>预估 {issue.estimatedDate}</div>}
                </td>
                <td style={{padding:'10px 14px'}}>
                  {od>0&&!issue.delayRequest&&<span style={{background:'#FF6B6B18',color:'#FF6B6B',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',gap:3}}><AlertTriangle size={10}/>逾期{od}天</span>}
                  {issue.delayRequest?.status==='pending'&&<span style={{background:'#FF9F4320',color:'#FF9F43',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:700}}>延期申请中</span>}
                  {issue.delayRequest?.status==='approved'&&<span style={{background:'#22c55e18',color:'#22c55e',borderRadius:20,padding:'2px 8px',fontSize:10,fontWeight:700}}>延期已批</span>}
                  {!od&&!issue.delayRequest&&<span style={{fontSize:10,color:'#94a3b8'}}>正常</span>}
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}
