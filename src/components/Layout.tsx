import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, List, Columns, PlusCircle, BarChart3,
  Settings, FileText, ChevronLeft, ChevronRight, Bell,
  Search, User, Zap, Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: '总览 Dashboard' },
  { path: '/issues', icon: List, label: '问题列表' },
  { path: '/kanban', icon: Columns, label: '看板视图' },
  { path: '/weekly', icon: FileText, label: '周报视图' },
  { path: '/analytics', icon: BarChart3, label: '数据统计' },
  { path: '/new', icon: PlusCircle, label: '新建问题' },
  { path: '/settings', icon: Settings, label: '系统设置' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 border-r border-border"
        style={{
          width: collapsed ? 64 : 220,
          background: '#fff',
          boxShadow: '2px 0 16px rgba(0,0,0,0.04)',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-border" style={{ minHeight: 64 }}>
          <div className="flex items-center justify-center w-8 h-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #4FA7A0 0%, #2d7d78 100%)' }}>
            <Zap size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: '#1a2035' }}>售后管理</div>
              <div className="text-[10px]" style={{ color: '#A0AEC0' }}>After-Sales Hub</div>
            </div>
          )}
        </div>

        {/* Brand Tabs */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-border">
            <div className="flex rounded-xl overflow-hidden" style={{ background: '#F0F4F8' }}>
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-semibold rounded-xl transition-all" style={{ background: '#4FA7A0', color: '#fff' }}>
                <Shield size={11} />VIRTAVO
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-medium rounded-xl transition-all" style={{ color: '#64748b' }}>
                <Shield size={11} />ShowMo
              </button>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
            return (
              <NavLink
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl transition-all duration-150 group"
                style={{
                  background: active ? 'linear-gradient(135deg, #4FA7A0 0%, #3a8f89 100%)' : 'transparent',
                  color: active ? '#fff' : '#64748b',
                  fontWeight: active ? 600 : 400,
                  fontSize: 13,
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && path === '/issues' && (
                  <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4" style={{ background: active ? 'rgba(255,255,255,0.25)' : '#FF6B6B', color: '#fff', border: 'none' }}>12</Badge>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse btn */}
        <div className="px-2 py-3 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-xl text-xs transition-all"
            style={{ background: '#F0F4F8', color: '#64748b' }}
          >
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span className="ml-1">收起</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 border-b border-border bg-white" style={{ height: 64, flexShrink: 0, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#F0F4F8', width: 240 }}>
              <Search size={14} style={{ color: '#A0AEC0' }} />
              <input className="flex-1 bg-transparent text-sm outline-none" style={{ color: '#1a2035' }} placeholder="搜索问题 / 编号..." />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Brand Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(79,167,160,0.1)', color: '#4FA7A0' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#4FA7A0' }} />
                VIRTAVO
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(209,232,62,0.12)', color: '#6b8c00' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#D1E83E' }} />
                ShowMo
              </div>
            </div>
            <button className="relative p-2 rounded-xl" style={{ background: '#F0F4F8' }}>
              <Bell size={16} style={{ color: '#64748b' }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#FF6B6B' }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer" style={{ background: '#F0F4F8' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#4FA7A0' }}>LJ</div>
              <span className="text-sm font-medium" style={{ color: '#1a2035' }}>李杰</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto" style={{ background: '#F0F4F8', padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
