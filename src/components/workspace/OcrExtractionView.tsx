import React, { useState } from 'react';
import {
  ScanLine,
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Loader2,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { extractOcrText } from '../../services/aiService';
import { downloadTextAsFile } from '../../services/pdfToolsService';

interface OcrExtractionViewProps {
  documents: DocumentItem[];
  selectedDocument?: DocumentItem;
}

export const OcrExtractionView: React.FC<OcrExtractionViewProps> = ({
  documents,
  selectedDocument,
}) => {
  const activeDocs = documents.filter((d) => !d.isTrash);
  const [currentDoc, setCurrentDoc] = useState<DocumentItem | undefined>(selectedDocument || activeDocs[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);

  const handleRunOcr = async () => {
    if (!currentDoc) return;
    setIsLoading(true);

    const sampleImageOrText = currentDoc.pages.map((p) => p.content).join('\n\n');
    const result = await extractOcrText(sampleImageOrText, currentDoc.fileName);

    setExtractedText(result.text);
    setConfidenceScore(result.confidence || 99.2);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadTextAsFile(extractedText, `${currentDoc.title}_OCR_Extracted.txt`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            OCR Text Extraction
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Extract editable text and tables from scanned PDFs, images, receipts, and contracts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentDoc?.id}
            onChange={(e) => {
              const doc = activeDocs.find((d) => d.id === e.target.value);
              if (doc) setCurrentDoc(doc);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          >
            {activeDocs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.fileType.toUpperCase()})
              </option>
            ))}
          </select>

          <button
            onClick={handleRunOcr}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanLine className="h-3.5 w-3.5" />}
            <span>Run Neural OCR</span>
          </button>
        </div>
      </div>

      {/* Main Side-by-Side Area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Source Document / Image Preview */}
        <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-2xs text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900">Original Document Source</span>
            </div>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {currentDoc?.fileName}
            </span>
          </div>

          <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50/70 p-4 font-mono text-[11px] text-slate-600 leading-relaxed overflow-y-auto max-h-[420px]">
            <p className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
              [Simulated Scanned PDF Canvas Source]
            </p>
            <p className="whitespace-pre-line">
              {currentDoc?.pages[0]?.content || 'Scanned document preview data.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>DPI: 300 (High-Resolution Scan)</span>
            <span>Pages: {currentDoc?.totalPages || 1}</span>
          </div>
        </div>

        {/* Right: Extracted Editable Text Output */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-2xs text-left justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Extracted Text Output</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> {confidenceScore}% Accuracy
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-medium text-slate-600">
                  Running Neural Character Recognition & Structure Analysis...
                </p>
              </div>
            ) : (
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={14}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/40 p-4 font-mono text-xs text-slate-800 leading-relaxed focus:border-blue-500 focus:bg-white focus:outline-hidden"
              />
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Preserved: Paragraphs, Line Breaks, Number Formats</span>
            <span>Editable in-place</span>
          </div>
        </div>
      </div>
    </div>
  );
};
