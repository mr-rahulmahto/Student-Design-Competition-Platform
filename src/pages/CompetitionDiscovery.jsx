import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CompetitionCard } from '../components/CompetitionCard';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Bookmark, 
  ArrowUpDown, 
  PlusCircle,
  X
} from 'lucide-react';

export const CompetitionDiscovery = () => {
  const { 
    competitions, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    savedCompetitions,
    navigateTo,
    user
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Open', 'Closing Soon', 'Upcoming'
  const [sortBy, setSortBy] = useState('closingSoon'); // 'closingSoon', 'prize', 'newest'
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const categories = [
    'All',
    'UI/UX Design',
    'Product/Industrial',
    'Graphic & Brand',
    'Architecture',
    'Service Design'
  ];

  // Filtering Logic
  const filteredCompetitions = competitions.filter(comp => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      !query ||
      comp.title.toLowerCase().includes(query) ||
      comp.organizer.toLowerCase().includes(query) ||
      (comp.tags && comp.tags.some(tag => tag.toLowerCase().includes(query)));

    // Category
    const matchesCategory = selectedCategory === 'All' || comp.category === selectedCategory;

    // Status
    const matchesStatus = statusFilter === 'All' || comp.status === statusFilter;

    // Saved bookmark filter
    const matchesSaved = !showSavedOnly || savedCompetitions.includes(comp.id);

    return matchesSearch && matchesCategory && matchesStatus && matchesSaved;
  }).sort((a, b) => {
    if (sortBy === 'closingSoon') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === 'newest') {
      return new Date(b.startDate || '2026-07-01') - new Date(a.startDate || '2026-07-01');
    }
    return 0;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-12 text-white shadow-md">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-indigo-100 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>National & International Student Challenges</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight leading-tight">
            Discover & Launch Your <span className="text-indigo-300">Design Impact</span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-sans max-w-2xl">
            Centralized competition portal curated for student creators. Discover opportunity briefs from <strong className="text-white">NID</strong>, <strong className="text-white">World Design Organization</strong>, <strong className="text-white">Unified Mentor</strong>, and global design leaders.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs text-indigo-200 block font-medium">Active Briefs</span>
              <span className="text-2xl font-black text-white font-mono">{competitions.length}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs text-indigo-200 block font-medium">Total Prize Pool</span>
              <span className="text-2xl font-black text-amber-300 font-mono">₹5.5L+</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs text-indigo-200 block font-medium">Verified Hosts</span>
              <span className="text-2xl font-black text-white font-mono">6 Orgs</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs text-indigo-200 block font-medium">Student Entries</span>
              <span className="text-2xl font-black text-emerald-300 font-mono">1,420+</span>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div className="mt-6 pt-6 border-t border-white/15 flex justify-end">
            <button
              onClick={() => navigateTo('admin')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish New Competition (Admin)</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="space-y-4">
        
        {/* Category Pills Slider */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const count = cat === 'All' 
              ? competitions.length 
              : competitions.filter(c => c.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Inputs */}
        <div className="surface-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, tag or host..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full app-input pl-9 pr-8 py-2 rounded-xl text-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Status Filter */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="app-input px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open for Entries</option>
                <option value="Closing Soon">Closing Soon</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="app-input px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                <option value="closingSoon">Closing Soonest</option>
                <option value="newest">Newest Listed</option>
              </select>
            </div>

            {/* Bookmarked Only Toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                showSavedOnly
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-indigo-600 text-indigo-600' : ''}`} />
              <span>Saved ({savedCompetitions.length})</span>
            </button>

          </div>

        </div>

      </div>

      {/* Grid of Competitions */}
      {filteredCompetitions.length === 0 ? (
        <div className="surface-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">No Competitions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any competitions matching your current category or search criteria. Try adjusting your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStatusFilter('All');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map(comp => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      )}

    </div>
  );
};
