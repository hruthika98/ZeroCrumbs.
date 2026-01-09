
import React, { useState, useMemo } from 'react';
import { FoodListing, ListingStatus, UserRole } from '../types';
import FoodCard from '../components/FoodCard';
import { Search, Filter, Map, List as ListIcon, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

interface ListingsProps {
  listings: FoodListing[];
  onClaim: (id: string) => void;
  userRole?: UserRole;
}

const Listings: React.FC<ListingsProps> = ({ listings, onClaim, userRole }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const categories = ['All', ...new Set(listings.map(l => l.category))];

  const filtered = useMemo(() => {
    return listings.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'All' || l.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, filterCategory, listings]);

  const handleClaimInitiate = (id: string) => {
    if (userRole !== UserRole.NGO) {
      alert("Only verified NGOs / Food Banks can claim surplus food.");
      return;
    }
    setClaimingId(id);
  };

  const confirmClaim = () => {
    if (claimingId) {
      onClaim(claimingId);
      setClaimingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-in fade-in duration-700">
      {/* Confirmation Modal */}
      {claimingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setClaimingId(null)}></div>
          <div className="relative bg-white rounded-[3rem] p-12 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-terracotta/10 rounded-[2rem] flex items-center justify-center text-terracotta mb-8 mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="heading-serif text-4xl text-center text-charcoal mb-4">Claim this Surplus?</h3>
            <p className="text-charcoal/50 text-center font-medium mb-10 leading-relaxed">
              By claiming this item, it will be locked exclusively for your NGO / Food Bank. You will receive a unique OTP to verify collection at the donor's location.
            </p>
            <div className="flex flex-col gap-4">
              <button onClick={confirmClaim} className="w-full bg-terracotta text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-terracotta/20 hover:bg-terracotta/90 transition-all">Confirm & Generate OTP</button>
              <button onClick={() => setClaimingId(null)} className="w-full text-charcoal/40 font-black uppercase tracking-widest text-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
        <div>
          <p className="text-terracotta font-black uppercase tracking-widest text-[10px] mb-4">Live Discovery</p>
          <h1 className="heading-serif text-6xl text-charcoal">Redistribute Surplus.</h1>
          <p className="text-charcoal/40 text-lg font-medium max-w-lg mt-4">Connecting surplus with community kitchens and NGOs / Food Banks in real-time.</p>
        </div>

        <div className="flex items-center bg-white p-2 rounded-3xl shadow-xl shadow-charcoal/5 border border-charcoal/5">
            <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20' : 'text-charcoal/30 hover:text-charcoal'}`}
            >
                <ListIcon size={14} className="mr-2" /> Feed View
            </button>
            <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-charcoal text-white shadow-lg shadow-charcoal/20' : 'text-charcoal/30 hover:text-charcoal'}`}
            >
                <Map size={14} className="mr-2" /> Local Map
            </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border border-charcoal/5 shadow-2xl shadow-charcoal/5 mb-20">
        <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-grow relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-terracotta transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by food name, donor, or ingredients..." 
                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-sand border-none outline-none focus:ring-2 focus:ring-terracotta/10 text-charcoal font-bold transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex items-center space-x-4 lg:w-1/3">
                <div className="relative w-full">
                    <select 
                        className="w-full bg-sand px-8 py-5 rounded-2xl border-none outline-none text-charcoal font-black uppercase tracking-widest text-xs appearance-none cursor-pointer"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal/30 pointer-events-none" />
                </div>
            </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filtered.length > 0 ? (
            filtered.map(food => (
              <FoodCard key={food.id} food={food} onViewDetails={handleClaimInitiate} />
            ))
          ) : (
            <div className="col-span-full py-40 text-center">
              <div className="w-24 h-24 bg-sand rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search size={40} className="text-charcoal/10" />
              </div>
              <h3 className="heading-serif text-3xl mb-4 text-charcoal">No Surplus Found.</h3>
              <p className="text-charcoal/40 font-medium max-w-md mx-auto">Try widening your search radius or changing the food category filter.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[700px] w-full bg-sand rounded-[4rem] flex items-center justify-center border border-charcoal/5 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200')` }}></div>
            <div className="relative z-10 bg-white/95 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl max-w-md text-center border border-white">
                <MapPin size={64} className="text-terracotta mx-auto mb-8" />
                <h3 className="heading-serif text-4xl text-charcoal mb-6 leading-tight">Interactive <br/>Radius View.</h3>
                <p className="text-charcoal/40 font-medium mb-10 leading-relaxed text-lg">Visualize exactly where surplus food exists relative to your kitchen. Red hotspots indicate urgent pickups.</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
