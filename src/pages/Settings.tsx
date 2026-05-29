import { useState } from 'react';
import { Users, Tag, Bell, Shield, Plus, Trash2, Save } from 'lucide-react';
import { TEAM_MEMBERS, CATEGORIES } from '@/data';

const TAB_ITEMS = [
  { id: 'team', icon: Users, label: '人员管理' },
  { id: 'category', icon: Tag, label: '分类管理' },
  { id: 'notify', icon: Bell, label: '通知设置' },
  { id: 'brand', icon: Shield, label: '品牌配置' },
];

export default function Settings() {
  const [tab, setTab] = useState('team');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>系统设置</h1>
        <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>管理人员、分类、通知与品牌配置</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', height: 'fit-content' }}>
          {TAB_ITEMS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-all"
              style={{ background: tab === id ? '#4FA7A015' : 'transparent', color: tab === id ? '#4FA7A0' : '#64748b', fontWeight: tab === id ? 600 : 400 }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-3">
          {tab === 'team' && (
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="font-bold text-base" style={{ color: '#1a2035' }}>团队成员</div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)' }}>
                  <Plus size={13} />添加成员
                </button>
              </div>
              <div className="space-y-3">
                {[...TEAM_MEMBERS, { name: '赵敏', avatar: 'ZM', color: '#22c55e' }, { name: '孙鹏', avatar: 'SP', color: '#6C63FF' }].map((m, idx) => (
                  <div key={m.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #e2e8f0' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: m.color }}>{m.avatar}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: '#1a2035' }}>{m.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#A0AEC0' }}>
                        {['售后主管', '产品经理', '固件工程师', '客服专员', '运营专员', '测试工程师', '品质专员'][idx % 7]}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {['VIRTAVO', 'ShowMo'][idx % 2] === 'VIRTAVO'
                        ? <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#4FA7A015', color: '#4FA7A0' }}>VIRTAVO</span>
                        : <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#D1E83E20', color: '#6b8c00' }}>ShowMo</span>}
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#22c55e15', color: '#22c55e' }}>在职</span>
                    </div>
                    <button className="p-2 rounded-lg transition-all hover:bg-red-50" style={{ color: '#A0AEC0' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'category' && (
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-5">
                <div className="font-bold text-base" style={{ color: '#1a2035' }}>问题分类管理</div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)' }}>
                  <Plus size={13} />添加分类
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat, idx) => (
                  <div key={cat} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: ['#4FA7A0','#6C63FF','#FF6B6B','#FF9F43','#22c55e','#A0AEC0','#4FA7A0','#6C63FF','#FF6B6B','#FF9F43','#22c55e','#A0AEC0'][idx % 12] }} />
                      <span className="text-sm font-medium" style={{ color: '#1a2035' }}>{cat}</span>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 transition-all" style={{ color: '#A0AEC0' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notify' && (
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div className="font-bold text-base mb-5" style={{ color: '#1a2035' }}>通知设置</div>
              <div className="space-y-4">
                {[
                  { label: '高优先级问题创建通知', sub: '新建高优先级问题时立即通知负责人', on: true },
                  { label: '超时未处理催办', sub: '超过48小时未更新自动发送催办通知', on: true },
                  { label: '状态变更通知', sub: '问题状态发生变更时通知相关人员', on: false },
                  { label: '周报自动发送', sub: '每周一09:00自动发送周报给管理员', on: true },
                  { label: '企业微信集成', sub: '通知同步推送至企业微信群', on: false },
                  { label: '钉钉集成', sub: '通知同步推送至钉钉群', on: false },
                ].map(({ label, sub, on }) => {
                  const [active, setActive] = useState(on);
                  return (
                    <div key={label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: '#1a2035' }}>{label}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#A0AEC0' }}>{sub}</div>
                      </div>
                      <button onClick={() => setActive(!active)}
                        className="relative w-12 h-6 rounded-full transition-all"
                        style={{ background: active ? '#4FA7A0' : '#E2E8F0' }}>
                        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: active ? '1.5rem' : '0.125rem' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#4FA7A0,#3a8f89)' }}>
                <Save size={14} />保存设置
              </button>
            </div>
          )}

          {tab === 'brand' && (
            <div className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <div className="font-bold text-base mb-5" style={{ color: '#1a2035' }}>品牌配置</div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: 'VIRTAVO', color: '#4FA7A0', bg: '#4FA7A010', products: ['酒壶机2K','酒壶机200ai','双目小蛋(EggSentry)','熊猫机'] },
                  { name: 'ShowMo', color: '#6b8c00', bg: '#D1E83E15', accentColor: '#D1E83E', products: ['MileHub Kit','WinEye','MileFlask MF.1','MileFlask MF.1.0'] },
                ].map(brand => (
                  <div key={brand.name} className="p-4 rounded-2xl" style={{ background: brand.bg, border: `2px solid ${brand.accentColor || brand.color}30` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: brand.accentColor || brand.color, color: brand.name === 'ShowMo' ? '#3d5200' : '#fff' }}>
                        {brand.name[0]}
                      </div>
                      <div>
                        <div className="font-bold" style={{ color: '#1a2035' }}>{brand.name}</div>
                        <div className="text-xs" style={{ color: '#A0AEC0' }}>{brand.products.length} 款产品</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {brand.products.map(p => (
                        <div key={p} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white text-xs" style={{ color: '#64748b' }}>
                          {p}
                          <span className="text-[11px] font-medium" style={{ color: brand.color }}>启用</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium" style={{ background: `${brand.accentColor || brand.color}20`, color: brand.color }}>
                      <Plus size={12} />添加产品
                    </button>
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
