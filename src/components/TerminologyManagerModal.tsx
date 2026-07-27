import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Download, 
  Upload, 
  X, 
  Check, 
  Copy, 
  Filter, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight, 
  BarChart2, 
  ShieldAlert, 
  Sliders, 
  RotateCcw,
  Sparkles,
  Layers,
  Globe,
  Book,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  TerminologyRule, 
  IgnoreTerm, 
  TermCategory, 
  TERMINOLOGY_CATEGORIES 
} from '../types/terminology';
import { testTerminologyPreview } from '../utils/terminology';

interface TerminologyManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: TerminologyRule[];
  setRules: React.Dispatch<React.SetStateAction<TerminologyRule[]>>;
  ignoreTerms: IgnoreTerm[];
  setIgnoreTerms: React.Dispatch<React.SetStateAction<IgnoreTerm[]>>;
  currentBookTitle: string;
  isTerminologyEnabled: boolean;
  setIsTerminologyEnabled: (enabled: boolean) => void;
  showNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const TerminologyManagerModal: React.FC<TerminologyManagerModalProps> = ({
  isOpen,
  onClose,
  rules,
  setRules,
  ignoreTerms,
  setIgnoreTerms,
  currentBookTitle,
  isTerminologyEnabled,
  setIsTerminologyEnabled,
  showNotification
}) => {
  // Main Tab State
  const [activeTab, setActiveTab] = useState<'rules' | 'ignore' | 'preview' | 'stats'>('rules');
  
  // Scope Filter: 'all' | 'global' | 'novel'
  const [scopeFilter, setScopeFilter] = useState<'all' | 'global' | 'novel'>('all');
  
  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Search Query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sorting: 'alpha' | 'recent' | 'matches'
  const [sortBy, setSortBy] = useState<'alpha' | 'recent' | 'matches'>('recent');

  // Collapsed Category Accordions State
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Bulk Selection
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);

  // Add / Edit Rule Form Drawer State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [formOriginal, setFormOriginal] = useState('');
  const [formReplacement, setFormReplacement] = useState('');
  const [formCategory, setFormCategory] = useState<TermCategory>('Characters');
  const [formScope, setFormScope] = useState<'global' | 'novel'>('global');
  const [formIsCaseAware, setFormIsCaseAware] = useState(true);
  const [formWholeWord, setFormWholeWord] = useState(true);

  // Ignore Term Form State
  const [newIgnoreInput, setNewIgnoreInput] = useState('');

  // Live Tester Sample Text
  const [sampleTesterText, setSampleTesterText] = useState(
    `Lune walked into the cathedral of the Steam Church located inside the Black Forest. Luo En used Spirit Vision to sense the Machine Spirit.`
  );

  // Bulk Move Category Select
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState<TermCategory>('Characters');

  // Toggle Category Collapse
  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const safeRules = useMemo(() => Array.isArray(rules) ? rules.filter(Boolean) : [], [rules]);
  const safeIgnoreTerms = useMemo(() => Array.isArray(ignoreTerms) ? ignoreTerms.filter(Boolean) : [], [ignoreTerms]);

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return safeRules.filter(r => {
      if (!r || typeof r !== 'object') return false;
      const orig = typeof r.original === 'string' ? r.original : '';
      const repl = typeof r.replacement === 'string' ? r.replacement : '';
      const cat = typeof r.category === 'string' ? r.category : 'Other';
      const scope = r.scope || 'global';

      // Scope filter
      if (scopeFilter === 'global' && scope !== 'global') return false;
      if (scopeFilter === 'novel' && (scope !== 'novel' || (r.bookTitle || '') !== (currentBookTitle || ''))) return false;

      // Category filter
      if (selectedCategory !== 'all' && cat !== selectedCategory) return false;

      // Search query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchOrig = orig.toLowerCase().includes(q);
        const matchRepl = repl.toLowerCase().includes(q);
        const matchCat = cat.toLowerCase().includes(q);
        return matchOrig || matchRepl || matchCat;
      }

      return true;
    }).sort((a, b) => {
      const aOrig = typeof a?.original === 'string' ? a.original : '';
      const bOrig = typeof b?.original === 'string' ? b.original : '';
      const aMatches = typeof a?.matchCount === 'number' ? a.matchCount : 0;
      const bMatches = typeof b?.matchCount === 'number' ? b.matchCount : 0;
      const aCreated = typeof a?.createdAt === 'number' ? a.createdAt : 0;
      const bCreated = typeof b?.createdAt === 'number' ? b.createdAt : 0;

      if (sortBy === 'alpha') {
        return aOrig.localeCompare(bOrig);
      }
      if (sortBy === 'matches') {
        return bMatches - aMatches;
      }
      return bCreated - aCreated; // recent
    });
  }, [safeRules, scopeFilter, currentBookTitle, selectedCategory, searchQuery, sortBy]);

  // Group Rules by Category
  const groupedRules = useMemo(() => {
    const map: Record<TermCategory, TerminologyRule[]> = {
      Characters: [],
      Places: [],
      Organizations: [],
      Skills: [],
      Items: [],
      Titles: [],
      Creatures: [],
      Other: []
    };

    filteredRules.forEach(r => {
      if (!r) return;
      const cat = (r.category && map[r.category]) ? r.category : 'Other';
      map[cat].push(r);
    });

    return map;
  }, [filteredRules]);

  // Open Form for Add
  const handleOpenAddForm = () => {
    setEditingRuleId(null);
    setFormOriginal('');
    setFormReplacement('');
    setFormCategory('Characters');
    setFormScope('global');
    setFormIsCaseAware(true);
    setFormWholeWord(true);
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEditForm = (rule: TerminologyRule) => {
    setEditingRuleId(rule.id);
    setFormOriginal(rule.original);
    setFormReplacement(rule.replacement);
    setFormCategory(rule.category);
    setFormScope(rule.scope);
    setFormIsCaseAware(rule.isCaseAware);
    setFormWholeWord(rule.wholeWord);
    setIsFormOpen(true);
  };

  // Save Rule (Add or Edit)
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOriginal.trim() || !formReplacement.trim()) {
      showNotification('Please fill in both original and replacement terms', 'error');
      return;
    }

    if (editingRuleId) {
      // Edit
      setRules(prev => prev.map(r => r.id === editingRuleId ? {
        ...r,
        original: formOriginal.trim(),
        replacement: formReplacement.trim(),
        category: formCategory,
        scope: formScope,
        bookTitle: formScope === 'novel' ? currentBookTitle : undefined,
        isCaseAware: formIsCaseAware,
        wholeWord: formWholeWord
      } : r));
      showNotification(`Updated term: ${formOriginal.trim()}`);
    } else {
      // Add
      const newRule: TerminologyRule = {
        id: `term-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        original: formOriginal.trim(),
        replacement: formReplacement.trim(),
        category: formCategory,
        enabled: true,
        scope: formScope,
        bookTitle: formScope === 'novel' ? currentBookTitle : undefined,
        isCaseAware: formIsCaseAware,
        wholeWord: formWholeWord,
        matchCount: 0,
        createdAt: Date.now()
      };
      setRules(prev => [newRule, ...prev]);
      showNotification(`Added terminology rule: ${formOriginal.trim()} → ${formReplacement.trim()}`);
    }

    setIsFormOpen(false);
  };

  // Toggle Rule Status
  const handleToggleRuleStatus = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  // Duplicate Rule
  const handleDuplicateRule = (rule: TerminologyRule) => {
    const dup: TerminologyRule = {
      ...rule,
      id: `term-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      original: `${rule.original} (Copy)`,
      createdAt: Date.now(),
      matchCount: 0
    };
    setRules(prev => [dup, ...prev]);
    showNotification(`Duplicated rule: ${rule.original}`);
  };

  // Delete Rule
  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    setSelectedRuleIds(prev => prev.filter(i => i !== id));
    showNotification('Rule deleted', 'info');
  };

  // Bulk Selection Toggles
  const handleSelectAll = () => {
    if (selectedRuleIds.length === filteredRules.length) {
      setSelectedRuleIds([]);
    } else {
      setSelectedRuleIds(filteredRules.map(r => r.id));
    }
  };

  const handleToggleSelectRule = (id: string) => {
    setSelectedRuleIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Bulk Actions
  const handleBulkEnable = (enable: boolean) => {
    setRules(prev => prev.map(r => selectedRuleIds.includes(r.id) ? { ...r, enabled: enable } : r));
    showNotification(`${enable ? 'Enabled' : 'Disabled'} ${selectedRuleIds.length} selected rules`);
  };

  const handleBulkDelete = () => {
    setRules(prev => prev.filter(r => !selectedRuleIds.includes(r.id)));
    showNotification(`Deleted ${selectedRuleIds.length} rules`, 'info');
    setSelectedRuleIds([]);
  };

  const handleBulkMoveCategory = () => {
    setRules(prev => prev.map(r => selectedRuleIds.includes(r.id) ? { ...r, category: bulkCategoryTarget } : r));
    showNotification(`Moved ${selectedRuleIds.length} rules to ${bulkCategoryTarget}`);
  };

  // Ignore List Operations
  const handleAddIgnoreTerm = () => {
    if (!newIgnoreInput.trim()) return;
    const term = newIgnoreInput.trim();
    const newIgnore: IgnoreTerm = {
      id: `ignore-${Date.now()}`,
      term,
      enabled: true,
      scope: 'global',
      createdAt: Date.now()
    };
    setIgnoreTerms(prev => [newIgnore, ...prev]);
    setNewIgnoreInput('');
    showNotification(`Added "${term}" to Ignore List`);
  };

  const handleDeleteIgnoreTerm = (id: string) => {
    setIgnoreTerms(prev => prev.filter(i => i.id !== id));
    showNotification('Removed term from Ignore List', 'info');
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      rules,
      ignoreTerms
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `novel-terminology-dictionary.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Exported terminology dictionary');
  };

  // Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && Array.isArray(json.rules)) {
          // Merge imported rules
          const existingIds = new Set(rules.map(r => r.id));
          const newRules = json.rules.map((r: any) => ({
            ...r,
            id: existingIds.has(r.id) ? `imported-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` : r.id
          }));
          setRules(prev => [...newRules, ...prev]);

          if (Array.isArray(json.ignoreTerms)) {
            setIgnoreTerms(prev => [...json.ignoreTerms, ...prev]);
          }

          showNotification(`Successfully imported ${newRules.length} rules!`);
        } else {
          showNotification('Invalid terminology JSON file structure', 'error');
        }
      } catch (err) {
        showNotification('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Live Tested Output
  const liveTestedOutput = useMemo(() => {
    try {
      return testTerminologyPreview(sampleTesterText || '', safeRules, safeIgnoreTerms, currentBookTitle || '');
    } catch (e) {
      console.error('Error in live testing output:', e);
      return sampleTesterText || '';
    }
  }, [sampleTesterText, safeRules, safeIgnoreTerms, currentBookTitle]);

  // Total Replacement Stats calculation
  const totalMatchesApplied = useMemo(() => {
    return safeRules.reduce((acc, r) => acc + (r && typeof r.matchCount === 'number' ? r.matchCount : 0), 0);
  }, [safeRules]);

  if (!isOpen) return null;

  return (
    <div 
      id="terminology-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="terminology-modal-dialog"
        className="w-full max-w-5xl h-[90vh] max-h-[850px] bg-[#16181D] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 select-none animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-[#FF79B0]/20 text-[#FF79B0] border border-[#FF79B0]/30 shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-white truncate">Terminology Manager</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF79B0]/20 text-[#FF79B0] font-mono border border-[#FF79B0]/30 font-extrabold uppercase">
                  Global & Per-Novel
                </span>
              </div>
              <p className="text-xs text-white/50 truncate">Auto-replace terms across all chapters dynamically without editing source text</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Master Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-xs font-bold text-white hidden sm:inline">Terminology Engine</span>
              <button
                type="button"
                onClick={() => setIsTerminologyEnabled(!isTerminologyEnabled)}
                className={`w-11 h-6 rounded-full transition-all duration-200 relative flex items-center p-0.5 cursor-pointer ${
                  isTerminologyEnabled ? 'bg-[#FF79B0]' : 'bg-white/20'
                }`}
                title={isTerminologyEnabled ? "Disable Terminology Engine" : "Enable Terminology Engine"}
              >
                <div className={`w-5 h-5 rounded-full bg-slate-900 shadow-md transition-transform duration-200 ${
                  isTerminologyEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TABS & TOOLS BAR */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'rules' 
                  ? 'bg-[#FF79B0] text-slate-950 shadow-md font-extrabold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Replacement Rules ({rules.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ignore')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ignore' 
                  ? 'bg-[#FF79B0] text-slate-950 shadow-md font-extrabold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Ignore List ({ignoreTerms.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'preview' 
                  ? 'bg-[#FF79B0] text-slate-950 shadow-md font-extrabold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Tester</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'stats' 
                  ? 'bg-[#FF79B0] text-slate-950 shadow-md font-extrabold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Statistics</span>
            </button>
          </div>

          {/* Action Buttons: Add, Import, Export */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95">
              <Upload className="w-3.5 h-3.5 text-[#FF79B0]" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#FF79B0]" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={handleOpenAddForm}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF79B0] hover:bg-[#FF79B0]/90 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          </div>
        </div>

        {/* BODY CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">

          {/* TAB 1: RULES MANAGEMENT */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {/* FILTERS & SEARCH CONTROLS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
                {/* Search Bar */}
                <div className="relative flex items-center col-span-1 sm:col-span-2 lg:col-span-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 text-white/40 pointer-events-none" />
                  <input 
                    type="text"
                    placeholder="Search terms or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#FF79B0] focus:ring-1 focus:ring-[#FF79B0]/30 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2 p-1 text-white/40 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Scope Filter */}
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setScopeFilter('all')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      scopeFilter === 'all' ? 'bg-[#FF79B0] text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    All Scopes
                  </button>
                  <button 
                    onClick={() => setScopeFilter('global')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      scopeFilter === 'global' ? 'bg-[#FF79B0] text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Global
                  </button>
                  <button 
                    onClick={() => setScopeFilter('novel')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      scopeFilter === 'novel' ? 'bg-[#FF79B0] text-slate-950' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    This Novel
                  </button>
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF79B0] cursor-pointer"
                >
                  <option value="all" className="bg-[#16181D]">All Categories</option>
                  {TERMINOLOGY_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-[#16181D]">{cat}</option>
                  ))}
                </select>

                {/* Sorting */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF79B0] cursor-pointer"
                >
                  <option value="recent" className="bg-[#16181D]">Sort: Recently Added</option>
                  <option value="alpha" className="bg-[#16181D]">Sort: Alphabetical (A-Z)</option>
                  <option value="matches" className="bg-[#16181D]">Sort: Most Matched</option>
                </select>
              </div>

              {/* BULK ACTIONS TOOLBAR */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSelectAll}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer transition-all"
                  >
                    {selectedRuleIds.length > 0 && selectedRuleIds.length === filteredRules.length ? (
                      <CheckSquare className="w-4 h-4 text-[#FF79B0]" />
                    ) : (
                      <Square className="w-4 h-4 opacity-50" />
                    )}
                    <span>Select All ({filteredRules.length})</span>
                  </button>

                  {selectedRuleIds.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF79B0]/20 text-[#FF79B0] font-mono text-[11px] font-bold border border-[#FF79B0]/30">
                      {selectedRuleIds.length} Selected
                    </span>
                  )}
                </div>

                {selectedRuleIds.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleBulkEnable(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold border border-emerald-500/30 cursor-pointer"
                    >
                      Enable
                    </button>
                    <button
                      onClick={() => handleBulkEnable(false)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold border border-amber-500/30 cursor-pointer"
                    >
                      Disable
                    </button>

                    <div className="flex items-center gap-1">
                      <select
                        value={bulkCategoryTarget}
                        onChange={(e) => setBulkCategoryTarget(e.target.value as TermCategory)}
                        className="py-1 px-2 rounded-lg bg-white/10 border border-white/15 text-white text-[11px]"
                      >
                        {TERMINOLOGY_CATEGORIES.map(c => (
                          <option key={c} value={c} className="bg-[#16181D]">{c}</option>
                        ))}
                      </select>
                      <button
                        onClick={handleBulkMoveCategory}
                        className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                      >
                        Move
                      </button>
                    </div>

                    <button
                      onClick={handleBulkDelete}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold border border-rose-500/30 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* CATEGORIES ACCORDIONS & RULE LIST */}
              {filteredRules.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <div className="p-3 rounded-2xl bg-[#FF79B0]/20 text-[#FF79B0] w-fit mx-auto border border-[#FF79B0]/30">
                    <Sliders className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-white">No Terminology Rules Found</h3>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    {searchQuery ? `No rules match "${searchQuery}". Try clearing search filters.` : 'Add your first translation replacement rule to auto-correct character names, place names, or skills.'}
                  </p>
                  <button
                    onClick={handleOpenAddForm}
                    className="px-4 py-2 rounded-xl bg-[#FF79B0] text-slate-950 font-extrabold text-xs shadow-md cursor-pointer hover:bg-[#FF79B0]/90 transition-all"
                  >
                    + Create First Term Rule
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {TERMINOLOGY_CATEGORIES.map(category => {
                    const categoryRules = groupedRules[category];
                    if (!categoryRules || categoryRules.length === 0) return null;

                    const isCollapsed = collapsedCategories[category];

                    return (
                      <div key={category} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                        {/* Category Accordion Header */}
                        <div 
                          onClick={() => toggleCategoryCollapse(category)}
                          className="p-3.5 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-between cursor-pointer border-b border-white/10 transition-all select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#FF79B0]" /> : <ChevronDown className="w-4 h-4 text-[#FF79B0]" />}
                            <span className="font-serif font-bold text-sm text-white">{category}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#FF79B0]/20 text-[#FF79B0] text-[10px] font-mono font-extrabold border border-[#FF79B0]/30">
                              {categoryRules.length}
                            </span>
                          </div>

                          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                            {isCollapsed ? 'Click to expand' : 'Click to collapse'}
                          </span>
                        </div>

                        {/* Category Rules List */}
                        {!isCollapsed && (
                          <div className="p-2 sm:p-3 space-y-2">
                            {categoryRules.map(rule => {
                              const isChecked = selectedRuleIds.includes(rule.id);
                              return (
                                <div 
                                  key={rule.id}
                                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                                    rule.enabled 
                                      ? 'bg-white/[0.02] border-white/10 hover:border-white/20' 
                                      : 'bg-black/20 border-white/5 opacity-60'
                                  }`}
                                >
                                  {/* Left: Checkbox + Target Terms */}
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <button 
                                      onClick={() => handleToggleSelectRule(rule.id)}
                                      className="p-1 text-white/50 hover:text-white cursor-pointer flex-shrink-0"
                                    >
                                      {isChecked ? <CheckSquare className="w-4 h-4 text-[#FF79B0]" /> : <Square className="w-4 h-4" />}
                                    </button>

                                    {/* Enable / Disable Toggle */}
                                    <button
                                      onClick={() => handleToggleRuleStatus(rule.id)}
                                      className={`w-8 h-4.5 rounded-full relative p-0.5 transition-all flex-shrink-0 cursor-pointer ${
                                        rule.enabled ? 'bg-emerald-500' : 'bg-white/20'
                                      }`}
                                      title={rule.enabled ? "Rule Enabled" : "Rule Disabled"}
                                    >
                                      <div className={`w-3.5 h-3.5 rounded-full bg-slate-900 shadow transition-transform ${
                                        rule.enabled ? 'translate-x-3.5' : 'translate-x-0'
                                      }`} />
                                    </button>

                                    {/* Original -> Replacement */}
                                    <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                                      <span className="font-mono text-xs font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 truncate max-w-[180px]">
                                        {rule.original}
                                      </span>
                                      <ArrowRight className="w-3.5 h-3.5 text-[#FF79B0] flex-shrink-0" />
                                      <span className="font-mono text-xs font-bold text-[#FF79B0] bg-[#FF79B0]/10 px-2.5 py-1 rounded-lg border border-[#FF79B0]/30 truncate max-w-[180px]">
                                        {rule.replacement}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right: Badges & Actions */}
                                  <div className="flex items-center gap-2 flex-wrap ml-7 sm:ml-0 flex-shrink-0">
                                    {/* Scope badge */}
                                    {rule.scope === 'global' ? (
                                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Global
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                                        <Book className="w-3 h-3" /> Novel Only
                                      </span>
                                    )}

                                    {/* Options flags */}
                                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/60 text-[10px] font-mono border border-white/10">
                                      {rule.isCaseAware ? 'Case-Aware' : 'Exact Case'}
                                    </span>

                                    {/* Matches count */}
                                    <span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-[10px] font-mono border border-white/10">
                                      {rule.matchCount} matches
                                    </span>

                                    {/* Edit, Duplicate, Delete Actions */}
                                    <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                                      <button 
                                        onClick={() => handleOpenEditForm(rule)}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                                        title="Edit Rule"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDuplicateRule(rule)}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                                        title="Duplicate Rule"
                                      >
                                        <Copy className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteRule(rule.id)}
                                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-300 transition-all cursor-pointer"
                                        title="Delete Rule"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IGNORE LIST MANAGEMENT */}
          {activeTab === 'ignore' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF79B0] uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Protected Terms (Ignore List)</span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  Words added here will <strong className="text-white">NEVER</strong> be modified by any terminology replacement rules, protecting specific names or phrases from accidental changes.
                </p>

                {/* Add Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Enter word/phrase to protect e.g. Luther..."
                    value={newIgnoreInput}
                    onChange={(e) => setNewIgnoreInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddIgnoreTerm()}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#FF79B0]"
                  />
                  <button
                    onClick={handleAddIgnoreTerm}
                    className="px-4 py-2 rounded-xl bg-[#FF79B0] text-slate-950 text-xs font-extrabold shadow-sm hover:bg-[#FF79B0]/90 transition-all cursor-pointer"
                  >
                    Protect Word
                  </button>
                </div>
              </div>

              {/* List of Protected Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {ignoreTerms.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-xs text-white/40">
                    No protected terms in ignore list.
                  </div>
                ) : (
                  ignoreTerms.map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="font-mono text-xs font-bold text-white truncate">{item.term}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteIgnoreTerm(item.id)}
                        className="p-1 rounded bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-300 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE TESTER / PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FF79B0] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Live Replacement Tester</span>
                  </div>
                  <span className="text-[10px] text-white/40">Type sample text to test terminology rules</span>
                </div>

                <textarea
                  rows={3}
                  value={sampleTesterText}
                  onChange={(e) => setSampleTesterText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-serif leading-relaxed focus:outline-none focus:border-[#FF79B0] focus:ring-1 focus:ring-[#FF79B0]/30"
                  placeholder="Type or paste sample chapter text here..."
                />
              </div>

              {/* Transformed Output Preview Card */}
              <div className="p-4 rounded-2xl bg-[#FF79B0]/10 border border-[#FF79B0]/30 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF79B0] block">
                  Transformed Output Preview
                </span>
                <p className="font-serif text-sm text-white leading-relaxed p-3 bg-slate-950/60 rounded-xl border border-white/10 select-text">
                  {liveTestedOutput || <span className="italic text-white/30">No output</span>}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: STATISTICS */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-white/50 uppercase tracking-wider block font-bold">Total Active Rules</span>
                <span className="text-2xl font-bold font-serif text-[#FF79B0]">{safeRules.filter(r => r?.enabled).length}</span>
                <span className="text-[10px] text-white/40 block">out of {safeRules.length} total defined</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-white/50 uppercase tracking-wider block font-bold">Replacements Applied</span>
                <span className="text-2xl font-bold font-serif text-emerald-400">{totalMatchesApplied}</span>
                <span className="text-[10px] text-white/40 block">tracked matches in reader</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-white/50 uppercase tracking-wider block font-bold">Protected Terms</span>
                <span className="text-2xl font-bold font-serif text-blue-400">{safeIgnoreTerms.length}</span>
                <span className="text-[10px] text-white/40 block">in ignore list</span>
              </div>

              {/* Most Frequently Replaced Terms */}
              <div className="md:col-span-3 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#FF79B0]">Most Frequently Replaced Terms</h4>
                <div className="space-y-2">
                  {[...safeRules].sort((a, b) => (b?.matchCount || 0) - (a?.matchCount || 0)).slice(0, 5).map(r => (
                    <div key={r.id} className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-white">{r.original} → {r.replacement}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FF79B0]/20 text-[#FF79B0] font-mono text-[11px] font-extrabold">
                        {r.matchCount} matches
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ADD / EDIT RULE MODAL / DRAWER OVERLAY */}
        {isFormOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <form 
              onSubmit={handleSaveRule}
              className="w-full max-w-lg rounded-2xl bg-[#16181D] border border-white/20 p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-base font-serif text-white">
                  {editingRuleId ? 'Edit Terminology Rule' : 'Add New Terminology Rule'}
                </h3>
                <button type="button" onClick={() => setIsFormOpen(false)} className="p-1 rounded-full hover:bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Original Term */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#FF79B0] uppercase tracking-wider block">Original Term</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lune"
                    value={formOriginal}
                    onChange={(e) => setFormOriginal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF79B0]"
                  />
                </div>

                {/* Replacement Term */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#FF79B0] uppercase tracking-wider block">Preferred Replacement</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rune"
                    value={formReplacement}
                    onChange={(e) => setFormReplacement(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF79B0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as TermCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF79B0] cursor-pointer"
                  >
                    {TERMINOLOGY_CATEGORIES.map(c => (
                      <option key={c} value={c} className="bg-[#16181D]">{c}</option>
                    ))}
                  </select>
                </div>

                {/* Scope */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">Rule Scope</label>
                  <select
                    value={formScope}
                    onChange={(e) => setFormScope(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF79B0] cursor-pointer"
                  >
                    <option value="global" className="bg-[#16181D]">Global (All Novels)</option>
                    <option value="novel" className="bg-[#16181D]">Novel Only ({currentBookTitle})</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsCaseAware}
                    onChange={(e) => setFormIsCaseAware(e.target.checked)}
                    className="accent-[#FF79B0]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Case-Aware</span>
                    <span className="text-[10px] text-white/40 block">Preserves case (Rune, rune, RUNE)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formWholeWord}
                    onChange={(e) => setFormWholeWord(e.target.checked)}
                    className="accent-[#FF79B0]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Whole Word</span>
                    <span className="text-[10px] text-white/40 block">Prevents partial matching inside words</span>
                  </div>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF79B0] hover:bg-[#FF79B0]/90 text-slate-950 text-xs font-extrabold shadow-md cursor-pointer"
                >
                  {editingRuleId ? 'Update Rule' : 'Save Rule'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
