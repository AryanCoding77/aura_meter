import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Mail, Chrome, LogOut, User, Shield, Crown, Zap, Settings as SettingsIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Settings() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error('Failed to log out');
    }
  };

  const getLoginMethod = () => {
    if (!user) return 'Unknown';
    
    const hasGoogle = user.app_metadata?.provider === 'google' || 
                      user.identities?.some(id => id.provider === 'google');
    
    return hasGoogle ? 'Google' : 'Email';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/10 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                  <SettingsIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    Settings
                  </h1>
                </div>
              </div>
              <p className="text-[#9CA3AF] text-lg">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="flex items-start gap-4 mb-6">
                {/* Avatar */}
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || profile.email}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-500/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl border-2 border-purple-500/30">
                    {profile?.email[0].toUpperCase()}
                  </div>
                )}
                
                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {profile?.full_name || profile?.email.split('@')[0]}
                  </h2>
                  <p className="text-[#9CA3AF]">{profile?.email || user?.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Plan</p>
                  </div>
                  <p className="text-xl font-bold capitalize">{profile?.plan || 'Free'}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wide">Credits</p>
                  </div>
                  <p className="text-xl font-bold">{profile?.credits_remaining || 0}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
              <h2 className="font-semibold text-xl mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Account Details
              </h2>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Email Address</p>
                    <p className="font-medium truncate">{profile?.email || user?.email}</p>
                  </div>
                </div>

                {/* Login Method */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    {getLoginMethod() === 'Google' ? (
                      <Chrome className="w-5 h-5 text-green-400" />
                    ) : (
                      <Shield className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Login Method</p>
                    <p className="font-medium">{getLoginMethod()}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/buy-plan')}
              className="relative group overflow-hidden bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 border border-purple-500/30">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Buy Credits</h3>
                <p className="text-sm text-[#9CA3AF]">Purchase more credits to continue analyzing</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/history')}
              className="relative group overflow-hidden bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-cyan-500/30">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">View History</h3>
                <p className="text-sm text-[#9CA3AF]">Check your past aura analyses</p>
              </div>
            </button>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-[#12121A] border-2 border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-xl mb-2 text-red-400">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-[#9CA3AF]">
                    Log out of your account. You'll need to sign in again to access your dashboard.
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/30 hover:border-red-500/50 font-semibold"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout from Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
