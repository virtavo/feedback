import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { PRODUCTS, CATEGORIES, COUNTRIES, TEAM_MEMBERS } from '@/data';

export default function NewIssue() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState<'VIRTAVO' | 'ShowMo'>('VIRTAVO');
  const [form, setForm] = useState({ title: '', product: '', category: '', country: '', source: 'APP工单', priority: '中', owner: '李杰', description: '', tags: '' });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const LabelRow = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: '#1a2035' }}>
        {label}{required && <span style={{ color: '#FF6B6B' }}>*</span>}
      </label>
      {children}
    </div>
  );

  const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{ background: '#F8FAFC', border: '1.5px solid #e2e8f0', color: '#1a2035' }}
      onFocus={e => e.currentTarget.style.borderColor = '#4FA7A0'}
      onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
  );

  const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
      style={{ background: '#F8FAFC', border: '1.5px solid #e2e8f0', color: '#1a2035', appearance: 'none' }}>
      <option value="">请选择...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background: '#fff', color: '#64748b', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>新建问题</h1>
          <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>填写售后问题基本信息</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>基本信息</div>
            <div className="space-y-4">
              <LabelRow label="问题标题" required>
                <Input value={form.title} onChange={v => set('title', v)} placeholder="简明描述问题，例：酒壶机配网失败-iOS大量反馈" />
              </LabelRow>
              {/* Brand */}
              <LabelRow label="品牌" required>
                <div className="flex gap-3">
                  {(['VIRTAVO', 'ShowMo'] as const).map(b => (
                    <button key={b} onClick={() => setBrand(b)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ background: brand === b ? (b === 'VIRTAVO' ? '#4FA7A0' : '#D1E83E') : '#F8FAFC', color: brand === b ? (b === 'ShowMo' ? '#3d5200' : '#fff') : '#64748b', border: brand === b ? 'none' : '1.5px solid #e2e8f0' }}>
                      {b}
                    </button>
                  ))}
                </div>
              </LabelRow>
              <div className="grid grid-cols-2 gap-4">
                <LabelRow label="产品" required>
                  <Select value={form.product} onChange={v => set('product', v)} options={PRODUCTS[brand]} />
                </LabelRow>
                <LabelRow label="问题分类" required>
                  <Select value={form.category} onChange={v => set('category', v)} options={CATEGORIES} />
                </LabelRow>
              </div>
              <LabelRow label="问题描述" required>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="详细描述问题现象、复现步骤、影响用户量等..."
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{ background: '#F8FAFC', border: '1.5px solid #e2e8f0', color: '#1a2035' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4FA7A0'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </LabelRow>
              <LabelRow label="标签（逗号分隔）">
                <Input value={form.tags} onChange={v => set('tags', v)} placeholder="例：固件, iOS, 批量, 高频" />
              </LabelRow>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Classification */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>分类与来源</div>
            <div className="space-y-3">
              <LabelRow label="问题来源" required>
                <div className="flex flex-col gap-2">
                  {(['APP工单', '邮件', '运营反馈'] as const).map(s => {
                    const colors: Record<string, string> = { 'APP工单': '#4FA7A0', '邮件': '#6C63FF', '运营反馈': '#FF9F43' };
                    return (
                      <button key={s} onClick={() => set('source', s)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ background: form.source === s ? `${colors[s]}15` : '#F8FAFC', color: form.source === s ? colors[s] : '#64748b', border: form.source === s ? `1.5px solid ${colors[s]}50` : '1.5px solid transparent' }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: colors[s] }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </LabelRow>
              <LabelRow label="国家/地区" required>
                <Select value={form.country} onChange={v => set('country', v)} options={COUNTRIES} />
              </LabelRow>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-4" style={{ color: '#1a2035' }}>优先级与负责人</div>
            <div className="space-y-3">
              <LabelRow label="优先级">
                <div className="flex gap-2">
                  {(['高', '中', '低'] as const).map(p => {
                    const c = p === '高' ? '#FF6B6B' : p === '中' ? '#FF9F43' : '#A0AEC0';
                    return (
                      <button key={p} onClick={() => set('priority', p)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={{ background: form.priority === p ? `${c}20` : '#F8FAFC', color: form.priority === p ? c : '#A0AEC0', border: form.priority === p ? `2px solid ${c}50` : '2px solid transparent' }}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </LabelRow>
              <LabelRow label="负责人">
                <div className="space-y-2">
                  {TEAM_MEMBERS.map(m => (
                    <button key={m.name} onClick={() => set('owner', m.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
                      style={{ background: form.owner === m.name ? '#4FA7A015' : '#F8FAFC', border: form.owner === m.name ? '1.5px solid #4FA7A050' : '1.5px solid transparent' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: m.color }}>{m.avatar}</div>
                      <span className="font-medium" style={{ color: form.owner === m.name ? '#4FA7A0' : '#64748b' }}>{m.name}</span>
                    </button>
                  ))}
                </div>
              </LabelRow>
            </div>
          </div>

          {/* Submit */}
          <button onClick={() => { alert('问题已提交！'); navigate('/issues'); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#4FA7A0 0%,#3a8f89 100%)', boxShadow: '0 4px 16px rgba(79,167,160,0.35)' }}>
            <Save size={15} />提交问题
          </button>
          <button onClick={() => navigate(-1)}
            className="w-full py-2.5 rounded-xl text-sm font-medium"
            style={{ background: '#F0F4F8', color: '#64748b' }}>
            取消
          </button>

          {/* Tips */}
          <div className="flex gap-2 p-3 rounded-xl" style={{ background: '#FF9F4310' }}>
            <AlertCircle size={14} style={{ color: '#FF9F43', flexShrink: 0, marginTop: 1 }} />
            <p className="text-[11px]" style={{ color: '#FF9F43' }}>高优先级问题将自动发送通知给负责人，并在48小时内进行首次跟进。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
