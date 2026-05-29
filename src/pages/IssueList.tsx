import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Zap, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MOCK_ISSUES, type Brand, type IssueSource, type IssueStatus, type Priority } from '@/data';

const statusColors: Record<string, { bg: string; text: string }> = {
  '待处理': { bg: '#FF9F4318', text: '#FF9F43' },
  '处理中': { bg: '#4FA7A018', text: '#4FA7A0' },
  '待确认': { bg: '#6C63FF18', text: '#6C63FF' },
  '已解决': { bg: '#22c55e18', text: '#22c55e' },
  '已关闭': { bg: '#A0AEC018', text: '#A0AEC0' },
  '搁置中': { bg: '#FF6B6B18', text: '#FF6B6B' },
};
const priorityColors: Record<string, { bg: string; text: string }> = {
  '高': { bg: '#FF6B6B18', text: '#FF6B6B' },
  '中': { bg: '#FF9F4318', text: '#FF9F43' },
  '低': { bg: '#A0AEC018', text: '#A0AEC0' },
};
const sourceColors: Record<string, { bg: string; text: string }> = {
  'APP工单': { bg: '#4FA7A018', text: '#4FA7A0' },
  '邮件': { bg: '#6C63FF18', text: '#6C63FF' },
  '运营反馈': { bg: '#FF9F4318', text: '#FF9F43' },
};

type SelectFilter = { brand: string; status: string; source: string; priority: string; country: string; };

export default function IssueList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<SelectFilter>({ brand: '', status: '', source: '', priority: '', country: '' });

  const filtered = MOCK_ISSUES.filter(issue => {
    const q = search.toLowerCase();
    const matchSearch = !q || issue.title.toLowerCase().includes(q) || issue.id.toLowerCase().includes(q) || issue.product.toLowerCase().includes(q);
    const matchBrand = !filters.brand || issue.brand === filters.brand;
    const matchStatus = !filters.status || issue.status === filters.status;
    const matchSource = !filters.source || issue.source === filters.source;
    const matchPriority = !filters.priority || issue.priority === filters.priority;
    const matchCountry = !filters.country || issue.country === filters.country;
    return matchSearch && matchBrand && matchStatus && matchSource && matchPriority && matchCountry;
  });

  const SelectBox = ({ value, options, placeholder, key2 }: { value: string; options: string[]; placeholder: string; key2: keyof SelectFilter }) => (
    <div className="relative">
      <select
        value={value}
        onChange={e => setFilters(f => ({ ...f, [key2]: e.target.value }))}
        className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer"
        style={{ background: value ? '#4FA7A015' : '#F0F4F8', color: value ? '#4FA7A0' : '#64748b', border: value ? '1px solid #4FA7A040' : '1px solid transparent' }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A0AEC0' }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>问题列表</h1>
          <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>共 {filtered.length} 条问题</p>
        </div>
        <button onClick={() => navigate('/new')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#4FA7A0 0%,#3a8f89 100%)' }}>
          + 新建问题
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-xl" style={{ background: '#F0F4F8' }}>
            <Search size={14} style={{ color: '#A0AEC0' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a2035' }} placeholder="搜索问题标题、编号、产品..." />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SelectBox value={filters.brand} options={['VIRTAVO', 'ShowMo']} placeholder="全部品牌" key2="brand" />
            <SelectBox value={filters.status} options={['待处理', '处理中', '待确认', '已解决', '已关闭', '搁置中']} placeholder="全部状态" key2="status" />
            <SelectBox value={filters.source} options={['APP工单', '邮件', '运营反馈']} placeholder="全部来源" key2="source" />
            <SelectBox value={filters.priority} options={['高', '中', '低']} placeholder="全部优先级" key2="priority" />
            <SelectBox value={filters.country} options={['US', 'GB', 'IT', 'DE', 'JP', 'FR', 'CA', 'AU']} placeholder="全部国家" key2="country" />
            {Object.values(filters).some(Boolean) && (
              <button onClick={() => setFilters({ brand: '', status: '', source: '', priority: '', country: '' })} className="px-3 py-2 rounded-xl text-xs" style={{ color: '#FF6B6B', background: '#FF6B6B10' }}>清除筛选</button>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs ml-auto" style={{ background: '#F0F4F8', color: '#64748b' }}>
            <Download size={13} />导出
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #e2e8f0' }}>
              {['编号', '标题', '品牌', '产品', '来源', '国家', '分类', '负责人', '优先级', '状态', '创建时间', '操作'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((issue, idx) => (
              <tr key={issue.id} className="cursor-pointer transition-all hover:bg-slate-50" style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f0f4f8' : 'none' }}
                onClick={() => navigate(`/issues/${issue.id}`)}>
                <td className="px-4 py-3 text-[11px] font-mono font-semibold" style={{ color: '#4FA7A0' }}>{issue.id}</td>
                <td className="px-4 py-3 max-w-[200px]">
                  <div className="text-xs font-semibold truncate" style={{ color: '#1a2035' }}>{issue.title}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {issue.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: '#F0F4F8', color: '#64748b' }}>{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: issue.brand === 'VIRTAVO' ? '#4FA7A018' : '#D1E83E20', color: issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00' }}>{issue.brand}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{issue.product}</td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: sourceColors[issue.source].bg, color: sourceColors[issue.source].text }}>{issue.source}</span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#1a2035' }}>{issue.country}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{issue.category}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#4FA7A0' }}>{issue.ownerAvatar}</div>
                    <span className="text-xs" style={{ color: '#64748b' }}>{issue.owner}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ background: priorityColors[issue.priority].bg, color: priorityColors[issue.priority].text }}>{issue.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-1 rounded-full font-medium" style={{ background: statusColors[issue.status].bg, color: statusColors[issue.status].text }}>{issue.status}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#A0AEC0', whiteSpace: 'nowrap' }}>{issue.createdAt}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg transition-all hover:bg-yellow-50" style={{ color: '#FF9F43' }} title="催进度" onClick={e => { e.stopPropagation(); alert(`已催办 ${issue.owner}：${issue.id}`); }}>
                      <Zap size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: '#A0AEC0' }}>
            <Filter size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">没有符合条件的问题</p>
          </div>
        )}
      </div>
    </div>
  );
}
