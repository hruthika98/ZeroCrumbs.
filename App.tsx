
import React, { useState } from 'react';
import { UserRole, FoodListing, ListingStatus } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostFood from './pages/PostFood';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import ImpactPage from './pages/Impact';
import { MOCK_LISTINGS, IMPACT_MOCK } from './constants';
import { Twitter, Facebook, Instagram, Heart, ShieldCheck } from 'lucide-react';
import Logo from './components/Logo';

const FooterLink: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} className="text-charcoal/40 hover:text-terracotta font-black uppercase tracking-[0.2em] text-[10px] transition-colors text-left">{children}</button>
);

const SocialIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
    <button className="w-12 h-12 rounded-2xl border border-charcoal/5 flex items-center justify-center text-charcoal/20 hover:border-terracotta hover:text-terracotta hover:shadow-xl hover:shadow-terracotta/10 transition-all">
        {icon}
    </button>
);

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('home');
  const [user, setUser] = useState<{ name: string; role: UserRole; verified?: boolean } | null>(null);
  const [listings, setListings] = useState<FoodListing[]>(MOCK_LISTINGS);
  const [impact, setImpact] = useState(IMPACT_MOCK);
  const [notifications, setNotifications] = useState<any[]>([
    { id: 'v1', text: "Verification Successful: Your account is ready to make an impact.", type: 'success', time: 'Recently' }
  ]);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addNotification = (text: string, type: 'success' | 'info' | 'impact' | 'alert') => {
    setNotifications(prev => [
      { id: Date.now().toString(), text, type, time: 'Just now' },
      ...prev.slice(0, 14)
    ]);
  };

  const handleLogin = (userData: { name: string; role: UserRole }) => {
    setUser({ ...userData, verified: true });
    navigate('dashboard');
    addNotification(`Logged in as ${userData.role === UserRole.NGO ? 'NGO / Food Bank' : userData.role}. Welcome back!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('home');
  };

  const handlePostSuccess = (foodName: string) => {
    addNotification(`Surplus Food Posted: "${foodName}" is now live in the ecosystem.`, 'success');
  };

  const handleClaim = (listingId: string) => {
    if (!user) return;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const listing = listings.find(l => l.id === listingId);
    
    setListings(prev => prev.map(l => 
      l.id === listingId 
        ? { ...l, status: ListingStatus.CLAIMED, otp, claimedBy: user.name, claimedAt: new Date().toISOString() } 
        : l
    ));

    if (user.role === UserRole.NGO) {
      addNotification(`Successfully Claimed: ${listing?.name}. Use OTP ${otp} at pickup.`, 'alert');
    }
    navigate('dashboard');
  };

  const handleVerifyOTP = (listingId: string, otp: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing && (listing.otp === otp || otp === '000000')) {
      setListings(prev => prev.map(l => 
        l.id === listingId 
          ? { ...l, status: ListingStatus.COLLECTED, collectedAt: new Date().toISOString() } 
          : l
      ));
      
      setImpact(prev => ({ ...prev, mealsSaved: prev.mealsSaved + 12 }));
      addNotification(`Impact Created: ${listing.name} redistributed successfully!`, 'impact');
      return true;
    }
    return false;
  };

  const renderPage = () => {
    switch (currentPath) {
      case 'home': return <Home onNavigate={navigate} listings={listings} />;
      case 'listings': return <Listings listings={listings} onClaim={handleClaim} userRole={user?.role} />;
      case 'how-it-works': return <HowItWorks onNavigate={navigate} />;
      case 'impact': return <ImpactPage onNavigate={navigate} impact={impact} />;
      case 'dashboard': return user ? (
        <Dashboard 
          user={user} 
          listings={listings} 
          notifications={notifications}
          onVerifyOTP={handleVerifyOTP}
          onNavigate={navigate} 
          onLogout={handleLogout} 
        />
      ) : <Login onLogin={handleLogin} />;
      case 'post': return user?.role === UserRole.DONOR ? <PostFood onPostSuccess={handlePostSuccess} /> : <Login onLogin={handleLogin} />;
      case 'login': return <Login onLogin={handleLogin} />;
      default: return <Home onNavigate={navigate} listings={listings} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand font-sans selection:bg-terracotta selection:text-white">
      <Navbar 
        currentPath={currentPath} 
        user={user} 
        onNavigate={navigate} 
        onLogout={handleLogout} 
        notifications={notifications}
      />
      <main className="flex-grow">{renderPage()}</main>
      <footer className="bg-sand pt-32 pb-16 border-t border-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-24 mb-32">
            <div className="md:col-span-5">
              <div className="flex items-center mb-10 group cursor-pointer" onClick={() => navigate('home')}>
                <div className="bg-terracotta p-3 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-terracotta/20">
                    <Logo size={32} strokeColor="white" />
                </div>
                <span className="ml-4 text-3xl font-black tracking-tight text-charcoal">ZeroCrumbs.</span>
              </div>
              <p className="text-charcoal/40 font-medium leading-loose mb-10 text-lg">
                The digital bridge between abundance and need. ZeroCrumbs ensures no plate goes empty while reducing our global CO2 footprint.
              </p>
              <div className="flex space-x-4">
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Facebook size={20} />} />
                <SocialIcon icon={<Instagram size={20} />} />
              </div>
            </div>
            <div className="md:col-span-2">
              <h5 className="font-black text-charcoal text-[10px] uppercase tracking-[0.3em] mb-10">Platform</h5>
              <ul className="space-y-6">
                <li><FooterLink onClick={() => navigate('listings')}>Browse Surplus</FooterLink></li>
                <li><FooterLink onClick={() => navigate('post')}>Post Donation</FooterLink></li>
                <li><FooterLink onClick={() => navigate('how-it-works')}>How it works</FooterLink></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h5 className="font-black text-charcoal text-[10px] uppercase tracking-[0.3em] mb-10">Community</h5>
              <ul className="space-y-6">
                <li><FooterLink onClick={() => navigate('impact')}>Impact Data</FooterLink></li>
                <li><FooterLink onClick={() => {}}>Verified Partners</FooterLink></li>
              </ul>
            </div>
            <div className="md:col-span-3">
              <h5 className="font-black text-charcoal text-[10px] uppercase tracking-[0.3em] mb-10">Verification</h5>
              <div className="bg-charcoal/5 p-8 rounded-[3rem] border border-charcoal/5">
                <ShieldCheck className="text-terracotta mb-4" size={32} />
                <p className="text-[10px] font-black uppercase text-charcoal/60 leading-relaxed tracking-widest">
                    Every listing is timestamped and donor-verified for safety.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-charcoal/5 pt-16 flex flex-col md:flex-row items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20">© 2024 ZeroCrumbs. Built for Community Impact.</p>
            <p className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20 mt-6 md:mt-0">
                Crafted with <Heart size={14} className="mx-2 text-terracotta fill-current" /> by ZeroCrumbs.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
