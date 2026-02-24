'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Container from '@/components/ui/Container';
import Title from '@/components/ui/Title';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { completeTeamLoginWithPassword } from '@/services/auth/completeTeamLoginWithPassword';

export default function TeamLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ emailAddress, pwd }: { emailAddress: string; pwd: string }) =>
      completeTeamLoginWithPassword(emailAddress, pwd),
    onSuccess: () => router.push('/problem-statements'),
  });

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    loginMutation.mutate({ emailAddress: email.trim(), pwd: password });
  };

  const isLoading = loginMutation.isPending;
  const errorMessage = loginMutation.error instanceof Error ? loginMutation.error.message : '';

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-4 pb-16 pt-28">
        <Container size="md">
          <div className="mx-auto max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <Title level={2} variant="gradient" size="lg" align="center" className="mb-2">
                Team Login
              </Title>
              <p className="text-sm text-black/70 font-red-hat-display">
                Enter your team leader email and password to proceed with PS selection.
              </p>
            </div>

            {/* Login Form */}
            <Card variant="gradient" padding="lg">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-black/80 mb-2">
                    Team Leader Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="leader@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-black/15 bg-white text-black placeholder-black/40 focus:ring-primary-purple"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-black/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="•••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border-black/15 bg-white text-black placeholder-black/40 focus:ring-primary-purple"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.604-3.368A9.967 9.967 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.05 10.05 0 01-4.117 5.593m0 0a10.001 10.001 0 01-9.716-6.593m5.604-3.368L9.172 3.172m11.656 11.656l2.121 2.121"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isLoading || !email.trim() || !password.trim()}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                {/* Error Message */}
                {errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                {/* Help Text */}
                <p className="text-xs text-black/50 text-center">
                  If you don't have credentials, contact your hackathon organizer.
                </p>
              </form>
            </Card>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/problem-statements')}
                className="text-sm font-semibold text-primary-orange hover:text-primary-purple transition-colors"
              >
                ← Back to Problem Statements
              </button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
