import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileText,
  ScanLine,
  Search,
  Globe,
  Wrench,
  FileSpreadsheet,
  FolderSync,
  Layers,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Zap,
  Split,
  Minimize2,
  FilePlus,
  Send,
  Lock,
  Download,
  Share2,
  ZoomIn,
  Eye,
  ExternalLink,
  BookOpen,
  Mail
} from 'lucide-react';
import { AppView, AuthMode } from '../../types';
import { FAQ_ITEMS } from '../../data/helpArticles';

interface LandingPageProps {
  onStartForFree: () => void;
  onOpenAuth: (mode: AuthMode) => void;
  onNavigateToTool: (toolId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartForFree,
  onOpenAuth,
  onNavigateToTool,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activePreviewTab, setActivePreviewTab] = useState<'chat' | 'viewer' | 'summary'>('chat');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const featuresList = [
    {
      icon: MessageSquare,
      title: 'AI PDF Chat',
      desc: 'Ask questions and get answers grounded directly in document content with verifiable page citations.',
      action: 'Try AI Chat',
      view: 'chat'
    },
    {
      icon: Sparkles,
      title: 'AI Summarization',
      desc: 'Convert long documents into concise, executive bullet summaries, key findings, and action items in seconds.',
      action: 'Generate Summary',
      view: 'summarizer'
    },
    {
      icon: ScanLine,
      title: 'OCR Extraction',
      desc: 'Extract text from scanned PDFs, invoices, contracts, and mobile photos with 99%+ character accuracy.',
      action: 'Open OCR',
      view: 'ocr'
    },
    {
      icon: Search,
      title: 'AI Search',
      desc: 'Search across all your documents simultaneously using natural language questions and semantic vector matching.',
      action: 'Explore Search',
      view: 'search'
    },
    {
      icon: Globe,
      title: 'Translation',
      desc: 'Translate entire documents across 50+ languages while strictly preserving headings, tables, and page layout.',
      action: 'Translate Document',
      view: 'translate'
    },
    {
      icon: Wrench,
      title: 'PDF Tools',
      desc: 'Merge, split, compress, rearrange, and protect PDFs with fast client-side and server utilities.',
      action: 'View All Tools',
      view: 'tools'
    },
    {
      icon: FileSpreadsheet,
      title: 'File Conversion',
      desc: 'Convert PDFs into editable Word (DOCX), Excel spreadsheets (XLSX), PowerPoint slides, and plain text.',
      action: 'Convert File',
      view: 'tools'
    },
    {
      icon: FolderSync,
      title: 'Document Management',
      desc: 'Organize, tag, search, preview, favorite, share, and manage enterprise document collections seamlessly.',
      action: 'View Workspace',
      view: 'documents'
    }
  ];

  const pdfToolsGrid = [
    { name: 'Merge PDF', desc: 'Combine multiple PDF files into one ordered document.', icon: Layers },
    { name: 'Split PDF', desc: 'Extract specific pages or separate documents by range.', icon: Split },
    { name: 'Compress PDF', desc: 'Reduce PDF file size while maintaining pristine quality.', icon: Minimize2 },
    { name: 'PDF to Word', desc: 'Convert PDF tables and text into editable Microsoft Word.', icon: FileText },
    { name: 'PDF to Excel', desc: 'Extract financial tables and sheets into clean CSV/Excel.', icon: FileSpreadsheet },
    { name: 'PDF to PowerPoint', desc: 'Transform presentation handouts into editable PPTX slides.', icon: Layers },
    { name: 'Image to PDF', desc: 'Convert PNG, JPG, and scanned photos into multi-page PDFs.', icon: FilePlus },
    { name: 'OCR & Extract Text', desc: 'Digitize scanned receipts and contracts into searchable text.', icon: ScanLine },
    { name: 'Translate PDF', desc: 'Translate complete documents into Spanish, French, German, and more.', icon: Globe },
    { name: 'Extract Text', desc: 'Instant plain-text transcription for quick copy-pasting.', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-3.5 py-1 text-xs font-medium text-blue-700 shadow-2xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Next-Generation Document Intelligence Workspace</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.12]">
            Your PDFs, powered by AI.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Read, understand, summarize, search and transform your documents in one simple workspace.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartForFree}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 active:scale-[0.99]"
            >
              <span>Start for Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <a
              href="#features"
              className="flex items-center gap-2 rounded-xl border border-slate-300/90 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* REALISTIC APP PREVIEW (Actual Application Mockup) */}
          <div className="mt-14 sm:mt-18 mx-auto max-w-6xl rounded-2xl border border-slate-200/90 bg-white p-2 sm:p-3 shadow-xl ring-1 ring-slate-900/5">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 bg-slate-50/70 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                <div className="h-3 w-3 rounded-full bg-slate-300"></div>
                <span className="ml-2 text-xs font-medium text-slate-500">
                  app.pdfmind.ai — Workspace / Q3_Financial_Report.pdf
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" /> Indexed & Ready
                </span>
              </div>
            </div>

