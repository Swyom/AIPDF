import React from 'react';
import { FileText, Sparkles, ArrowRight, Shield, Layers, HelpCircle, MessageSquare } from 'lucide-react';
import { AppView, AuthMode } from '../../types';

interface NavbarProps {
  currentView?: AppView;
  onNavigate?: (view: AppView) => void;
  onOpenAuth: (mode: AuthMode) => void;
  onStartForFree?: () => void;
  onNavigateToApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'landing',
  onNavigate,
  onOpenAuth,
  onStartForFree,
  onNavigateToApp,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate ? onNavigate('landing') : undefined}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-900">
              PDFMind <span className="font-normal text-blue-600">AI</span>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Features
          </a>
          <a
            href="#ai-chat"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            AI PDF Chat
          </a>
          <a
            href="#pdf-tools"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            PDF Tools
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Log In
          </button>
          
          <button
            onClick={onStartForFree || onNavigateToApp}
            className="group flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
