import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Clock, CheckCircle2, User, Globe, Tag, MessageSquare, Paperclip } from 'lucide-react';
import { MOCK_ISSUES } from '@/data';

const statusColors: Record<string, { bg: string; text: string }> = {
  '待处理': { bg: '#FF9F4318', text: '#FF9F43' }, '处理中': { bg: '#4FA7A018', text: '#4FA7A0' },
  '待确认': { bg: '#6C63FF18', text: '#6C63FF' }, '已解决': { bg: '#22c55e18', text: '#22c55e' },
  '已关闭': { bg: '#A0AEC018', text: '#A0AEC0' }, '搁置中': { bg: '#FF6B6B18', text: '#FF6B6B' },
};
const sourceColors: Record<string, string> = { 'APP工单': '#4FA7A0', '邮件': '#6C63FF', '运营反馈': '#FF9F43' };
const priorityColors: Record<string, string> = { '高': '#FF6B6B', '中': '#FF9F43', '低': '#A0AEC0' };

const TIMELINE = [
  { time: '2026-05-01 09:12', actor: '李杰', action: '创建问题', note: '收到大量用户反馈，初步归类为固件问题', color: '#4FA7A0' },
  { time: '2026-05-03 14:30', actor: '王芳', action: '状态变更', note: '待处理 → 处理中，已将问题同步给固件组', color: '#6C63FF' },
  { time: '2026-05-06 10:00', actor: '张伟', action: '添加备注', note: '固件组已收到，预计本周内提供修复方案', color: '#FF9F43' },
  { time: '2026-05-09 16:20', actor: '李杰', action: '催进度 ⚡', note: '距上次更新已超3天，已向固件组发送催办通知', color: '#FF6B6B' },
  { time: '2026-05-10 11:05', actor: '张伟', action: '上传附件', note: '上传了固件测试报告 V5.20.40.01_fix.pdf', color: '#22c55e' },
];

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const issue = MOCK_ISSUES.find(i => i.id === id) || MOCK_ISSUES[0];
  const sc = statusColors[issue.status] || statusColors['处理中'];
  const daysOpen = Math.ceil((new Date().getTime() - new Date(issue.createdAt).getTime()) / (1000 * 3600 * 24));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl transition-all" style={{ background: '#fff', color: '#64748b', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1a2035' }}>{issue.title}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#A0AEC0' }}>{issue.id} · 已开启 {daysOpen} 天</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left: Main Info */}
        <div className="col-span-2 space-y-4">
          {/* Status Bar */}
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            {(['待处理','处理中','待确认','已解决','已关闭'] as const).map((s, i) => {
              const statuses = ['待处理','处理中','待确认','已解决','已关闭'];
              const curIdx = statuses.indexOf(issue.status);
              const isActive = issue.status === s;
              const isPast = statuses.indexOf(s) < curIdx;
              const sc2 = statusColors[s];
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{ background: isActive ? sc2.text : isPast ? '#22c55e' : '#F0F4F8', color: isActive || isPast ? '#fff' : '#A0AEC0' }}>
                      {isPast ? <CheckCircle2 size={14} /> : i + 1}
                    </div>
                    <span className="text-[10px] mt-1 font-medium" style={{ color: isActive ? sc2.text : isPast ? '#22c55e' : '#A0AEC0' }}>{s}</span>
                  </div>
                  {i < 4 && <div className="flex-1 h-0.5 rounded-full" style={{ background: isPast ? '#22c55e' : '#F0F4F8', minWidth: 20 }} />}
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-3" style={{ color: '#1a2035' }}>问题描述</div>
            <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{issue.description}</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {issue.tags.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#F0F4F8', color: '#64748b' }}>#{t}</span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-sm" style={{ color: '#1a2035' }}>跟进记录 Timeline</div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: '#FF9F4315', color: '#FF9F43' }}>
                  <Zap size={12} />催进度
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: '#4FA7A015', color: '#4FA7A0' }}>
                  <MessageSquare size={12} />添加备注
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {TIMELINE.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: item.color }}>
                      {item.actor.slice(0, 1)}
                    </div>
                    {idx < TIMELINE.length - 1 && <div className="w-0.5 flex-1 mt-1 min-h-4" style={{ background: '#F0F4F8' }} />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#1a2035' }}>{item.actor}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${item.color}18`, color: item.color }}>{item.action}</span>
                      <span className="text-[11px] ml-auto" style={{ color: '#A0AEC0' }}>{item.time}</span>
                    </div>
                    <div className="p-3 rounded-xl text-xs leading-relaxed" style={{ background: '#F8FAFC', color: '#64748b' }}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Meta */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-3" style={{ color: '#1a2035' }}>快捷操作</div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#FF9F43,#e8890f)' }}>
                <Zap size={14} />一键催进度
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#22c55e15', color: '#22c55e' }}>
                <CheckCircle2 size={14} />标记已解决
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium" style={{ background: '#F0F4F8', color: '#64748b' }}>
                <Paperclip size={14} />上传附件
              </button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-3" style={{ color: '#1a2035' }}>问题信息</div>
            <div className="space-y-3">
              {[
                { icon: Tag, label: '品牌', value: issue.brand, valueColor: issue.brand === 'VIRTAVO' ? '#4FA7A0' : '#6b8c00' },
                { icon: Tag, label: '产品', value: issue.product },
                { icon: Tag, label: '分类', value: issue.category },
                { icon: Globe, label: '国家', value: issue.country },
                { icon: Tag, label: '来源', value: issue.source, valueColor: sourceColors[issue.source] },
                { icon: User, label: '负责人', value: issue.owner },
                { icon: Clock, label: '创建时间', value: issue.createdAt },
                { icon: Clock, label: '最后更新', value: issue.updatedAt },
                ...(issue.resolvedAt ? [{ icon: CheckCircle2, label: '解决时间', value: issue.resolvedAt }] : []),
              ].map(({ icon: Icon, label, value, valueColor }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon size={13} style={{ color: '#A0AEC0' }} />
                    <span className="text-xs" style={{ color: '#A0AEC0' }}>{label}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: valueColor || '#1a2035' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div className="font-bold text-sm mb-3" style={{ color: '#1a2035' }}>优先级</div>
            <div className="flex gap-2">
              {(['高', '中', '低'] as const).map(p => (
                <button key={p} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: issue.priority === p ? `${priorityColors[p]}25` : '#F0F4F8', color: issue.priority === p ? priorityColors[p] : '#A0AEC0', border: issue.priority === p ? `2px solid ${priorityColors[p]}50` : '2px solid transparent' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
