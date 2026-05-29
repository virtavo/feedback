import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RESOLUTION_TIME, CATEGORY_STATS, MOCK_ISSUES, getOverdueDays } from '@/data';
import { Trophy, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const PRODUCT_TREND = [
  { week: '4.2', 酒壶机: 38, 双目小蛋: 28, 熊猫机: 6, ShowMo: 10 },
  { week: '4.9', 酒壶机: 42, 双目小蛋: 32, 熊猫机: 8, ShowMo: 9 },
  { week: '4.16', 酒壶机: 35, 双目小蛋: 25, 熊猫机: 8, ShowMo: 10 },
  { week: '4.23', 酒壶机: 45, 双目小蛋: 34, 熊猫机: 9, ShowMo: 7 },
  { week: '4.30', 酒壶机: 52, 双目小蛋: 39, 熊猫机: 11, ShowMo: 8 },
  { week: '5.7',  酒壶机: 44, 双目小蛋: 36, 熊猫机: 10, ShowMo: 8 },
];
const COUNTRY_DATA = [
  { c:'US', total:312, solved:248, avg:3.1 },
  { c:'GB', total:124, solved:98,  avg:2.8 },
  { c:'IT', total:98,  solved:76,  avg:3.6 },
  { c:'DE', total:67,  solved:52,  avg:4.1 },
  { c:'JP', total:54,  solved:48,  avg:2.4 },
  { c:'FR', total:42,  solved:31,  avg:3.9 },
];

const avgProgress = Math.round(MOCK_ISSUES.reduce((s,i)=>s+i.progress,0)/MOCK_ISSUES.length);
const overdueCount = MOCK_ISSUES.filter(i=>getOverdueDays(i)>0&&!i.delayRequest?.status?.match(/approved/)).length;

export default function Analytics() {
  const card = {background:'#fff',borderRadius:16,padding:18,boxShadow:'0 2px 12px rgba(0,0,0,0.05)'};
  return (
    <div>
      <div style={{marginBottom:20}}><h1 style={{fontSize:22,fontWeight:700,color:'#1a2035',margin:0}}>数据统计</h1><p style={{fontSize:12,color:'#94a3b8',marginTop:4}}>处理时效 · 进度总览 · 延期分析 · 负责人绩效</p></div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:16}}>
        {[{l:'平均解决时长',v:'3.2天',c:'#4FA7A0',icon:Clock},{l:'平均进度',v:`${avgProgress}%`,c:'#6C63FF',icon:TrendingUp},{l:'最快负责人',v:'刘洋 2.5天',c:'#22c55e',icon:Trophy},{l:'无申请逾期数',v:overdueCount,c:'#FF6B6B',icon:AlertTriangle}].map(({l,v,c,icon:Icon})=>(
          <div key={l} style={card}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <div style={{width:38,height:38,borderRadius:12,background:`${c}15`,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={18} color={c}/></div>
              <div><div style={{fontSize:20,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{l}</div></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Distribution */}
      <div style={{...card,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:14}}>各问题进度总览</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {MOCK_ISSUES.filter(i=>!['已关闭'].includes(i.status)).slice(0,8).map(issue=>{
            const c = issue.progress===100?'#22c55e':issue.progress>=60?'#4FA7A0':issue.progress>=30?'#FF9F43':'#FF6B6B';
            const od = getOverdueDays(issue);
            return (
              <div key={issue.id} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontFamily:'monospace',fontSize:10,color:'#4FA7A0',fontWeight:700,width:60,flexShrink:0}}>{issue.id}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:'#1a2035',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:3}}>{issue.title}</div>
                  <div style={{height:8,borderRadius:99,background:'#f1f5f9'}}>
                    <div style={{height:8,borderRadius:99,background:c,width:`${issue.progress}%`,transition:'width 0.5s'}}/>
                  </div>
                </div>
                <span style={{fontSize:11,fontWeight:800,color:c,width:36,textAlign:'right'}}>{issue.progress}%</span>
                <span style={{fontSize:11,color:'#94a3b8',width:60,flexShrink:0}}>{issue.owner}</span>
                {od>0&&!issue.delayRequest&&<span style={{fontSize:10,background:'#FF6B6B18',color:'#FF6B6B',borderRadius:20,padding:'1px 6px',fontWeight:700,flexShrink:0,display:'flex',alignItems:'center',gap:2}}><AlertTriangle size={9}/>逾{od}天</span>}
                {issue.delayRequest?.status==='pending'&&<span style={{fontSize:10,background:'#FF9F4318',color:'#FF9F43',borderRadius:20,padding:'1px 6px',fontWeight:700,flexShrink:0}}>申请中</span>}
                {issue.delayRequest?.status==='approved'&&<span style={{fontSize:10,background:'#22c55e18',color:'#22c55e',borderRadius:20,padding:'1px 6px',fontWeight:700,flexShrink:0}}>已延期</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
        <div style={card}>
          <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:14}}>负责人效率排名</div>
          {RESOLUTION_TIME.sort((a,b)=>a.avg-b.avg).map((r,idx)=>{
            const colors=['#4FA7A0','#22c55e','#6C63FF','#FF9F43','#FF6B6B'];
            return (
              <div key={r.owner} style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
                <span style={{fontSize:14,width:24}}>{['🥇','🥈','🥉','4','5'][idx]}</span>
                <div style={{width:28,height:28,borderRadius:99,background:colors[idx],display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff'}}>{r.owner[0]}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}>
                    <span style={{fontWeight:600,color:'#1a2035'}}>{r.owner}</span>
                    <span style={{color:'#64748b'}}>均{r.avg}天 · {r.solved}件</span>
                  </div>
                  <div style={{height:6,borderRadius:99,background:'#f1f5f9'}}>
                    <div style={{height:6,borderRadius:99,background:colors[idx],width:`${(1-(r.avg-2)/3)*100}%`}}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={card}>
          <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:12}}>产品分类趋势（近6周）</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PRODUCT_TREND} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8"/>
              <XAxis dataKey="week" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:12,border:'none',fontSize:11}}/>
              <Bar dataKey="酒壶机" fill="#4FA7A0" radius={[4,4,0,0]}/>
              <Bar dataKey="双目小蛋" fill="#6C63FF" radius={[4,4,0,0]}/>
              <Bar dataKey="熊猫机" fill="#FF9F43" radius={[4,4,0,0]}/>
              <Bar dataKey="ShowMo" fill="#D1E83E" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:14}}>
        <div style={card}>
          <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:10}}>分类分布</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart><Pie data={CATEGORY_STATS} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
              {CATEGORY_STATS.map((e,i)=><Cell key={i} fill={e.fill}/>)}
            </Pie><Tooltip contentStyle={{borderRadius:12,border:'none',fontSize:11}}/></PieChart>
          </ResponsiveContainer>
          {CATEGORY_STATS.map(c=>(
            <div key={c.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
              <span style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#64748b'}}><span style={{width:7,height:7,borderRadius:99,background:c.fill,display:'inline-block'}}/>{c.name}</span>
              <span style={{fontSize:11,fontWeight:700,color:'#1a2035'}}>{c.value}%</span>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{fontWeight:700,fontSize:13,color:'#1a2035',marginBottom:12}}>各国问题统计</div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid #f1f5f9'}}>
              {['国家','总数','已解决','解决率','均处理时长','趋势'].map(h=>(
                <th key={h} style={{paddingBottom:8,textAlign:'left',fontSize:11,fontWeight:700,color:'#64748b'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{COUNTRY_DATA.map((row,idx)=>{
              const rate = Math.round((row.solved/row.total)*100);
              return (
                <tr key={row.c} style={{borderBottom:idx<COUNTRY_DATA.length-1?'1px solid #f8fafc':'none'}}>
                  <td style={{padding:'10px 0',fontSize:13,fontWeight:700,color:'#1a2035'}}>{row.c}</td>
                  <td style={{padding:'10px 0',fontSize:12,color:'#64748b'}}>{row.total}</td>
                  <td style={{padding:'10px 0',fontSize:12,color:'#22c55e',fontWeight:700}}>{row.solved}</td>
                  <td style={{padding:'10px 0'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{height:5,borderRadius:99,background:'#f1f5f9',width:60}}><div style={{height:5,borderRadius:99,background:rate>80?'#22c55e':rate>60?'#4FA7A0':'#FF9F43',width:`${rate}%`}}/></div>
                      <span style={{fontSize:11,fontWeight:700,color:rate>80?'#22c55e':'#FF9F43'}}>{rate}%</span>
                    </div>
                  </td>
                  <td style={{padding:'10px 0',fontSize:12,fontWeight:700,color:row.avg>3.5?'#FF6B6B':'#4FA7A0'}}>{row.avg}天</td>
                  <td style={{padding:'10px 0'}}>
                    <div style={{display:'flex',gap:2,alignItems:'flex-end',height:16}}>
                      {[3,5,4,6,4,5].map((h,i)=><div key={i} style={{width:6,borderRadius:2,background:i===5?'#4FA7A0':'#e2e8f0',height:h*2.5}}/>)}
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
