
import React, { useMemo, useState } from 'react';
import { UserRole, FoodListing, ListingStatus } from '../types';
import { 
  Plus, History, BarChart3, ShieldCheck, MapPin, 
  Clock, Activity, ArrowUpRight, CheckCircle2, Users,
  LogOut, Star, AlertCircle, Smartphone, Heart, Search
} from 'lucide-react';
import FoodCard from '../components/FoodCard';

interface DashboardProps {
  user: { name: string; role: UserRole; verified?: boolean };
  listings: FoodListing[];
  notifications: any[];
  onVerifyOTP: (listingId: string, otp: string) => boolean;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, listings, notifications, onVerifyOTP, onNavigate, onLogout }) => {
  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpError, setOtpError] = useState<string | null>(null);

  const donorListings = useMemo(() => listings.filter(l => l.donorName === user.name || user.role === UserRole.ADMIN), [listings, user.name]);
  const ngoClaims = useMemo(() => listings.filter(l => l.claimedBy === user.name), [listings, user.name]);

  const handleOtpChange = (id: string, val: string) => {
    setOtpInputs(prev => ({ ...prev, [id]: val }));
    setOtpError(null);
  };

  const handleVerify = (id: string) => {
    const success = onVerifyOTP(id, otpInputs[id] || '');
    if (!success) {
      setOtpError("Invalid OTP. Verify with the representative.");
    } else {
      setOtpInputs(prev => ({ ...prev, [id]: '' }));
    }
  };

  const renderDonorDashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Meals Enabled" value={donorListings.filter(l => l.status === ListingStatus.COLLECTED).length * 10 + 400} subValue="+12 this week" icon={<UsersIcon />} trend="up" />
        <StatCard label="Food Saved (KG)" value="128.5" subValue="24.2 kg CO2 offset" icon={<ActivityIcon />} trend="up" />
        <StatCard label="Donation Streak" value="8 Days" icon={<Star size={24} className="text-terracotta" />} trend="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl shadow-charcoal/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="heading-serif text-3xl text-charcoal">Redistribution Handover</h3>
                <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest mt-1">Verify NGO Collections</p>
              </div>
              <button 
                onClick={() => onNavigate('post')}
                className="bg-terracotta text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-terracotta/30 transition-all flex items-center space-x-2 active:scale-95 shadow-lg shadow-terracotta/20"
              >
                <Plus size={16} /> <span>Post New Surplus</span>
              </button>
            </div>
            
            <div className="space-y-6">
              {donorListings.filter(l => l.status === ListingStatus.CLAIMED).map(listing => (
                <div key={listing.id} className="bg-sand/30 p-8 rounded-[2.5rem] border border-terracotta/10 relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center space-x-6">
                      <img src={listing.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                      <div>
                        <h4 className="text-xl font-black text-charcoal mb-1">{listing.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-terracotta flex items-center">
                          <Users size={12} className="mr-2" /> Claimed by {listing.claimedBy}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-charcoal/5 flex flex-col items-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mb-3">Verify OTP</p>
                       <div className="flex space-x-3">
                          <input 
                            type="text" 
                            placeholder="OTP"
                            maxLength={6}
                            value={otpInputs[listing.id] || ''}
                            onChange={(e) => handleOtpChange(listing.id, e.target.value)}
                            className="w-32 bg-sand border-none outline-none rounded-xl px-4 py-3 text-center font-black tracking-[0.3em] text-charcoal focus:ring-2 focus:ring-terracotta/20 transition-all"
                          />
                          <button 
                            onClick={() => handleVerify(listing.id)}
                            className="bg-charcoal text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-terracotta transition-colors shadow-lg"
                          >
                            Verify
                          </button>
                       </div>
                       {otpError && <p className="text-[10px] text-red-500 font-bold mt-3 text-center">{otpError}</p>}
                    </div>
                  </div>
                </div>
              ))}
              {donorListings.filter(l => l.status === ListingStatus.CLAIMED).length === 0 && (
                <div className="p-16 border-2 border-dashed border-charcoal/5 rounded-[3rem] text-center">
                   <Smartphone size={48} className="text-charcoal/10 mx-auto mb-6" />
                   <p className="text-charcoal/30 font-bold">No active collections waiting.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3rem] p-8 border border-charcoal/5 shadow-xl shadow-charcoal/5">
             <div className="flex items-center justify-between mb-8">
                <h4 className="font-black uppercase tracking-widest text-[10px] text-charcoal/30">Activity</h4>
                <div className="w-2 h-2 bg-terracotta rounded-full animate-pulse"></div>
             </div>
             <div className="space-y-6">
                {notifications.slice(0, 5).map(n => <NotificationItem key={n.id} notification={n} />)}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNGODashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Food Claimed" value={ngoClaims.length + 12} subValue="142 kg total weight" icon={<HistoryIcon />} trend="up" />
        <StatCard label="People Served" value="1.2k" subValue="Across 4 shelters" icon={<UsersIcon />} trend="up" />
        <StatCard label="Efficiency" value="92%" subValue="Claim-to-Pickup speed" icon={<BarChart3 size={24} className="text-terracotta" />} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
           <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="heading-serif text-4xl text-charcoal">Active Claims</h3>
                <p className="text-xs text-terracotta font-black uppercase tracking-widest">Provide OTP at collection</p>
              </div>
              <button 
                onClick={() => onNavigate('listings')}
                className="bg-charcoal text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-charcoal/30 transition-all flex items-center space-x-2 active:scale-95 shadow-lg shadow-charcoal/20"
              >
                <Search size={16} /> <span>Find Surplus Food</span>
              </button>
            </div>
            <div className="space-y-6">
               {ngoClaims.filter(l => l.status === ListingStatus.CLAIMED).map(claim => (
                 <div key={claim.id} className="bg-white rounded-[3rem] p-8 border border-charcoal/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 group">
                    <div className="flex items-center space-x-6">
                       <img src={claim.imageUrl} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" />
                       <div>
                          <p className="text-terracotta font-black text-[10px] uppercase tracking-widest mb-2 flex items-center">
                             <Clock size={12} className="mr-2 text-black font-black" /> Collect before {claim.availableUntil}
                          </p>
                          <h4 className="text-2xl font-black text-charcoal leading-none mb-2">{claim.name}</h4>
                          <div className="flex items-center text-charcoal/40 text-xs font-medium">
                             <MapPin size={12} className="mr-2 text-black font-black" /> {claim.location.address}
                          </div>
                       </div>
                    </div>
                    <div className="bg-charcoal text-white p-8 rounded-[2.5rem] flex flex-col items-center min-w-[200px] shadow-xl">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Collection OTP</p>
                       <div className="text-4xl font-black tracking-[0.2em] mb-2 text-terracotta">{claim.otp}</div>
                       <p className="text-[9px] text-white/40 font-bold text-center mt-2 leading-tight">Verify with donor</p>
                    </div>
                 </div>
               ))}
               {ngoClaims.filter(l => l.status === ListingStatus.CLAIMED).length === 0 && (
                 <div className="p-20 bg-white rounded-[3rem] border-2 border-dashed border-charcoal/5 text-center">
                    <Search size={48} className="text-charcoal/10 mx-auto mb-6" />
                    <p className="text-charcoal/30 font-bold mb-8">No active claims at the moment.</p>
                    <button 
                        onClick={() => onNavigate('listings')}
                        className="bg-terracotta text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-terracotta/20"
                    >
                        Browse Surplus Feed
                    </button>
                 </div>
               )}
            </div>
           </section>
        </div>
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[3rem] p-8 border border-charcoal/5 shadow-xl">
              <h4 className="font-black uppercase tracking-widest text-[10px] text-charcoal/30 mb-8">Ecosystem Snapshot</h4>
              <div className="flex items-end justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase text-charcoal/30 mb-2">Trust Score</p>
                   <p className="text-3xl font-black text-charcoal tracking-tighter">4.9/5</p>
                </div>
                <Star size={32} className="text-wheat" fill="currentColor" />
              </div>
           </div>
           <div className="bg-charcoal rounded-[3rem] p-8 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Community Impact</p>
              <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-terracotta">
                      <Heart size={20} fill="currentColor" />
                  </div>
                  <div>
                      <p className="text-2xl font-black">1.2k+</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20">People Served</p>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-sand min-h-screen pt-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
               <p className="text-terracotta font-black uppercase tracking-widest text-[10px] flex items-center">
                 {user.verified && <ShieldCheck size={12} className="mr-2" />} Verified {user.role === UserRole.NGO ? "NGO / Food Bank" : user.role}
               </p>
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            </div>
            <h1 className="heading-serif text-6xl md:text-8xl text-charcoal leading-none">
              Welcome, <span className="text-terracotta">{user.name.split(' ')[0]}</span>.
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <button 
                onClick={onLogout}
                className="p-5 bg-white rounded-3xl border border-charcoal/5 text-charcoal/30 hover:text-red-500 transition-all shadow-sm hover:shadow-xl active:scale-95 flex items-center"
                title="Logout"
              >
                <LogOut size={24} />
             </button>
          </div>
        </div>

        {user.role === UserRole.DONOR && renderDonorDashboard()}
        {user.role === UserRole.NGO && renderNGODashboard()}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subValue, icon, trend }: any) => (
  <div className="bg-white rounded-[3rem] p-10 border border-charcoal/5 shadow-xl group hover:border-terracotta transition-all duration-500">
    <div className="flex justify-between items-start mb-10">
      <div className="p-5 bg-sand rounded-3xl group-hover:bg-terracotta/5">{icon}</div>
      <div className={`flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-emerald-500' : 'text-charcoal/30'}`}>
        {trend === 'up' && <ArrowUpRight size={14} />}
        <span>{trend === 'up' ? 'Growing' : 'Steady'}</span>
      </div>
    </div>
    <p className="text-charcoal/40 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>
    <div className="text-5xl font-black text-charcoal mb-2 tracking-tighter leading-none">{value}</div>
    {subValue && <p className="text-[10px] font-bold text-charcoal/30">{subValue}</p>}
  </div>
);

const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
  const iconMap: any = {
    success: <CheckCircle2 size={16} className="text-emerald-500" />,
    info: <Clock size={16} className="text-black font-black" />,
    impact: <Heart size={16} className="text-terracotta" />,
    alert: <AlertCircle size={16} className="text-red-500" />,
  };
  return (
    <div className="flex items-start space-x-4">
      <div className="mt-1">{iconMap[notification.type] || iconMap.info}</div>
      <div className="flex-grow">
        <p className="text-[11px] font-bold text-charcoal leading-tight">{notification.text}</p>
        <p className="text-[9px] font-black uppercase tracking-widest text-charcoal/20 mt-1">{notification.time}</p>
      </div>
    </div>
  );
};

const UsersIcon = () => <Users size={24} className="text-terracotta" />;
const ActivityIcon = () => <Activity size={24} className="text-terracotta" />;
const HistoryIcon = () => <History size={24} className="text-terracotta" />;

export default Dashboard;
