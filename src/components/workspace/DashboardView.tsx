import React from 'react';
import {
  UploadCloud,
  MessageSquare,
  Sparkles,
  ScanLine,
  Globe,
  Layers,
  Minimize2,
  FileText,
  Clock,
  Star,
  MoreVertical,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Plus,
  Search,
  Eye
} from 'lucide-react';
import { DocumentItem, AppView } from '../../types';

interface DashboardViewProps {
  documents: DocumentItem[];
  userName?: string;
  onOpenUpload: () => void;
  onSelectDocument: (doc: DocumentItem, targetView?: AppView) => void;
  onToggleFavorite: (docId: string) => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  userName = 'Alex',
  onOpenUpload,
  onSelectDocument,
  onToggleFavorite,
  onNavigate,
}) => {
  const activeDocs = documents.filter((d) => !d.isTrash);
  const recentDocs = [...activeDocs].sort((a, b) => b.lastModified.localeCompare(a.lastModified)).slice(0, 5);

  const quickActions = [
    {
      id: 'chat',
      title: 'Chat with PDF',
      desc: 'Ask questions with source citations',
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100/80',
      view: 'chat' as AppView,
    },
    {
      id: 'summarize',
      title: 'Summarize',
      desc: 'Executive bullet points & findings',
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80',
      view: 'summarizer' as AppView,
    },
    {
      id: 'ocr',
      title: 'OCR Extraction',
      desc: 'Transcribe scanned papers & images',
      icon: ScanLine,
      color: 'text-amber-600 bg-amber-50 hover:bg-amber-100/80',
      view: 'ocr' as AppView,
    },
    {
      id: 'translate',
      title: 'Translate',
      desc: 'Convert into 50+ languages',
      icon: Globe,
      color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100/80',
      view: 'translate' as AppView,
    },
    {
      id: 'merge',
      title: 'Merge PDF',
      desc: 'Combine multiple files in order',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100/80',
      view: 'tools' as AppView,
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      desc: 'Reduce file size with zero loss',
      icon: Minimize2,
      color: 'text-rose-600 bg-rose-50 hover:bg-rose-100/80',
      view: 'tools' as AppView,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. GREETING HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Good morning, {userName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            What would you like to work on today?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span>AI Search Files</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* 2. PROMINENT UPLOAD DROPZONE */}
      <div
        onClick={onOpenUpload}
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center shadow-2xs transition-all hover:border-blue-500 hover:bg-blue-50/20"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs transition-transform group-hover:scale-105">
          <UploadCloud className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">
          Upload a document
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Drag and drop your PDF here or browse files.
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Supports PDF, DOCX, PPTX, XLSX, PNG, JPG (Up to 100MB)
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs group-hover:bg-blue-600 transition-colors"
        >
          Browse Files
        </button>
      </div>

      {/* 3. QUICK ACTIONS GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900">
            Quick Actions
          </h3>
          <button
            onClick={() => onNavigate('tools')}
            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>All utilities</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => onNavigate(action.view)}
                className="group flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs text-left"
              >
                <div>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color} transition-transform group-hover:scale-105`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="mt-3 text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 leading-tight">
                    {action.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECENT DOCUMENTS TABLE */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold tracking-tight text-slate-900">
              Recent Documents
            </h3>
          </div>
          <button
            onClick={() => onNavigate('documents')}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            View all ({activeDocs.length})
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 pl-4 pr-2 font-semibold">Document</th>
                <th className="py-3 px-3 font-semibold hidden sm:table-cell">Category</th>
                <th className="py-3 px-3 font-semibold hidden md:table-cell">File Size</th>
                <th className="py-3 px-3 font-semibold">Last Modified</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 pl-2 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="group hover:bg-slate-50/80 transition-colors"
                >
                  {/* Title & Star */}
                  <td className="py-3 pl-4 pr-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleFavorite(doc.id)}
                        className={`text-slate-300 hover:text-amber-400 transition-colors ${
                          doc.isFavorite ? 'text-amber-400' : ''
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>

                      <div
                        onClick={() => onSelectDocument(doc, 'viewer')}
                        className="flex cursor-pointer items-center gap-2.5 min-w-0"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate group-hover:text-blue-600">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {doc.fileName} · {doc.totalPages} pages
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 hidden sm:table-cell">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {doc.category}
                    </span>
                  </td>

                  {/* File Size */}
                  <td className="py-3 px-3 text-slate-500 hidden md:table-cell">
                    {doc.fileSize}
                  </td>

                  {/* Modified */}
                  <td className="py-3 px-3 text-slate-500">
                    {doc.lastModified}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-2 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectDocument(doc, 'viewer')}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Open in PDF Viewer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSelectDocument(doc, 'chat')}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                        title="Chat with Document"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
