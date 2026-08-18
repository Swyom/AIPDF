import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Share2,
  ListOrdered,
  Layers,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { generateAiSummary } from '../../services/aiService';
import { downloadTextAsFile } from '../../services/pdfToolsService';

interface SummarizerViewProps {
  documents: DocumentItem[];
  selectedDocument?: DocumentItem;
  onSelectDocument: (doc: DocumentItem) => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  documents,
  selectedDocument,
  onSelectDocument,
}) => {
  const activeDocs = documents.filter((d) => !d.isTrash);
  const currentDoc = selectedDocument || activeDocs[0];

  const [lengthType, setLengthType] = useState<'short' | 'medium' | 'long'>('medium');
  const [summaryFormat, setSummaryFormat] = useState<'bullets' | 'executive' | 'action_items' | 'comprehensive'>('executive');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Result state initialized with document summary or empty string
  const [summaryText, setSummaryText] = useState<string>(
    currentDoc?.summary || ''
  );

  const handleGenerateSummary = async () => {
    if (!currentDoc) return;
    setIsLoading(true);

    const docContent = currentDoc.pages.map((p) => `Page ${p.pageNumber}: ${p.content}`).join('\n\n');
    const result = await generateAiSummary(docContent, currentDoc.title, lengthType, summaryFormat);

    setSummaryText(result.summary);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadTextAsFile(summaryText, `${currentDoc?.title || 'Summary'}_AI_Summary.txt`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Document Summarizer
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Generate executive briefings, bullet points, and actionable takeaways from long files
          </p>
        </div>

        {/* Document Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Document:</span>
          <select
            value={currentDoc?.id}
            onChange={(e) => {
              const doc = activeDocs.find((d) => d.id === e.target.value);
              if (doc) onSelectDocument(doc);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          >
            {activeDocs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.totalPages} pages)
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Summary Controls & Configuration */}
        <div className="lg:col-span-4 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs text-left">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Summary Length
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['short', 'medium', 'long'] as const).map((len) => (
                <button
                  key={len}
                  onClick={() => setLengthType(len)}
                  className={`rounded-lg border py-2 text-center font-medium capitalize transition-colors ${
                    lengthType === len
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {len === 'short' ? 'Brief' : len === 'medium' ? 'Detailed' : 'In-Depth'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Summary Structure
            </label>
            <div className="space-y-2 text-xs">
              {[
                { id: 'executive', label: 'Executive Briefing', desc: 'Overview + findings + action items' },
                { id: 'bullets', label: 'Key Bullet Points', desc: 'Fast, scannable highlight list' },
                { id: 'action_items', label: 'Action Items & Next Steps', desc: 'Identified tasks, dates, and owners' },
                { id: 'comprehensive', label: 'Detailed Section Breakdown', desc: 'Page-by-page thorough synthesis' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSummaryFormat(item.id as any)}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    summaryFormat === item.id
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Synthesizing Document with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Rendered Summary Output Pane */}
        <div className="lg:col-span-8 flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-2xs text-left min-h-[460px] justify-between">
          <div>
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  {currentDoc?.title} — Summary
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-medium text-slate-600">
                  Analyzing document tokens and structuring insights...
                </p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-700 whitespace-pre-line font-sans">
                {summaryText}
              </div>
            )}
          </div>

          <div className="mt-8 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Generated with Gemini 3.7 Flash</span>
            <span>Grounding: 100% Verifiable Citations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