            {/* Mockup Application Window */}
            <div className="grid grid-cols-12 gap-0 overflow-hidden rounded-b-xl border border-slate-100 bg-white text-left h-[440px] sm:h-[480px]">
              {/* Mockup Sidebar */}
              <div className="hidden md:flex md:col-span-3 border-r border-slate-100 bg-slate-50/40 p-3 flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">
                      P
                    </div>
                    <span className="text-xs font-semibold text-slate-800">PDFMind AI</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="rounded-md bg-blue-50 px-2.5 py-1.5 font-medium text-blue-700 flex items-center justify-between">
                      <span>Documents</span>
                      <span className="text-[10px] bg-blue-200/70 px-1.5 py-0.2 rounded-full">14</span>
                    </div>
                    <div className="px-2.5 py-1.5 text-slate-600 flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                      <span>AI Chat</span>
                    </div>
                    <div className="px-2.5 py-1.5 text-slate-600 flex items-center gap-2">
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                      <span>AI Search</span>
                    </div>
                    <div className="px-2.5 py-1.5 text-slate-600 flex items-center gap-2">
                      <Wrench className="h-3.5 w-3.5 text-slate-400" />
                      <span>PDF Tools</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Recent Files
                    </p>
                    <div className="mt-1.5 space-y-1 text-xs">
                      <div className="truncate rounded px-2 py-1 bg-white font-medium text-slate-900 shadow-2xs border border-slate-200/80">
                        📄 Q3_2024_Financial_Report.pdf
                      </div>
                      <div className="truncate px-2 py-1 text-slate-500 hover:text-slate-800">
                        📄 AI_Governance_Framework.pdf
                      </div>
                      <div className="truncate px-2 py-1 text-slate-500 hover:text-slate-800">
                        📄 Clean_Energy_Whitepaper.pdf
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white p-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Workspace Storage</span>
                    <span className="text-[10px] text-slate-500">4.0 / 25 GB</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
              </div>

              {/* Mockup Center Document Viewer */}
              <div className="col-span-12 md:col-span-5 border-r border-slate-100 p-4 overflow-y-auto bg-slate-100/40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3 text-xs text-slate-500">
                  <span>Page 1 of 18</span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-white px-2 py-0.5 border border-slate-200 text-[11px]">100%</span>
                  </div>
                </div>

                {/* Rendered Document Page preview */}
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-3 font-sans">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">PDFMind AI Corporation</span>
                    <span className="text-[10px] text-slate-400">CONFIDENTIAL</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-xs">
                    Q3 2024 Financial Performance & Growth Report
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Net revenue reached <strong>$42.8 million</strong> (+28.4% YoY), driven by enterprise automation. Gross margins expanded to <strong>74.2%</strong>.
                  </p>
                  <div className="rounded border border-blue-100 bg-blue-50/60 p-2 text-[11px] text-blue-900">
                    <strong>Highlighted Passage:</strong> "Infrastructure unit costs decreased by 18.2% following AI pipeline optimization."
                  </div>
                  <div className="rounded border border-slate-100 p-2 text-[10px] text-slate-500 bg-slate-50">
                    Table 1.1: Consolidated Revenue by Segment ($M) — Enterprise: $26.8M, APIs: $11.4M
                  </div>
                </div>
              </div>

              {/* Mockup Right AI Assistant */}
              <div className="hidden sm:flex sm:col-span-12 md:col-span-4 p-4 flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-900">AI Assistant</span>
                    <span className="ml-auto text-[10px] text-slate-400">Gemini 3.7 Flash</span>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="rounded-xl rounded-tr-none bg-blue-600 px-3 py-2 text-white max-w-[85%]">
                        What are the main findings of this document?
                      </div>
                    </div>

