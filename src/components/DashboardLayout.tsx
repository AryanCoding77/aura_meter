import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Sparkles,
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analyze', icon: Sparkles, label: 'Analyze' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/buy-plan', icon: CreditCard, label: 'Buy Credit' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B0B0F] border-b border-white/10 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Aura Meter Logo" 
            className="w-8 h-8 rounded-lg object-contain"
          />
          <h1 className="font-display text-xl font-bold">Aura Meter</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-white/5"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0B0B0F] border-r border-white/10 z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Aura Meter Logo" 
                className="w-8 h-8 rounded-lg object-contain"
              />
              <h1 className="font-display text-lg font-bold">Aura Meter</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive(item.path)
                    ? 'bg-purple-500/20 text-white border border-purple-500/30'
                    : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white border border-transparent'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {/* User Profile */}
            {profile && (
              <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-3">
                <div className="flex items-center gap-3">
                  {/* Profile Photo */}
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || profile.email}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold border-2 border-purple-500/30">
                      {profile.email[0].toUpperCase()}
                    </div>
                  )}
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {profile.full_name || profile.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-[#9CA3AF] truncate">{profile.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Logout */}
            <Button
              variant="ghost"
              className="w-full justify-start text-[#9CA3AF] hover:text-white hover:bg-white/5"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
