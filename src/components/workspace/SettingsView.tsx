import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Database,
  Shield,
  CheckCircle2,
  Lock,
  Globe,
  Bell,
  Cpu,
  Save,
  Key,
  HardDrive
} from 'lucide-react';
import { UserSettings } from '../../types';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'ai' | 'storage' | 'security'>('profile');
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [aiModel, setAiModel] = useState(settings.aiModel);
  const [summaryLength, setSummaryLength] = useState(settings.defaultSummaryLength);
  const [ocrPrecision, setOcrPrecision] = useState(settings.ocrPrecision);
  const [autoIndex, setAutoIndex] = useState(settings.autoIndexOnUpload);
  const [twoFactor, setTwoFactor] = useState(settings.twoFactorAuth);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      name,
      email,
      aiModel,
      defaultSummaryLength: summaryLength,
      ocrPrecision,
      autoIndexOnUpload: autoIndex,
      twoFactorAuth: twoFactor,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Account & Workspace Settings
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Configure your AI preferences, storage limits, profile, and enterprise security
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            <span>Preferences saved</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-medium text-slate-500">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'ai'
              ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Intelligence</span>
        </button>
        <button
          onClick={() => setActiveTab('storage')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'storage'
              ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          <HardDrive className="h-4 w-4" />
          <span>Storage & Cloud</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
              : 'hover:text-slate-900'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Security</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Workspace Role</label>
              <input
                type="text"
                disabled
                value="Workspace Administrator"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500"
              />
            </div>
          </div>
        )}

        {/* Tab 2: AI Preferences */}
        {activeTab === 'ai' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 mb-4">AI Model & Pipeline Settings</h3>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Default AI Reasoning Engine</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 bg-white"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra-Fast, High-Throughput)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Multilingual & Complex Reasoning)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Default Summary Length</label>
                <select
                  value={summaryLength}
                  onChange={(e: any) => setSummaryLength(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 bg-white"
                >
                  <option value="short">Brief (Executive bullet points)</option>
                  <option value="medium">Medium (Detailed findings)</option>
                  <option value="long">Long (Page-by-page breakdown)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">OCR Precision Mode</label>
                <select
                  value={ocrPrecision}
                  onChange={(e: any) => setOcrPrecision(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 bg-white"
                >
                  <option value="high">High (Neural Character Engine)</option>
                  <option value="standard">Standard (Fast Speed)</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoIndex}
                  onChange={(e) => setAutoIndex(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-700">
                  Automatically generate semantic vector embeddings immediately upon document upload
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Storage & Cloud */}
        {activeTab === 'storage' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900">Workspace Storage Metrics</h3>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-800">4.2 GB of 25.0 GB used</span>
                <span className="text-slate-500">16.8% capacity</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '16.8%' }}></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Indexed Document Files:</span>
                <span className="font-semibold text-slate-900">14 Files (128 Pages)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Vector Embeddings Size:</span>
                <span className="font-semibold text-slate-900">34.8 MB</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">OCR Cache:</span>
                <span className="font-semibold text-slate-900">12.1 MB</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Enterprise Data Protection</h3>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-900">Two-Factor Authentication (2FA)</p>
                <p className="text-[11px] text-slate-500">Require an authenticator app code on login</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs font-semibold text-slate-900">AES-256 Storage Encryption</p>
                <p className="text-[11px] text-slate-500">All document tokens and vector chunks encrypted at rest</p>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
