import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, Sparkles, X, AlertCircle, Image as ImageIcon, Zap, CheckCircle2, Camera } from 'lucide-react';
import { analyzeAura } from '@/lib/fireworks';
import { saveAuraResult } from '@/lib/resultStorage';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function Analyze() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) {
      toast.error('Please select an image first');
      return;
    }

    // Check if user has credits
    if (!profile || profile.credits_remaining <= 0) {
      toast.error('No credits remaining. Please purchase credits to continue.');
      navigate('/buy-plan');
      return;
    }

    setIsAnalyzing(true);

    try {
      console.log('Starting analysis with file:', selectedFile.name);

      // Analyze the image - pass the File object directly
      const response = await analyzeAura(selectedFile);
      
      console.log('Analysis response:', response);

      // Check if analysis was successful
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Analysis failed');
      }

      const result = response.data;

      // Validate result has required fields
      if (!result || typeof result.aura_score === 'undefined' || !result.aura_label) {
        throw new Error('Invalid analysis result received');
      }

      // Ensure arrays exist
      const validatedResult = {
        ...result,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        improvement_tips: result.improvement_tips || []
      };
      
      // Save result to localStorage and Supabase (with vision analysis if available)
      // This will also deduct 1 credit
      const resultId = await saveAuraResult(
        validatedResult, 
        response.visionAnalysis
      );
      
      console.log('Analysis saved with ID:', resultId);
      
      // Refresh profile to update credits display
      await refreshProfile();
      
      // Navigate to results page with the ID
      navigate(`/result/${resultId}`, { state: { result: validatedResult } });
      
      toast.success('Analysis complete! 1 credit used.');
    } catch (error: any) {
      console.error('Analysis error:', error);
      
      // Handle specific error messages
      if (error.message?.includes('No credits remaining')) {
        toast.error('No credits remaining. Redirecting to purchase page...');
        setTimeout(() => navigate('/buy-plan'), 2000);
      } else {
        toast.error(error.message || 'Failed to analyze image. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Upload & Analyze</span>
              </motion.div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Check Your Aura
              </h1>
              <p className="text-[#9CA3AF] text-lg">
                Upload any screenshot and let our AI analyze your aura
              </p>
            </div>
          </div>
        </motion.div>

        {/* Credits Warning */}
        {profile && profile.credits_remaining <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-yellow-400 font-semibold mb-1">No Credits Remaining</p>
              <p className="text-sm text-[#9CA3AF] mb-3">
                You need credits to analyze screenshots. Purchase credits to continue.
              </p>
              <Button
                size="sm"
                onClick={() => navigate('/buy-plan')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0"
              >
                Buy Credits
              </Button>
            </div>
          </motion.div>
        )}

        {profile && profile.credits_remaining > 0 && profile.credits_remaining <= 3 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-orange-400 font-semibold mb-1">Low Credits</p>
              <p className="text-sm text-[#9CA3AF]">
                You have {profile.credits_remaining} credit{profile.credits_remaining !== 1 ? 's' : ''} remaining. Consider purchasing more.
              </p>
            </div>
          </motion.div>
        )}

        {/* Upload Area */}
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              <div
                className={`
                  relative overflow-hidden bg-[#12121A] border-2 border-dashed rounded-2xl p-12 text-center
                  transition-all duration-300
                  ${isDragging 
                    ? 'border-cyan-500 bg-cyan-500/10 scale-[1.02]' 
                    : 'border-white/10 hover:border-white/20'
                  }
                `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                </div>

                <div className="relative z-10">
                  <motion.div
                    animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                    className={`
                      w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center
                      transition-all duration-300
                      ${isDragging 
                        ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-500/50' 
                        : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-white/10'
                      }
                    `}
                  >
                    <Upload className={`w-12 h-12 ${isDragging ? 'text-cyan-400' : 'text-[#9CA3AF]'}`} />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    {isDragging ? 'Drop it here!' : 'Drop your screenshot here'}
                  </h3>
                  <p className="text-[#9CA3AF] mb-6">
                    or click to browse from your device
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 text-lg px-8 py-6"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Choose File
                  </Button>
                  
                  <p className="text-xs text-[#9CA3AF] mt-6">
                    Supports: JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8"
            >
              {/* Image Preview Card */}
              <div className="bg-[#12121A] border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Image Ready</h3>
                      <p className="text-xs text-[#9CA3AF]">{selectedFile?.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-[#9CA3AF] hover:text-white hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
                
                <div className="relative rounded-xl overflow-hidden bg-black/20 border border-white/10">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-sm text-white/80">
                      {(selectedFile!.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !profile || profile.credits_remaining <= 0}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 py-7 text-lg font-semibold relative overflow-hidden group"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Analyzing Your Aura...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-2" />
                    Analyze Aura
                    <span className="ml-2 text-sm opacity-75">(1 credit)</span>
                  </>
                )}
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </Button>

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <p className="text-sm text-cyan-400">
                    Reading your digital presence... This may take a moment.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-lg">What We Analyze</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Profile aesthetics and presentation',
                'Content quality and authenticity',
                'Overall digital presence'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#12121A] border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">Best Practices</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Use clear, high-quality screenshots',
                'Include profile picture and bio',
                'Capture full profile view'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#9CA3AF]">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
