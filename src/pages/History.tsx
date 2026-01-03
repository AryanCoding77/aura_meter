import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, TrendingUp, Flame, Zap, Sparkles, Eye, Trash2, Filter } from "lucide-react";
import { fetchUserAnalyses, StoredResult, deleteAnalysis } from "@/lib/resultStorage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const History = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [analyses, setAnalyses] = useState<StoredResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const userAnalyses = await fetchUserAnalyses();
      setAnalyses(userAnalyses);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    
    const success = await deleteAnalysis(id);
    if (success) {
      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast.success('Analysis deleted');
    } else {
      toast.error('Failed to delete analysis');
    }
    
    setDeletingId(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 40) return "from-purple-500 to-pink-500";
    if (score >= 25) return "from-green-500 to-emerald-500";
    if (score >= 10) return "from-cyan-500 to-blue-500";
    if (score >= 0) return "from-gray-500 to-slate-500";
    if (score >= -14) return "from-yellow-500 to-orange-500";
    if (score >= -29) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-500";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 40) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (score >= 25) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 10) return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    if (score >= 0) return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    if (score >= -14) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (score >= -29) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
    });
  };

  const filteredAnalyses = analyses.filter(a => {
    if (filter === 'positive') return a.aura_score >= 0;
    if (filter === 'negative') return a.aura_score < 0;
    return true;
  });

  const stats = {
    total: analyses.length,
    avgScore: analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.aura_score, 0) / analyses.length)
      : 0,
    highest: analyses.length > 0 
      ? Math.max(...analyses.map(a => a.aura_score))
      : 0,
    positive: analyses.filter(a => a.aura_score >= 0).length
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/10 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Analysis History
              </h1>
              <p className="text-[#9CA3AF] text-lg mb-6">
                Track your aura evolution over time
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#12121A]/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-[#12121A]/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Average</p>
                  <p className="text-2xl font-bold">{stats.avgScore > 0 ? '+' : ''}{stats.avgScore}</p>
                </div>
                <div className="bg-[#12121A]/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Highest</p>
                  <p className="text-2xl font-bold text-purple-400">+{stats.highest}</p>
                </div>
                <div className="bg-[#12121A]/50 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-[#9CA3AF] uppercase tracking-wide mb-1">Positive</p>
                  <p className="text-2xl font-bold text-green-400">{stats.positive}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        {analyses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6"
          >
            <Filter className="w-4 h-4 text-[#9CA3AF]" />
            <div className="flex gap-2">
              {(['all', 'positive', 'negative'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-[#12121A] text-[#9CA3AF] border border-white/10 hover:border-white/20'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : analyses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#12121A] border border-white/10 rounded-2xl p-16 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
              <Flame className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No Analyses Yet</h3>
            <p className="text-[#9CA3AF] mb-8 max-w-md mx-auto">
              Get your first aura analysis to start tracking your progress
            </p>
            
            {profile?.credits_remaining === 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">No credits remaining</span>
                </div>
                <button
                  onClick={() => navigate("/buy-plan")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
                >
                  Buy Credits
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/analyze")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Start Analysis
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAnalyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getScoreColor(analysis.aura_score)} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity`} />
                  
                  {/* Card */}
                  <div
                    className="relative bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer"
                    onClick={() => navigate(`/result/${analysis.id}`)}
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* Left: Score & Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                          {/* Score Badge */}
                          <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${getScoreColor(analysis.aura_score)} p-[2px]`}>
                            <div className="w-full h-full bg-[#12121A] rounded-2xl flex items-center justify-center">
                              <span className={`text-2xl font-bold bg-gradient-to-br ${getScoreColor(analysis.aura_score)} bg-clip-text text-transparent`}>
                                {analysis.aura_score > 0 ? "+" : ""}{analysis.aura_score}
                              </span>
                            </div>
                          </div>
                          
                          {/* Label */}
                          <div className="flex-1">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium border ${getScoreBadgeColor(analysis.aura_score)} mb-2`}>
                              {analysis.aura_label}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(analysis.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Roast Preview */}
                        <p className="text-[#9CA3AF] text-sm line-clamp-2 leading-relaxed">
                          {analysis.shareable_one_liner}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/result/${analysis.id}`);
                          }}
                          className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 transition-all"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(analysis.id, e)}
                          disabled={deletingId === analysis.id}
                          className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all disabled:opacity-50"
                        >
                          {deletingId === analysis.id ? (
                            <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
