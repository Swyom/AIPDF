import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { HELP_ARTICLES, FAQ_ITEMS, HELP_CATEGORIES } from '../../data/helpArticles';

export const HelpCenterView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics' },
    ...HELP_CATEGORIES.map((c) => ({ id: c.id, name: c.name })),
  ];

  const filteredArticles = HELP_ARTICLES.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory !== 'all' && art.categoryId !== activeCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 text-left">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-linear-to-b from-blue-50/50 to-white p-6 sm:p-8 text-center shadow-2xs">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          How can we help you?
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-lg mx-auto">
          Explore documentation, user guides, and FAQs for working with PDFMind AI
        </p>

        {/* Search Bar */}
        <div className="relative mt-5 max-w-xl mx-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, tools, shortcuts, and troubleshooting..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-lg px-3.5 py-1.5 font-medium capitalize transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-4">Knowledge Base Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 capitalize">
                  {art.categoryId.replace('-', ' ')}
                </span>
                <span className="text-[10px] text-slate-400">{art.readTime}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900">{art.title}</h4>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{art.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
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
                  className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold text-slate-900 hover:text-blue-600"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Need more help banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Our support engineers are available to assist with document formats and enterprise setups.
          </p>
        </div>
        <button
          onClick={() => setShowSupportModal(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shrink-0 shadow-2xs"
        >
          Contact Support
        </button>
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Contact Support</h3>
              </div>
              <button
                onClick={() => {
                  setShowSupportModal(false);
                  setSupportSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            {supportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="text-xs font-semibold text-slate-900">Support Ticket Created</p>
                <p className="text-[11px] text-slate-500">
                  We'll reply to your account email within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSupportSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about OCR on low-contrast files"
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what you are trying to accomplish..."
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
