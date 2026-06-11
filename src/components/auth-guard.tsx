'use client';

import { useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: '/auth' });
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.navigate({ to: '/auth' });
    } else if (user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.navigate({ to: '/' });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return <>{children}</>;
}
