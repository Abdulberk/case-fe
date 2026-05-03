'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, Shield, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const emptySubscribe = () => () => {};

export function AuthButtons() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Detect client-side mounting to prevent hydration mismatch
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Prevent hydration mismatch — render placeholder until mounted on client
  if (!isClient) {
    return <div className="h-9 w-24" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="gap-2">
            <LogIn className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="sm" className="gap-2">
            <span className="hidden sm:inline">Register</span>
            <span className="sm:hidden">Sign Up</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* User info */}
      <div className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
        <UserCircle className="h-4 w-4" />
        <span className="max-w-[120px] truncate">{user?.name}</span>
      </div>

      {/* Admin link — only for ADMIN role */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Shield className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      )}

      {/* Logout */}
      <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
        <LogOut className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
}
