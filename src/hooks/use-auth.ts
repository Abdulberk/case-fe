'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setAuth, getAuth, clearAuth, type AuthUser } from '../lib/auth-store';

const AUTH_CHANGE_EVENT = 'auth-change';

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState(getAuth);

  useEffect(() => {
    const handler = () => setAuthState(getAuth());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const login = useCallback((accessToken: string, user: AuthUser) => {
    setAuth(accessToken, user);
    notifyAuthChange();
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    queryClient.clear();
    notifyAuthChange();
    window.location.href = '/';
  }, [queryClient]);

  return {
    ...authState,
    login,
    logout,
  };
}