                    {/* AI message */}
                    <div className="flex justify-start">
                      <div className="rounded-xl rounded-tl-none border border-slate-200 bg-slate-50/70 p-3 text-slate-800 max-w-[95%] space-y-1.5 text-[11px]">
                        <p className="font-semibold text-slate-900">Summary of Key Findings:</p>
                        <p>• Net Revenue reached $42.8M (+28% YoY growth).</p>
                        <p>• Gross profit margin expanded to 74.2%.</p>
                        <p>• European expansion delivered 41% ARR surge.</p>
                        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex cursor-pointer items-center gap-1 rounded bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold text-blue-800 border border-blue-200">
                            Source · Page 1
                          </span>
                          <span className="inline-flex cursor-pointer items-center gap-1 rounded bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold text-blue-800 border border-blue-200">
                            Source · Page 3
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value="Ask anything about this document..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400"
                    />
                    <button className="absolute right-1.5 top-1.5 rounded-md bg-blue-600 p-1 text-white">
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-28 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to work with documents.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              A comprehensive suite of intelligent document tools engineered for speed, accuracy, and enterprise reliability.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuresList.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigateToTool(feat.view)}
                  className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs transition-all hover:border-slate-300 hover:shadow-md cursor-pointer"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline">
                    <span>{feat.action}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. AI PDF CHAT SHOWCASE */}
      <section id="ai-chat" className="py-20 sm:py-28 bg-[#fafbfc] border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200/80">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Grounded Citations</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-tight">
                Talk to your documents.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Ask questions and get answers grounded in the content of your PDFs. Never wonder where an insight originated — every claim links directly to the exact page.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Verifiable source citations:</strong> Click any badge to highlight original paragraphs.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Multi-page comprehension:</strong> Synthesizes data across 500+ page contracts and manuals.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Strict hallucination containment:</strong> Relies exclusively on your uploaded text.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onStartForFree}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  <span>Try AI PDF Chat</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right Chat Interactive Showcase */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-lg text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Commercial_Lease_Agreement.pdf</p>
                    <p className="text-[10px] text-slate-400">8 Pages · Processed with OCR</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                  Grounding: 100%
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-none bg-blue-600 px-4 py-2.5 text-white max-w-[80%] shadow-2xs">
                    What are the main financial terms and tenant improvement allowances?
                  </div>
                </div>

                {/* AI Response with clickable citations */}
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-slate-50/70 p-4 text-slate-800 max-w-[95%] space-y-2.5 shadow-2xs">
                    <p className="font-semibold text-slate-900 text-xs">
                      Summary of Key Commercial Terms:
                    </p>

                    <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-700">
                      <p>
                        • <strong>Base Rent:</strong> Initial Year 1 rent is set at <strong>$148,750 per month</strong> ($42.00 / sq ft) with a 3.0% annual compounding escalation for years 2 through 5.
                      </p>
                      <p>
                        • <strong>Tenant Improvement Allowance:</strong> Landlord provides a non-repayable TI allowance of <strong>$65.00 per sq ft ($2,762,500 total)</strong>.
                      </p>
                      <p>
                        • <strong>Security Deposit:</strong> An irrevocable Letter of Credit for $446,250 (3 months rent) is required upon execution.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-medium text-slate-400">Source References:</span>
                      <button 
                        onClick={() => onNavigateToTool('viewer')}
                        className="inline-flex items-center gap-1 rounded bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        Source · Page 1
                      </button>
                      <button 
                        onClick={() => onNavigateToTool('viewer')}
                        className="inline-flex items-center gap-1 rounded bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        Source · Page 2
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DOCUMENT INTELLIGENCE WORKFLOW */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Document Intelligence Architecture
            </h2>
            <p className="mt-4 text-base text-slate-600">
              How PDFMind AI turns unstructured document files into instant conversational answers.
            </p>
          </div>

          {/* Workflow Sequence Cards */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-5 relative">
            {[
              {
                step: '01',
                title: 'Upload Document',
                subtitle: 'PDF, DOCX, Images',
                icon: FilePlus,
                tech: 'Client Encryption'
              },
              {
                step: '02',
                title: 'Extract & Process',
                subtitle: 'OCR & Parsing',
                icon: ScanLine,
                tech: 'Neural Vision'
              },
              {
                step: '03',
                title: 'Understand Content',
                subtitle: 'Vector Embeddings',
                icon: Cpu,
                tech: 'HNSW Graph'
              },
              {
                step: '04',
                title: 'Semantic Search',
                subtitle: 'RAG Retrieval',
                icon: Search,
                tech: 'Cosine Matching'
              },
              {
                step: '05',
                title: 'AI Response',
                subtitle: 'Cited Answers',
                icon: Sparkles,
                tech: 'Gemini 3.7 Flash'
              }
            ].map((node, i) => {
              const NodeIcon = node.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-xl border border-slate-200 bg-[#fafbfc] p-5 shadow-2xs text-center transition-all hover:border-blue-300 hover:bg-white"
                >
                  <span className="text-[10px] font-bold text-blue-600 tracking-wider">
                    STEP {node.step}
                  </span>
                  <div className="my-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-600 shadow-xs">
                    <NodeIcon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                  <p className="mt-1 text-[11px] text-slate-500">{node.subtitle}</p>
                  <span className="mt-3 inline-block rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                    {node.tech}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PDF TOOLS GRID SECTION */}
      <section id="pdf-tools" className="py-20 sm:py-28 bg-[#fafbfc] border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-4xl">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                PDF Tools & Utilities
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Essential document manipulation tools engineered for zero file quality loss.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTool('tools')}
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
            >
              <span>Explore all tools</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pdfToolsGrid.map((tool, idx) => {
              const ToolIcon = tool.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigateToTool('tools')}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ToolIcon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-normal">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span>Open Tool</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Three simple steps from raw document upload to AI-powered intelligence.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
            <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-8 shadow-2xs">
              <span className="text-3xl font-black text-slate-300 font-mono">01</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Upload</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Drag and drop your PDF, DOCX, presentation, or scanned image directly into the workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-8 shadow-2xs">
              <span className="text-3xl font-black text-blue-300 font-mono">02</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Understand</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                PDFMind AI automatically parses text, runs high-precision OCR, and generates semantic vector indices.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-[#fafbfc] p-8 shadow-2xs">
              <span className="text-3xl font-black text-slate-300 font-mono">03</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Work With It</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Chat, summarize, search, translate, convert, merge, compress, or export with instant verifiable citations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-20 sm:py-28 bg-[#fafbfc] border-b border-slate-200/70">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Everything you need to know about PDFMind AI features and security.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-slate-900 hover:text-blue-600"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. ABOUT & FOOTER */}
      <footer className="bg-white py-14 text-slate-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 pb-12 border-b border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs">
                  P
                </div>
                <span className="text-sm font-semibold text-slate-900">PDFMind AI</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The modern AI-powered PDF and document management workspace designed for speed, precision, and privacy.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Product</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-blue-600">Features</a></li>
                <li><a href="#ai-chat" className="hover:text-blue-600">AI PDF Chat</a></li>
                <li><a href="#pdf-tools" className="hover:text-blue-600">PDF Tools</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600">How It Works</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Capabilities</p>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => onNavigateToTool('summarizer')} className="hover:text-blue-600">AI Summarizer</button></li>
                <li><button onClick={() => onNavigateToTool('ocr')} className="hover:text-blue-600">OCR Extraction</button></li>
                <li><button onClick={() => onNavigateToTool('translate')} className="hover:text-blue-600">Translation</button></li>
                <li><button onClick={() => onNavigateToTool('search')} className="hover:text-blue-600">Semantic Search</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Support</p>
              <ul className="space-y-2 text-xs">
                <li><a href="#faq" className="hover:text-blue-600">FAQ</a></li>
                <li>
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="hover:text-blue-600 text-left"
                  >
                    Contact Support
                  </button>
                </li>
                <li><span className="text-slate-400">Security & Compliance</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2025 PDFMind AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Enterprise Grade Security</span>
              <span>AES-256 Encryption</span>
              <span>SOC-2 Ready</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Contact PDFMind AI Support</h3>
              </div>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setContactSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="text-xs font-semibold text-slate-900">Message Received</p>
                <p className="text-[11px] text-slate-500">
                  Our engineering and support team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="mt-4 space-y-3 text-xs"
              >
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    defaultValue="Alex Morgan"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    defaultValue="alex.morgan@enterprise.ai"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">How can we help?</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your question or feedback..."
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
