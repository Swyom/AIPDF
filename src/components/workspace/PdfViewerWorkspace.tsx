import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Search,
  Sparkles,
  Send,
  FileText,
  RotateCw,
  Highlighter,
  MessageSquare,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { DocumentItem, ChatMessage, PageCitation } from '../../types';
import { askAiChat } from '../../services/aiService';
import { downloadTextAsFile } from '../../services/pdfToolsService';

interface PdfViewerWorkspaceProps {
  document: DocumentItem | null;
  onOpenShareModal: (doc: DocumentItem) => void;
  onBackToDocs?: () => void;
}

export const PdfViewerWorkspace: React.FC<PdfViewerWorkspaceProps> = ({
  document: doc,
  onOpenShareModal,
  onBackToDocs,
}) => {
  if (!doc) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <FileText className="h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-base font-semibold text-slate-900">No Document Selected</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Upload a new document or choose a file from your repository to open the AI workspace.
        </p>
        {onBackToDocs && (
          <button
            onClick={onBackToDocs}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            Go to My Documents
          </button>
        )}
      </div>
    );
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [inDocSearch, setInDocSearch] = useState('');
  const [highlightedPageNum, setHighlightedPageNum] = useState<number | null>(null);

  // AI Assistant Chat State
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-initial',
      role: 'assistant',
      content: `Hello! Ask any question or request a summary for **"${doc.title}"**.`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Suggested Prompts
  const suggestedPrompts = [
    'Summarize this document',
    'What are the key points?',
    'Find important numbers',
    'Explain this section',
    'What is the conclusion?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || chatInput).trim();
    if (!query || isAiThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);

    const docText = doc.pages.map((p) => `Page ${p.pageNumber}: ${p.content}`).join('\n\n');
    const result = await askAiChat(query, doc.title, docText, chatMessages.map(m => ({ role: m.role, content: m.content })));

    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: result.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations: result.citations || [{ page: currentPage, text: `Page ${currentPage}` }],
    };

    setChatMessages((prev) => [...prev, assistantMsg]);
    setIsAiThinking(false);
  };

  const handleCitationClick = (pageNumber: number) => {
    const targetPage = Math.min(Math.max(1, pageNumber), doc.pages.length || 1);
    setCurrentPage(targetPage);
    setHighlightedPageNum(targetPage);
    setTimeout(() => {
      setHighlightedPageNum(null);
    }, 2500);
  };

  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDoc = () => {
    const textContent = doc.pages.map((p) => `=== Page ${p.pageNumber}: ${p.title || ''} ===\n\n${p.content}`).join('\n\n');
    downloadTextAsFile(textContent, `${doc.fileName}.txt`);
  };

  const activePageData = doc.pages.find((p) => p.pageNumber === currentPage) || doc.pages[0] || {
    pageNumber: 1,
    title: 'Page 1',
    content: 'Document content available.',
  };

  return (
    <div
      ref={viewerContainerRef}
      className={`flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-white' : 'h-[calc(100vh-6.5rem)] min-h-[500px] lg:min-h-[600px]'
      }`}
    >
      {/* 1. TOP VIEWER TOOLBAR */}
      <div className="flex h-13 items-center justify-between border-b border-slate-200 bg-white px-4 shrink-0">
        {/* Left: Doc info & Back */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToDocs && (
            <button
              onClick={onBackToDocs}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
              title="Back to Documents"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xs font-semibold text-slate-900">{doc.title}</h2>
              <p className="text-[10px] text-slate-400 truncate">{doc.fileName} · {doc.fileSize}</p>
            </div>
          </div>
        </div>

        {/* Center: Pagination & Zoom Controls */}
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 text-[11px] font-medium text-slate-700">
              Page {currentPage} of {doc.pages.length || 1}
            </span>
            <button
              disabled={currentPage >= (doc.pages.length || 1)}
              onClick={() => setCurrentPage((p) => Math.min(doc.pages.length || 1, p + 1))}
              className="p-0.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 text-xs text-slate-600">
            <button
              onClick={() => setZoomLevel((z) => Math.max(60, z - 15))}
              className="p-1 hover:bg-slate-100 rounded"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-11 text-center text-[11px] font-medium text-slate-700">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(175, z + 15))}
              className="p-1 hover:bg-slate-100 rounded"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Highlight toggle */}
          <button
            onClick={() => setShowHighlight(!showHighlight)}
            className={`hidden sm:flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
              showHighlight
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Highlighter className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[11px]">Highlights</span>
          </button>
        </div>

        {/* Right: Actions (Fullscreen, Download, Share) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={handleDownloadDoc}
            className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg"
            title="Download Document"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => onOpenShareModal(doc)}
            className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg"
            title="Share Document"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. THREE-COLUMN MAIN WORKSPACE */}
      <div className="grid grid-cols-12 flex-1 overflow-y-auto lg:overflow-hidden bg-slate-100/50">
        {/* PANEL 1: LEFT THUMBNAILS (Hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col border-r border-slate-200 bg-white overflow-y-auto p-3 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
            Thumbnails ({doc.pages.length} Pages)
          </p>

          <div className="space-y-2.5">
            {doc.pages.map((p) => {
              const isActive = currentPage === p.pageNumber;
              return (
                <div
                  key={p.pageNumber}
                  onClick={() => setCurrentPage(p.pageNumber)}
                  className={`group cursor-pointer rounded-lg border p-2 text-left transition-all ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-3/4 w-full rounded bg-slate-50 p-2 text-[8px] text-slate-400 overflow-hidden leading-tight border border-slate-100">
                    <p className="font-bold text-slate-700 text-[9px] truncate mb-1">
                      {p.title || `Page ${p.pageNumber}`}
                    </p>
                    <p className="line-clamp-6">{p.content.slice(0, 140)}</p>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-medium">Page {p.pageNumber}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: CENTER DOCUMENT CANVAS */}
        <div className="col-span-12 lg:col-span-6 flex flex-col overflow-y-auto p-4 sm:p-6 bg-slate-200/50 items-center">
          <div
            className={`w-full max-w-2xl rounded-xl border bg-white p-8 sm:p-10 shadow-md text-left transition-all duration-300 ${
              highlightedPageNum === currentPage
                ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50/10'
                : 'border-slate-200'
            }`}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Header of simulated PDF page */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6 text-xs text-slate-400">
              <span className="font-semibold text-slate-800">{doc.title}</span>
              <span>Page {currentPage} of {doc.pages.length}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {activePageData.title || `Section ${currentPage}: Overview`}
            </h3>

            {/* Document Content with smart highlighting */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 font-sans whitespace-pre-line">
              {activePageData.content}
            </div>

            {/* Highlights Box if toggled */}
            {(showHighlight || (activePageData.highlights && activePageData.highlights.length > 0)) && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Highlighter className="h-3.5 w-3.5 text-amber-600" />
                  <span>Key Passages Identified:</span>
                </div>
                {activePageData.highlights?.map((hl, idx) => (
                  <p key={idx} className="text-[11px] leading-snug">
                    • "{hl}"
                  </p>
                ))}
              </div>
            )}

            {/* Optional Table rendering if page has structured table */}
            {activePageData.tables && activePageData.tables.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
                {activePageData.tables.map((table, tIdx) => (
                  <table key={tIdx} className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 font-semibold text-slate-700 border-b border-slate-200">
                      <tr>
                        {table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2 text-slate-600">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>PDFMind AI Verified Document Intelligence</span>
              <span>Page {currentPage}</span>
            </div>
          </div>
        </div>

        {/* PANEL 3: RIGHT AI ASSISTANT (Dedicated Grounded Chat with Citations) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col border-l border-slate-200 bg-white h-full min-h-[400px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Ask AI Assistant</span>
            </div>
            <span className="rounded-full bg-blue-100/70 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              Grounded
            </span>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 border-b border-slate-100 scrollbar-none bg-slate-50/30 shrink-0">
            {suggestedPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-thin text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-xl p-3 max-w-[90%] space-y-2 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-2xs'
                      : 'border border-slate-200 bg-slate-50/80 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{msg.content}</p>

                  {/* Citations Badges */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-medium text-slate-400">Sources:</span>
                      {msg.citations.map((cite, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleCitationClick(cite.page)}
                          className="inline-flex items-center gap-1 rounded bg-blue-100/90 px-2 py-0.5 text-[10px] font-bold text-blue-800 hover:bg-blue-200 transition-colors border border-blue-200 shadow-2xs"
                          title={`Click to jump to page ${cite.page}`}
                        >
                          <span>Source · Page {cite.page}</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 px-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="hover:text-slate-600 flex items-center gap-0.5"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 max-w-[80%]">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>Analyzing document passages...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-100 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about this document..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAiThinking}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white disabled:opacity-40 hover:bg-blue-700 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
