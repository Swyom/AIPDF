import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  FileText,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';
import { DocumentItem, AppView } from '../../types';
import { searchDocumentsAi } from '../../services/aiService';

interface SemanticSearchViewProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem, view?: AppView) => void;
}

export const SemanticSearchView: React.FC<SemanticSearchViewProps> = ({
  documents,
  onSelectDocument,
}) => {
  const activeDocs = documents.filter((d) => !d.isTrash);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const exampleQueries = [
    'What was the total revenue growth in 2024?',
    'Find our AI governance policies and compliance rules',
    'What are the solar energy payback estimates?',
    'What is the tenant improvement allowance?',
  ];

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setIsSearching(true);
    setHasSearched(true);
    if (searchQuery) setQuery(searchQuery);

    const results = await searchDocumentsAi(q, activeDocs);
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-5 text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          AI Semantic Search
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Search across your entire document repository using natural language questions and vector embeddings
        </p>
      </div>

      {/* Search Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs text-left">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question across all your documents (e.g. 'What is our Q3 profit margin?')..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-32 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className="absolute right-2 top-2 flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs"
          >
            {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {/* Example Queries */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Try asking:</span>
          {exampleQueries.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSearch(ex)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {isSearching ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <h3 className="text-xs font-semibold text-slate-900">
            Scanning vector embeddings across {activeDocs.length} documents...
          </h3>
        </div>
      ) : hasSearched ? (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Found {searchResults.length} Relevant Document Matches
            </h3>
            <span className="text-[11px] text-slate-500">Ranked by Cosine Similarity</span>
          </div>

          <div className="space-y-3">
            {searchResults.map((res) => {
              const matchedDoc = activeDocs.find((d) => d.id === res.docId) || activeDocs[0];
              return (
                <div
                  key={res.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer" onClick={() => onSelectDocument(matchedDoc, 'viewer')}>
                          {res.docTitle}
                        </h4>
                        <p className="text-[10px] text-slate-400">Page {res.pageNumber} · {matchedDoc.category}</p>
                      </div>
                    </div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/80">
                      {res.score}% Match
                    </span>
                  </div>

                  <p className="rounded-lg bg-slate-50/80 border border-slate-100 p-3 text-xs text-slate-700 leading-relaxed font-sans">
                    {res.snippet}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-3 text-xs">
                    <button
                      onClick={() => onSelectDocument(matchedDoc, 'viewer')}
                      className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900"
                    >
                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                      <span>View in Context (Page {res.pageNumber})</span>
                    </button>
                    <button
                      onClick={() => onSelectDocument(matchedDoc, 'chat')}
                      className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Ask AI About This</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
          <Search className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p>Type a query or choose one of the suggestions above to search your documents.</p>
        </div>
      )}
    </div>
  );
};
