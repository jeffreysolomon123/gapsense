"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Mail, ArrowLeft } from "lucide-react"; // Added for better UX
import Image from "next/image";
import logo from "../app/logo.png";
export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex bg-[#F9FBFB] flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-white/80 backdrop-blur-sm">
      <div className="flex justify-center mb-3 mt-3">
            <Link href="/" className="flex items-center gap-1 ">
                <Image className="w-10 h-10"
                  src={logo}
                  alt="GapSense Logo"
                />
              <span className="text-lg md:text-xl font-black text-[#215E61]">GapSense</span>
            </Link>
          </div>
        <CardHeader className="space-y-1 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-[#215E61]/10 rounded-full">
              <Mail className="h-6 w-6 text-[#215E61]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-[#1a3a3a]">
            {success ? "Check your email" : "Reset password"}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {success 
              ? "We've sent a recovery link to your inbox." 
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-[#215E61]/5 border border-[#215E61]/10 rounded-lg">
                <p className="text-sm text-center text-slate-600 leading-relaxed">
                  If an account exists for <span className="font-semibold text-[#215E61]">{email}</span>, 
                  you will receive instructions shortly.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-[#215E61]/20 hover:bg-[#215E61]/5 text-[#215E61]"
                onClick={() => setSuccess(false)}
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[#1a3a3a]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#F9FBFB] border-slate-200 focus:border-[#215E61] focus:ring-[#215E61]/10 transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#215E61] hover:bg-[#1a4a4d] text-white shadow-md transition-all active:scale-[0.98]" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm font-medium text-[#215E61] hover:underline underline-offset-4"
                >
                  <ArrowLeft className="mr-2 h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}