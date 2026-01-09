
import React from 'react';
import { FoodListing, FreshnessStatus, ListingStatus, UserRole } from '../types';
import { MapPin, Clock, Info, ShieldCheck, Heart, Zap, CheckCircle2 } from 'lucide-react';

interface FoodCardProps {
  food: FoodListing;
  onViewDetails: (id: string) => void;
  userRole?: UserRole;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onViewDetails, userRole }) => {
  const getStatusStyles = (status: FreshnessStatus) => {
    switch (status) {
      case FreshnessStatus.URGENT:
        return 'bg-red-500 text-white border-red-600';
      case FreshnessStatus.USE_SOON:
        return 'bg-wheat text-charcoal border-wheat';
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const isClaimed = food.status === ListingStatus.CLAIMED;
  const isCollected = food.status === ListingStatus.COLLECTED;

  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden border border-charcoal/5 hover:border-terracotta/20 hover:shadow-2xl transition-all group flex flex-col h-full ${isClaimed || isCollected ? 'opacity-90' : ''}`}>
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={food.imageUrl} 
          alt={food.name} 
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ${isClaimed || isCollected ? 'grayscale' : ''}`}
        />
        
        {isCollected ? (
          <div className="absolute inset-0 bg-emerald-600/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white px-6 py-2 rounded-full shadow-2xl flex items-center space-x-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">Redistributed</span>
            </div>
          </div>
        ) : isClaimed ? (
          <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center">
             <div className="bg-white px-6 py-2 rounded-full shadow-2xl flex items-center space-x-2">
              <Clock size={16} className="text-terracotta animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">Awaiting Collection</span>
            </div>
          </div>
        ) : (
          <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${getStatusStyles(food.freshness)}`}>
            {food.freshness === FreshnessStatus.URGENT ? 'Pickup Urgently' : food.freshness}
          </div>
        )}

        <div className="absolute top-5 right-5 flex space-x-2">
            <button className="p-2.5 bg-white/90 backdrop-blur rounded-full text-charcoal/20 hover:text-terracotta transition-all shadow-md group/heart">
                <Heart size={18} fill="currentColor" className="group-hover/heart:scale-125 transition-transform" />
            </button>
        </div>

        {!isCollected && !isClaimed && (
          <div className="absolute bottom-4 left-5 right-5">
              <div className="bg-charcoal/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center text-white text-[10px] font-bold uppercase tracking-wider">
                      <Clock size={12} className="mr-2 text-black font-black" />
                      Available for {food.availableUntil}
                  </div>
                  {food.verified && (
                      <div className="flex items-center text-wheat text-[10px] font-black uppercase">
                          <ShieldCheck size={12} className="mr-1" />
                          Verified
                      </div>
                  )}
              </div>
          </div>
        )}
      </div>

      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-black text-charcoal leading-tight group-hover:text-terracotta transition-colors">
            {food.name}
            </h3>
            <span className="text-[10px] font-black text-charcoal/30 bg-charcoal/5 px-2 py-1 rounded uppercase tracking-tighter ml-4">{food.category}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            {food.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-terracotta/5 text-terracotta rounded text-[10px] font-black uppercase tracking-wider">
                    {tag}
                </span>
            ))}
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-start text-charcoal/50 text-xs font-medium">
            <MapPin size={14} className="mr-3 text-black font-black mt-0.5" />
            <span className="truncate">{food.location.address}</span>
          </div>
          <div className="flex items-center text-charcoal/50 text-xs font-medium">
            <Zap size={14} className="mr-3 text-black font-black" />
            <span>Listed by <strong className="text-charcoal">{food.donorName}</strong></span>
          </div>
        </div>

        <div className="bg-sand p-4 rounded-2xl mb-8 flex justify-between items-center">
            <div className="text-center flex-1">
                <p className="text-[10px] text-charcoal/40 font-black uppercase">Cals</p>
                <p className="text-sm font-black text-charcoal leading-none">{food.nutrition.calories}</p>
            </div>
            <div className="w-px h-6 bg-charcoal/10"></div>
            <div className="text-center flex-1">
                <p className="text-[10px] text-charcoal/40 font-black uppercase">Protein</p>
                <p className="text-sm font-black text-charcoal leading-none">{food.nutrition.protein}g</p>
            </div>
            <div className="w-px h-6 bg-charcoal/10"></div>
            <div className="text-center flex-1">
                <p className="text-[10px] text-charcoal/40 font-black uppercase">Qty</p>
                <p className="text-sm font-black text-charcoal leading-none truncate">{food.quantity}</p>
            </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-charcoal/5">
            <button 
                onClick={() => onViewDetails(food.id)}
                disabled={isClaimed || isCollected}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-[0.98] ${
                  isClaimed || isCollected 
                    ? 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed shadow-none' 
                    : 'bg-terracotta text-white hover:bg-terracotta/90 shadow-terracotta/10'
                }`}
            >
                {isCollected ? 'OTP Verified · Food Collected' : isClaimed ? 'Claimed · Awaiting Collection' : 'Redistribute Surplus'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
