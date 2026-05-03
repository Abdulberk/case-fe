'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { fetcher } from '@/lib/graphql-fetcher';
import { LoginDocument, type AuthResponse } from '@/generated/graphql';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetcher<
        { login: AuthResponse },
        { input: { email: string; password: string } }
      >(LoginDocument, { input: { email, password } })();

      login(data.login.accessToken, {
        id: data.login.user.id,
        email: data.login.user.email,
        name: data.login.user.name,
        role: data.login.user.role as 'USER' | 'ADMIN',
      });
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="rounded-lg border bg-card p-8">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-12 w-12 rounded-xl" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-md border border-destructive/30 bg-[hsl(var(--status-dead-bg))] px-4 py-3 text-sm text-[hsl(var(--status-dead-text))]"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" variant="outline" className="w-full" disabled={loading}>
              {loading ? (
                <Spinner size={16} color="hsl(var(--foreground))" />
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <Separator className="my-6" />

          {/* Demo Credentials */}
          <div className="mb-6 space-y-3">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }}
                className="rounded-md border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent"
              >
                <span className="block text-xs font-semibold text-foreground">Admin</span>
                <span className="block text-[11px] text-muted-foreground">admin@example.com</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('user@example.com'); setPassword('user1234'); }}
                className="rounded-md border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent"
              >
                <span className="block text-xs font-semibold text-foreground">User</span>
                <span className="block text-[11px] text-muted-foreground">user@example.com</span>
              </button>
            </div>
          </div>

          <Separator className="mb-6" />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
