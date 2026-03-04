import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Mail, Lock, User, ArrowRight, Github, Chrome, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onBack: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBack }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess();
      } else {
        if (!name.trim()) throw new Error('Full name is required.');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
          throw new Error('Password must be at least 8 characters and include uppercase, number, and special character.');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        setMode('login');
        setError('Account created successfully. Please login.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-emerald-500/[0.05] blur-[160px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/[0.05] blur-[160px] rounded-full animate-pulse-glow" style={{ animationDelay: '-2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10 space-y-4">
          <div 
            onClick={onBack}
            className="inline-flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-all"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
              <Leaf className="text-black" size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tighter leading-none group-hover:glow-text-green transition-all duration-500">
              ECOSPHERE <span className="text-emerald-500">AI</span>
            </h1>
          </div>
          <p className="text-[10px] text-white/20 font-mono font-bold uppercase tracking-[0.5em]">Sustainability Intelligence Platform</p>
        </div>

        <div className="glass rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Progress Bar for Loading */}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
              />
            </div>
          )}

          <div className="flex gap-4 mb-10">
            <button
              onClick={() => setMode('login')}
              className={cn(
                "flex-1 py-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] border-b-2 transition-all duration-500",
                mode === 'login' ? "text-emerald-500 border-emerald-500" : "text-white/20 border-transparent hover:text-white/40"
              )}
            >
              Login
            </button>
            <button
              onClick={() => setMode('signup')}
              className={cn(
                "flex-1 py-2 text-[10px] font-mono font-black uppercase tracking-[0.3em] border-b-2 transition-all duration-500",
                mode === 'signup' ? "text-emerald-500 border-emerald-500" : "text-white/20 border-transparent hover:text-white/40"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.3em] ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.3em] ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-white/20 uppercase tracking-[0.3em] ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••"
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email.trim()) {
                        setError('Please enter your email first.');
                        return;
                      }
                      const { error } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: window.location.origin
                      });
                      if (error) {
                        setError(error.message);
                      } else {
                        setError('Password reset email sent. Please check your inbox.');
                      }
                    }}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer transition-all duration-300"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-emerald-500 text-black font-mono font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-4"
            >
              {isLoading ? 'Processing...' : (
                <>
                  {mode === 'login' ? 'Access Platform' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 space-y-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative px-4 bg-[#0a0a0a] text-[9px] font-mono font-bold text-white/10 uppercase tracking-widest">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group">
                <Chrome size={18} className="text-white/20 group-hover:text-white transition-colors" />
                <span className="text-[9px] font-mono font-bold text-white/20 group-hover:text-white uppercase tracking-widest">Google</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group">
                <Github size={18} className="text-white/20 group-hover:text-white transition-colors" />
                <span className="text-[9px] font-mono font-bold text-white/20 group-hover:text-white uppercase tracking-widest">GitHub</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.2em]">
          By continuing, you agree to our <span className="text-white/40 hover:text-emerald-500 cursor-pointer transition-colors">Terms of Service</span>
        </p>
      </motion.div>
    </div>
  );
};
