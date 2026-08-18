import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { translateDocumentText } from '../../services/aiService';
import { downloadTextAsFile } from '../../services/pdfToolsService';

interface TranslationViewProps {
  documents: DocumentItem[];
  selectedDocument?: DocumentItem;
}

export const TranslationView: React.FC<TranslationViewProps> = ({
  documents,
  selectedDocument,
}) => {
  const activeDocs = documents.filter((d) => !d.isTrash);
  const [currentDoc, setCurrentDoc] = useState<DocumentItem | undefined>(selectedDocument || activeDocs[0]);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [translatedText, setTranslatedText] = useState<string>('');

  const languages = [
    'Spanish',
    'French',
    'German',
    'Japanese',
    'Chinese (Simplified)',
    'Portuguese',
    'Italian',
    'Arabic',
    'Korean',
    'Dutch',
    'Hindi'
  ];

  const handleTranslate = async () => {
    if (!currentDoc) return;
    setIsLoading(true);

    const originalContent = currentDoc.pages.map((p) => p.content).join('\n\n');
    const result = await translateDocumentText(originalContent, targetLang);

    setTranslatedText(result.translated);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadTextAsFile(translatedText, `${currentDoc.title}_Translated_${targetLang}.txt`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Document Translation
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Translate documents across 50+ languages while preserving headings and structure
          </p>
        </div>

        {/* Translation Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
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
                {d.title}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-slate-400">Target:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="font-semibold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTranslate}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>Translate Document</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Original Document */}
        <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-2xs text-left justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-900">Original (English)</span>
              </div>
              <span className="text-[10px] text-slate-400">{currentDoc?.fileName}</span>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-700 leading-relaxed max-h-[460px] overflow-y-auto whitespace-pre-line font-sans">
              {currentDoc?.pages.map((p) => p.content).join('\n\n')}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Source Word Count: ~{currentDoc?.pages.reduce((acc, p) => acc + p.content.split(' ').length, 0)} words
          </div>
        </div>

        {/* Right: Translated Document Output */}
        <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-2xs text-left justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Translated ({targetLang})</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> Preserved Formatting
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
              <div className="py-28 text-center space-y-3">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="text-xs font-medium text-slate-600">
                  Translating document into {targetLang} with semantic nuance...
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-blue-100 bg-blue-50/20 p-4 text-xs text-slate-800 leading-relaxed max-h-[460px] overflow-y-auto whitespace-pre-line font-sans">
                {translatedText}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by Gemini 3.7 Neural Localization</span>
            <span>Ready for Export</span>
          </div>
        </div>
      </div>
    </div>
  );
};
