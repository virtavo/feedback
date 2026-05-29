import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Plus } from 'lucide-react';
import { MOCK_ISSUES, type IssueStatus } from '@/data';

const COLUMNS: { status: IssueStatus; color: string; bg: string }[] = [
  { status: '待处理', color: '#FF9F43', bg: '#FF9F4310' },
  { status: '处理中', color: '#4FA7A0', bg: '#4FA7A010' },
  { status: '待确认', color: '#6C63FF', bg: '#6C63FF10' },
  { status: '已解决', color: '#22c55e', bg: '#22c55e10' },
  { status: '搁置中', color: '#FF6B6B', bg: '#FF6B6B10' },
  { status: '已关闭', color: '#A0AEC0', bg: '#A0AEC010' },
];
const sourceColors: Record<string, string> = { 'APP工单': '#4FA7A0', '邮件': '#6C63FF', '运营反馈': '#FF9F43' };
const priorityDot: Record<string, string> = { '高': '#FF6B6B', '中': '#FF9F43', '低': '#A0AEC0' };

export default function Kanban() {
  const navigate = useNavigate();
  const [dragId, setDragId] = useState<string | null>(null);
  const [issueStatuses, setIssueStatuses] = useState<Record<string, IssueStatus>>({});

  const getStatus = (id: string, orig: IssueStatus): IssueStatus => issueStatuses[id] ?? orig;

  const handleDrop = (e: React.DragEvent, status: IssueStatus) => {
    e.preventDefault();
    if (dragId) setIssueStatuses(prev => ({ ...prev, [dragId]: status }));
    setDragId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a2035' }}>看板视图</h1>
          <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>拖拽卡片可更改状态 · 共 {MOCK_ISSUES.length} 条问题</p>
        </div>
        <button onClick={() => navigate('/new')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#4FA7A0 0%,#3a8f89 100%)' }}>
          + 新建问题
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {COLUMNS.map(col => {
          const colIssues = MOCK_ISSUES.filter(i => getStatus(i.id, i.status) === col.status);
          return (
            <div
              key={col.status}
              className="flex-shrink-0 rounded-2xl flex flex-col"
              style={{ width: 260, background: col.bg, minHeight: 400 }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, col.status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${col.color}20` }}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm font-semibold" style={{ color: col.color }}>{col.status}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: col.color, color: '#fff' }}>{colIssues.length}</span>
                </div>
                <button className="p-1 rounded-lg hover:bg-white/50 transition-all">
                  <Plus size={14} style={{ color: col.color }} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {colIssues.map(issue => (
                  <div
                    key={issue.id}
                    draggable
                    onDragStart={() => setDragId(issue.id)}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    className="bg-white rounded-xl p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                    style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)', borderLeft: `3px solid ${issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#D1E83E'}` }}
                  >
                    {/* Top Row */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-semibold" style={{ color: '#A0AEC0' }}>{issue.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: priorityDot[issue.priority] }} title={`优先级: ${issue.priority}`} />
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: issue.brand === 'VIRTAVO' ? '#4FA7A018' : '#D1E83E25', color: issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00' }}>
                          {issue.brand}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-[12px] font-semibold mb-2 leading-tight" style={{ color: '#1a2035' }}>{issue.title}</div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: '#F0F4F8', color: '#64748b' }}>{issue.product}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: '#F0F4F8', color: '#64748b' }}>{issue.country}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: `${sourceColors[issue.source]}15`, color: sourceColors[issue.source] }}>{issue.source}</span>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: '#4FA7A0' }}>{issue.ownerAvatar}</div>
                        <span className="text-[11px]" style={{ color: '#64748b' }}>{issue.owner}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px]" style={{ color: '#A0AEC0' }}>{issue.updatedAt}</span>
                        <button
                          title="催进度"
                          onClick={e => { e.stopPropagation(); alert(`已催办 ${issue.owner}`); }}
                          className="p-1 rounded-lg hover:bg-yellow-50 transition-all"
                          style={{ color: '#FF9F43' }}
                        >
                          <Zap size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {colIssues.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 opacity-40">
                    <div className="w-8 h-8 rounded-full mb-2" style={{ background: `${col.color}20` }} />
                    <span className="text-xs" style={{ color: col.color }}>暂无问题</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
