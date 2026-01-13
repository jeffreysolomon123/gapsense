"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { 
  Zap, 
  Mail, 
  Lock, 
  Loader2, 
  ChevronRight, 
  ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "../app/logo.png";
import Image from "next/image";
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="max-w-[450px] w-full mx-auto">
        {/* Header Section */}
        <header className="mb-8 text-center">
          {/* <div className="inline-flex items-center gap-2 text-[#215E61] mb-3 bg-[#215E61]/5 px-4 py-1.5 rounded-full">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Access</span>
          </div> */}

          {/* logo with image and name */}
          <div className="flex justify-center mb-3">
            <Link href="/" className="flex items-center gap-1 ">
                <Image className="w-10 h-10"
                  src={logo}
                  alt="GapSense Logo"
                />
              <span className="text-lg md:text-xl font-black text-[#215E61] ">GapSense</span>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a3a3a] mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Enter your credentials to access the GapSense engine.</p>
        </header>

        <div className="bg-white border border-[#215E61]/10 rounded-md p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60 px-1">
                <Mail size={12} /> Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="researcher@university.edu"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F9FBFB] border border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#215E61]/60">
                  <Lock size={12} /> Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[10px] font-bold text-[#215E61] uppercase tracking-tighter hover:opacity-70 transition-opacity"
                >
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F9FBFB] border text-[#215E61] border-[#215E61]/10 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#215E61] transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-md flex items-center gap-2 font-medium">
                <Zap size={14} fill="currentColor" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#215E61] h-10 text-white py-4 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-[#1a4a4d] transition-all shadow-lg shadow-[#215E61]/10 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Login <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              New to the platform?{" "}
              <Link
                href="/auth/sign-up"
                className="text-[#215E61] font-bold underline underline-offset-4 hover:text-[#1a4a4d]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}