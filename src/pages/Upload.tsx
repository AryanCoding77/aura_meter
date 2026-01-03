import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, X, Sparkles, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { analyzeAura } from "@/lib/fireworks";
import { saveAuraResult } from "@/lib/resultStorage";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, refreshProfile } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file (JPG, PNG, WEBP)");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    
    // Check if user has credits
    if (profile && profile.credits_remaining <= 0) {
      setError('No credits remaining. Please purchase credits to continue.');
      toast({
        title: "No Credits",
        description: "Please purchase credits to analyze screenshots.",
        variant: "destructive",
      });
      setTimeout(() => navigate('/buy-plan'), 2000);
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('Starting analysis with file:', selectedFile.name);

      // Real API call
      const response = await analyzeAura(selectedFile);
      
      console.log('Analysis response:', response);

      if (response.success && response.data) {
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
        if (profile) {
          await refreshProfile();
        }
        
        // Navigate to results page with the ID
        navigate(`/result/${resultId}`, { state: { result: validatedResult } });
        
        toast({
          title: "Analysis Complete!",
          description: profile ? "1 credit used." : "Your aura has been analyzed.",
        });
      } else {
        throw new Error(response.error || 'Failed to analyze image');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      
      // Handle specific error messages
      if (errorMessage.includes('No credits remaining')) {
        toast({
          title: "No Credits",
          description: "Redirecting to purchase page...",
          variant: "destructive",
        });
        setTimeout(() => navigate('/buy-plan'), 2000);
      } else {
        toast({
          title: "Analysis Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, profile, refreshProfile, navigate, toast]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden noise-overlay">
      {/* Simplified Navbar - Only Logo and Name */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-t-0"
      >
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            {/* Logo and Name */}
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <img 
                src="/logo.png" 
                alt="Aura Meter Logo" 
                className="w-10 h-10 rounded-xl transition-transform group-hover:scale-105"
              />
              <span className="font-display font-semibold text-lg">
                Aura Meter
              </span>
            </button>
          </nav>
        </div>
      </motion.header>
      
      <main className="relative pt-24 pb-16">
        {/* Background effects */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32 opacity-30" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-1/2 -right-48 opacity-20" style={{ animationDelay: '-5s' }} />

        <div className="container relative z-10">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="glass-card px-4 py-2 mb-6 flex items-center gap-2 w-fit mx-auto">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Upload & Analyze</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Check Your <span className="gradient-text">Aura</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Upload any screenshot and let our AI analyze your aura
            </p>
          </motion.div>

          {/* Upload area */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            {/* Error message */}
            {error && (
              <div className="glass-card p-4 mb-6 border-red-500/50 bg-red-500/10">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-500 font-medium">Error</p>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`glass-card-hover p-12 border-2 border-dashed transition-all duration-300 ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-6 rounded-full mb-6 transition-all duration-300 ${
                    isDragging ? "bg-primary/20 scale-110" : "bg-muted"
                  }`}>
                    <UploadIcon className={`w-12 h-12 ${
                      isDragging ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Drop your screenshot here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse from your device
                  </p>
                  
                  <label className="btn-primary-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl cursor-pointer transition-all duration-300">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </label>
                  
                  <p className="text-muted-foreground text-sm mt-6">
                    Supports: JPG, PNG, WEBP (Max 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6">
                {/* Preview */}
                <div className="relative mb-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain rounded-lg"
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* File info */}
                <div className="flex items-center justify-between mb-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{selectedFile?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleRemoveFile}
                    disabled={isAnalyzing}
                    className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 btn-primary-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze Aura
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-12"
          >
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">~30s</div>
              <div className="text-sm text-muted-foreground">Analysis time</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Private & secure</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">AI</div>
              <div className="text-sm text-muted-foreground">Powered analysis</div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
