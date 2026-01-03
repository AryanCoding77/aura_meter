import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback triggered');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        
        // Check if we have a hash with OAuth tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('Access token present:', !!accessToken);
        console.log('Refresh token present:', !!refreshToken);
        
        if (accessToken) {
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          console.log('Set session result:', data);
          console.log('Set session error:', error);
          
          if (error) {
            console.error('Error setting session:', error);
            toast.error('Failed to complete sign in. Please try again.');
            navigate('/login', { replace: true });
            return;
          }
          
          if (data.session) {
            console.log('Session established successfully');
            toast.success('Successfully signed in!');
            navigate('/dashboard', { replace: true });
            return;
          }
        }
        
        // Fallback: try to get existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Fallback session data:', session);
        console.log('Fallback session error:', error);
        
        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed. Please try again.');
          navigate('/login', { replace: true });
          return;
        }

        if (session) {
          console.log('Session found, redirecting to dashboard');
          toast.success('Successfully signed in!');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('No session found, redirecting to login');
          toast.error('No session found. Please try again.');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast.error('An unexpected error occurred.');
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
