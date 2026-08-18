import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Mail,
  Lock,
  Globe,
  UserPlus,
  ShieldCheck
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface ShareModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  document: doc,
  onClose,
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState<Array<{ email: string; role: string }>>([
    { email: 'user@example.com', role: 'Owner' },
  ]);

  if (!doc) return null;

  const shareUrl = `https://app.pdfmind.ai/share/${doc.id}?key=sec_${Math.random().toString(36).substring(2, 8)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInvitedMembers((prev) => [
      ...prev,
      {
        email: inviteEmail.trim(),
        role: permission === 'view' ? 'Can View' : 'Can Edit',
      },
    ]);
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Share Document</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
                {doc.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Invite by Email */}
        <form onSubmit={handleInvite} className="space-y-3 mb-6">
          <label className="block text-xs font-medium text-slate-700">
            Invite Collaborators
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <select
              value={permission}
              onChange={(e: any) => setPermission(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="view">Can view</option>
              <option value="edit">Can edit</option>
            </select>

            <button
              type="submit"
              disabled={!inviteEmail.trim()}
              className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Invite
            </button>
          </div>
        </form>

        {/* Member Access List */}
        <div className="mb-6 space-y-2.5">
          <label className="block text-xs font-semibold text-slate-700">
            People with access ({invitedMembers.length})
          </label>
          <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
            {invitedMembers.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {member.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate text-slate-800 text-xs">{member.email}</span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Public/Encrypted Link */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900">Encrypted Share Link</p>
              <p className="text-[10px] text-slate-400 truncate">
                Anyone with this link can view the document and ask questions with AI.
              </p>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 shrink-0 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
