import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { DocumentItem, FileType, ProcessingStatus } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  size: string;
  sizeBytes: number;
  type: FileType;
  progress: number;
  status: ProcessingStatus;
  statusText: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newItems: UploadQueueItem[] = Array.from(fileList).map((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileType: FileType = ['pdf', 'docx', 'pptx', 'xlsx', 'png', 'jpg'].includes(ext)
        ? (ext as FileType)
        : 'pdf';

      return {
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        sizeBytes: f.size,
        type: fileType,
        progress: 15,
        status: 'uploading',
        statusText: 'Uploading document...',
      };
    });

    setQueue((prev) => [...prev, ...newItems]);

    // Simulate multi-stage pipeline: Uploading -> Processing -> Indexing -> Ready
    newItems.forEach((item) => {
      simulateProcessing(item);
    });
  };

  const simulateProcessing = (item: UploadQueueItem) => {
    // Stage 1: Uploading (0 - 40%)
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, progress: 45, status: 'processing', statusText: 'Running OCR & Text Extraction...' }
            : i
        )
      );
    }, 900);

    // Stage 2: Indexing (45 - 85%)
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, progress: 85, status: 'indexing', statusText: 'Building Vector Index & Embeddings...' }
            : i
        )
      );
    }, 1800);

    // Stage 3: Ready (100%)
    setTimeout(() => {
      const estimatedPages = Math.max(1, Math.round(item.sizeBytes / 300000));
      const cleanTitle = item.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
        fileName: item.name,
        fileSize: item.size,
        fileSizeBytes: item.sizeBytes,
        fileType: item.type,
        totalPages: estimatedPages,
        uploadDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        status: 'ready',
        isFavorite: false,
        isShared: false,
        isTrash: false,
        owner: 'Alex Morgan (You)',
        permission: 'edit',
        category: item.name.toLowerCase().includes('report') ? 'Financial' : 'General',
        summary: `Automated summary for ${item.name}. Content parsed and indexed successfully.`,
        pages: [
          {
            pageNumber: 1,
            title: 'Uploaded Document Content',
            content: `Document: ${item.name}\nSize: ${item.size}\nProcessed via PDFMind AI Neural Engine.\n\nSection 1: Overview\nThis document has been ingested, OCR-transcribed, and indexed for conversational AI and semantic search.`,
            highlights: ['Processed via PDFMind AI', 'OCR-transcribed and indexed'],
          },
        ],
      };

      setQueue((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, progress: 100, status: 'ready', statusText: 'Ready for AI Workspace' }
            : i
        )
      );

      onUploadSuccess(newDoc);
    }, 2800);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Upload & Process Documents
            </h3>
            <p className="text-xs text-slate-500">
              Documents are encrypted, OCR-extracted, and indexed automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50'
              : 'border-slate-300 bg-slate-50/40 hover:border-blue-500 hover:bg-blue-50/20'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.pptx,.xlsx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs mb-3">
            <UploadCloud className="h-6 w-6" />
          </div>

          <h4 className="text-sm font-semibold text-slate-900">Drop your files here</h4>
          <p className="mt-1 text-xs text-slate-500">or click to browse from your device</p>
          <p className="mt-2 text-[10px] font-medium text-slate-400">
            Supports PDF, DOCX, PPTX, XLSX, PNG, JPG (Up to 100MB per file)
          </p>
        </div>

        {/* Upload Processing List */}
        {queue.length > 0 && (
          <div className="mt-6 space-y-3 max-h-56 overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-slate-700">Uploaded Documents</p>
            {queue.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.status === 'ready' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-600">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {item.progress}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Status Text */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status === 'ready' ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{item.statusText}</span>
                    <span className="text-slate-400">
                      {item.status === 'uploading' && 'Step 1 of 3: Upload'}
                      {item.status === 'processing' && 'Step 2 of 3: OCR & Parsing'}
                      {item.status === 'indexing' && 'Step 3 of 3: Vector Indexing'}
                      {item.status === 'ready' && 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {queue.some((q) => q.status === 'ready') ? 'Done' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};
