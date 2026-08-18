import React, { useState } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  MoreVertical,
  Plus,
  FileText,
  Clock,
  Download,
  Share2,
  Trash2,
  Edit2,
  Sparkles,
  MessageSquare,
  Eye,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { DocumentItem, AppView } from '../../types';
import { downloadTextAsFile } from '../../services/pdfToolsService';

interface DocumentsViewProps {
  documents: DocumentItem[];
  onOpenUpload: () => void;
  onSelectDocument: (doc: DocumentItem, targetView?: AppView) => void;
  onToggleFavorite: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
  onRenameDocument: (docId: string, newTitle: string) => void;
  onOpenShareModal: (doc: DocumentItem) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onOpenUpload,
  onSelectDocument,
  onToggleFavorite,
  onDeleteDocument,
  onRenameDocument,
  onOpenShareModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'images' | 'recent' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuDocId, setActiveMenuDocId] = useState<string | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Filter out trash items
  const activeDocs = documents.filter((d) => !d.isTrash);

  // Apply search query
  let filtered = activeDocs.filter((doc) => {
    const matchQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;

    if (activeFilter === 'pdf') return doc.fileType === 'pdf';
    if (activeFilter === 'images') return doc.fileType === 'png' || doc.fileType === 'jpg';
    if (activeFilter === 'favorites') return doc.isFavorite;
    return true;
  });

  // Apply sorting
  filtered.sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    if (sortBy === 'size') return b.fileSizeBytes - a.fileSizeBytes;
    return b.lastModified.localeCompare(a.lastModified);
  });

  const handleStartRename = (doc: DocumentItem) => {
    setEditingDocId(doc.id);
    setEditingTitle(doc.title);
    setActiveMenuDocId(null);
  };

  const handleSaveRename = (docId: string) => {
    if (editingTitle.trim()) {
      onRenameDocument(docId, editingTitle.trim());
    }
    setEditingDocId(null);
  };

  const handleDownload = (doc: DocumentItem) => {
    const textContent = doc.pages.map((p) => `--- Page ${p.pageNumber}: ${p.title || ''} ---\n\n${p.content}`).join('\n\n');
    downloadTextAsFile(textContent, `${doc.title}.txt`);
    setActiveMenuDocId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12" onClick={() => setActiveMenuDocId(null)}>
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My Documents
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage, analyze, and search across your uploaded files ({filtered.length} documents)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, filename or category..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Right: Filter tabs, Sort dropdown & Grid/List view toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                activeFilter === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('pdf')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                activeFilter === 'pdf' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              PDFs
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                activeFilter === 'favorites' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Favorites
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="date">Sort: Recent Date</option>
              <option value="name">Sort: File Name</option>
              <option value="size">Sort: File Size</option>
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-100/70 p-0.5 text-slate-500">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded p-1 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-1 transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Grid / List */}
      {filtered.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No documents yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No documents matched your search query. Try resetting your search filters.'
              : 'Upload your first document to get started with AI chat, summaries, and transformations.'}
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs text-left"
            >
              <div>
                {/* Card Top: Favorite + Badge + More Menu */}
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {doc.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(doc.id);
                      }}
                      className={`p-1 text-slate-300 hover:text-amber-400 transition-colors ${
                        doc.isFavorite ? 'text-amber-400' : ''
                      }`}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                        }}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuDocId === doc.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-6 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg text-xs animate-in fade-in"
                        >
                          <button
                            onClick={() => {
                              onSelectDocument(doc, 'viewer');
                              setActiveMenuDocId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                            <span>Open in Viewer</span>
                          </button>
                          <button
                            onClick={() => {
                              onSelectDocument(doc, 'chat');
                              setActiveMenuDocId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                            <span>Chat with AI</span>
                          </button>
                          <button
                            onClick={() => {
                              onSelectDocument(doc, 'summarizer');
                              setActiveMenuDocId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-slate-400" />
                            <span>Summarize</span>
                          </button>
                          <button
                            onClick={() => handleStartRename(doc)}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              onOpenShareModal(doc);
                              setActiveMenuDocId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            <Share2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
                          >
                            <Download className="h-3.5 w-3.5 text-slate-400" />
                            <span>Download</span>
                          </button>
                          <div className="my-1 border-t border-slate-100"></div>
                          <button
                            onClick={() => {
                              onDeleteDocument(doc.id);
                              setActiveMenuDocId(null);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Move to Trash</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Main: Document Preview Thumbnail Box */}
                <div
                  onClick={() => onSelectDocument(doc, 'viewer')}
                  className="cursor-pointer rounded-lg border border-slate-100 bg-slate-50/60 p-3 mb-3 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1">
                    <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="truncate">{doc.fileName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.summary || doc.pages[0]?.content.slice(0, 100)}...
                  </p>
                </div>

                {/* Title */}
                {editingDocId === doc.id ? (
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full rounded border border-blue-400 px-2 py-1 text-xs text-slate-900"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(doc.id);
                        if (e.key === 'Escape') setEditingDocId(null);
                      }}
                    />
                    <button
                      onClick={() => handleSaveRename(doc.id)}
                      className="rounded bg-blue-600 px-2 py-1 text-[11px] text-white"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h3
                    onClick={() => onSelectDocument(doc, 'viewer')}
                    className="cursor-pointer text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {doc.title}
                  </h3>
                )}
              </div>

              {/* Card Footer: Metadata & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{doc.totalPages} pages · {doc.fileSize}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3 pl-4 pr-2 font-semibold">Document Title</th>
                <th className="py-3 px-3 font-semibold hidden sm:table-cell">Category</th>
                <th className="py-3 px-3 font-semibold hidden md:table-cell">Pages</th>
                <th className="py-3 px-3 font-semibold hidden md:table-cell">Size</th>
                <th className="py-3 px-3 font-semibold">Modified</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 pl-2 pr-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr key={doc.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pl-4 pr-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleFavorite(doc.id)}
                        className={`text-slate-300 hover:text-amber-400 ${
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
                          <p className="text-[11px] text-slate-400 truncate">{doc.fileName}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 hidden sm:table-cell">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 hidden md:table-cell">{doc.totalPages}</td>
                  <td className="py-3 px-3 text-slate-500 hidden md:table-cell">{doc.fileSize}</td>
                  <td className="py-3 px-3 text-slate-500">{doc.lastModified}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </span>
                  </td>
                  <td className="py-3 pl-2 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectDocument(doc, 'viewer')}
                        className="p-1.5 text-slate-400 hover:text-slate-900 rounded"
                        title="Open Viewer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSelectDocument(doc, 'chat')}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                        title="AI Chat"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-900 rounded"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
