import React from 'react';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Search,
  Wrench,
  Star,
  Users,
  Trash2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  FileSpreadsheet,
  ScanLine,
  Globe
} from 'lucide-react';
import { AppView } from '../../types';

interface AppSidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenUpload: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  favoriteCount?: number;
  sharedCount?: number;
  trashCount?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  collapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  favoriteCount = 0,
  sharedCount = 0,
  trashCount = 0,
  userName = 'User',
  userRole = 'Account Member',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}) => {
  const workspaceNavItems: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'search', label: 'AI Search', icon: Search },
    { id: 'tools', label: 'PDF Tools', icon: Wrench },
  ];

  const specializedAiItems: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'summarizer', label: 'AI Summarizer', icon: Sparkles },
    { id: 'ocr', label: 'OCR Extraction', icon: ScanLine },
    { id: 'translate', label: 'Document Translate', icon: Globe },
  ];

  const libraryNavItems: { id: AppView; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoriteCount },
    { id: 'shared', label: 'Shared with Me', icon: Users, count: sharedCount },
    { id: 'trash', label: 'Trash', icon: Trash2, count: trashCount },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 md:static md:z-30 md:shrink-0 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-18' : 'md:w-64'}`}
      >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex cursor-pointer items-center gap-2.5 overflow-hidden"
        >
          <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <FileText className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                PDFMind <span className="text-blue-600 font-medium">AI</span>
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Upload Quick CTA */}
      <div className="p-3">
        <button
          onClick={onOpenUpload}
          className={`flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.99] ${
            collapsed ? 'px-0' : ''
          }`}
          title="Upload Document"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Upload Document</span>}
        </button>
      </div>

      {/* Scrollable Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-6 scrollbar-thin">
        {/* Workspace Group */}
        <div>
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Workspace
            </p>
          )}
          <div className="space-y-1">
            {workspaceNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Studios Group */}
        <div>
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              AI Tools
            </p>
          )}
          <div className="space-y-1">
            {specializedAiItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Library Group */}
        <div>
          {!collapsed && (
            <p className="px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Library
            </p>
          )}
          <div className="space-y-1">
            {libraryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && typeof item.count === 'number' && item.count > 0 && (
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Utility Items */}
      <div className="border-t border-slate-100 p-3 space-y-1 bg-slate-50/50">
        <button
          onClick={() => onNavigate('help')}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
            currentView === 'help' ? 'bg-slate-200/70 text-slate-900 font-semibold' : ''
          }`}
          title={collapsed ? 'Help Center' : undefined}
        >
          <HelpCircle className="h-4.5 w-4.5 shrink-0 text-slate-400" />
          {!collapsed && <span>Help Center</span>}
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
            currentView === 'settings' ? 'bg-slate-200/70 text-slate-900 font-semibold' : ''
          }`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-4.5 w-4.5 shrink-0 text-slate-400" />
          {!collapsed && <span>Settings</span>}
        </button>

        {/* User Profile Mini Bar */}
        <div
          onClick={() => onNavigate('settings')}
          className={`mt-2 flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-slate-100 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <img
            src={userAvatar}
            alt={userName}
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-xs font-semibold text-slate-800">{userName}</p>
              <p className="truncate text-[11px] text-slate-500">{userRole}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
