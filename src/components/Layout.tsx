import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Columns, PlusCircle, BarChart3, Settings, FileText, ChevronLeft, ChevronRight, Bell, Search, Zap, Code2, Briefcase } from 'lucide-react';
import XiaoMo from '@/components/XiaoMo';
import { useBrandStore } from '@/store/brandStore';

const OPS_NAV = [
  { path: '/', icon: LayoutDashboard, label: '总览 Dashboard' },
  { path: '/issues', icon: List, label: '问题列表' },
  { path: '/kanban', icon: Columns, label: '看板视图' },
  { path: '/weekly', icon: FileText, label: '周报视图' },
  { path: '/analytics', icon: BarChart3, label: '数据统计' },
  { path: '/new', icon: PlusCircle, label: '新建问题' },
  { path: '/settings', icon: Settings, label: '系统设置' },
];
const DEV_NAV = [
  { path: '/dev', icon: LayoutDashboard, label: '开发看板' },
  { path: '/issues', icon: List, label: '问题列表' },
  { path: '/kanban', icon: Columns, label: '看板视图' },
  { path: '/new', icon: PlusCircle, label: '新建问题' },
  { path: '/settings', icon: Settings, label: '系统设置' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const { activeBrand, setActiveBrand, activeRole, setActiveRole } = useBrandStore();
  const isDev = activeRole === '开发';
  const NAV = isDev ? DEV_NAV : OPS_NAV;

  const brandAccent = activeBrand === 'VIRTAVO' ? '#4FA7A0' : '#c8dc00';
  const sideActiveBg = isDev
    ? 'linear-gradient(135deg,#6C63FF,#5a52e8)'
    : (activeBrand === 'VIRTAVO' ? 'linear-gradient(135deg,#4FA7A0,#3a8f89)' : 'linear-gradient(135deg,#c8dc00,#a8bb00)');
  const sideActiveText = isDev ? '#fff' : (activeBrand === 'ShowMo' ? '#2a3800' : '#fff');

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <aside style={{ width: collapsed ? 64 : 220, background: '#fff', boxShadow: '2px 0 16px rgba(0,0,0,0.05)', flexShrink: 0, display: 'flex', flexDirection: 'column', transition: 'all 0.25s' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 14px', borderBottom: '1px solid #f1f5f9', minHeight: 64 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: isDev ? 'linear-gradient(135deg,#6C63FF,#5a52e8)' : 'linear-gradient(135deg,#4FA7A0,#2d7d78)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isDev ? <Code2 size={15} color="#fff" /> : <Zap size={15} color="#fff" />}
          </div>
          {!collapsed && <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a2035', lineHeight: 1.2 }}>{isDev ? '开发视角' : '售后管理'}</div>
            <div style={{ fontSize: 10, color: isDev ? '#6C63FF' : '#94a3b8' }}>{isDev ? 'Developer Hub' : 'After-Sales Hub'}</div>
          </div>}
        </div>

        {/* Brand Tabs — only in ops mode */}
        {!collapsed && !isDev && (
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, overflow: 'hidden', padding: 3, gap: 3 }}>
              {(['VIRTAVO', 'ShowMo'] as const).map(b => {
                const isActive = activeBrand === b;
                return (
                  <button key={b} onClick={() => setActiveBrand(b)} style={{ flex: 1, padding: '6px 0', fontSize: 11, fontWeight: 700, borderRadius: 9, background: isActive ? (b === 'VIRTAVO' ? '#4FA7A0' : '#c8dc00') : 'transparent', color: isActive ? (b === 'VIRTAVO' ? '#fff' : '#3d5200') : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {b}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 6, fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
              当前：<span style={{ color: brandAccent, fontWeight: 700 }}>{activeBrand}</span>
            </div>
          </div>
        )}

        {/* Dev mode indicator */}
        {!collapsed && isDev && (
          <div style={{ margin: '10px 12px', background: '#6C63FF18', borderRadius: 10, padding: '8px 12px', border: '1px solid #6C63FF30' }}>
            <div style={{ fontSize: 11, color: '#a5b4fc', fontWeight: 600 }}>开发工程师视角</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>查看分配给你的技术任务</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {NAV.map(({ path, icon: Icon, label }) => {
            const active = loc.pathname === path || (path !== '/' && path !== '/dev' && loc.pathname.startsWith(path));
            return (
              <NavLink key={path} to={path} title={collapsed ? label : undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', marginBottom: 2, borderRadius: 12, textDecoration: 'none', background: active ? sideActiveBg : 'transparent', color: active ? sideActiveText : (isDev ? '#64748b' : '#64748b'), fontWeight: active ? 600 : 400, fontSize: 13, transition: 'all 0.15s' }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
                {!collapsed && path === '/issues' && (
                  <span style={{ marginLeft: 'auto', background: active ? 'rgba(255,255,255,0.25)' : '#FF6B6B', color: '#fff', borderRadius: 20, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>12</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid #f1f5f9' }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: '8px 0', borderRadius: 12, background: '#f1f5f9', color: '#64748b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12 }}>
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>收起</span></>}
          </button>
        </div>
      </aside>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <header style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: '#fff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 12, padding: '8px 14px', width: 240 }}>
            <Search size={13} color="#94a3b8" />
            <input style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#1a2035' }} placeholder="搜索问题 / 编号..." />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Role switcher */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, overflow: 'hidden', padding: 3, gap: 2 }}>
              {(['运营', '开发'] as const).map(r => {
                const isActive = activeRole === r;
                const activeBg = r === '开发' ? '#6C63FF' : '#4FA7A0';
                return (
                  <button key={r} onClick={() => { setActiveRole(r); if (r === '开发') nav('/dev'); else nav('/'); }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 9, fontSize: 11, fontWeight: 700, background: isActive ? activeBg : 'transparent', color: isActive ? '#fff' : '#64748b', border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                    {r === '运营' ? <Briefcase size={11} /> : <Code2 size={11} />}{r}视角
                  </button>
                );
              })}
            </div>

            {/* Brand badge */}
            {!isDev && (activeBrand === 'VIRTAVO' ? (
              <span style={{ background: 'rgba(79,167,160,0.1)', color: '#4FA7A0', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#4FA7A0', display: 'inline-block' }} />VIRTAVO
              </span>
            ) : (
              <span style={{ background: 'rgba(200,220,0,0.12)', color: '#6b8c00', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: '#c8dc00', display: 'inline-block' }} />ShowMo
              </span>
            ))}

            <button style={{ position: 'relative', background: '#f1f5f9', border: 'none', borderRadius: 12, padding: 8, cursor: 'pointer' }}>
              <Bell size={15} color="#64748b" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 99, background: '#FF6B6B' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 12, padding: '6px 12px', cursor: 'pointer' }}>
              <div style={{ width: 28, height: 28, borderRadius: 99, background: isDev ? '#6C63FF' : '#4FA7A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>LHY</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2035', lineHeight: 1.2 }}>李铧燕</div>
                <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.2 }}>{isDev ? '开发工程师' : '市场与传播经理'}</div>
              </div>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', background: '#F0F4F8', padding: 24 }}>{children}</main>
      </div>
      <XiaoMo />
    </div>
  );
}
