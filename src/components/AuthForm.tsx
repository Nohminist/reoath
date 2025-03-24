// src/components/Login.tsx

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false); // サインアップ/ログインの切り替え

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { displayName } },
    });

    if (error) {
      setError(error.message);
    } else {
      alert('登録完了！確認メールをチェックしてください');
      setIsSignUp(false); // ログインフォームに切り替え
    }

    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/'); // ログイン成功後にトップページにリダイレクト
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md">
        <p>ログイン中: {user.user_metadata?.displayName || '名無し'}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md">
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full"
      />
      {isSignUp && (
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border p-2 rounded w-full"
        />
      )}
      <button
        onClick={isSignUp ? handleSignUp : handleLogin}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
      >
        {loading ? (isSignUp ? '登録中...' : 'ログイン中...') : (isSignUp ? '登録' : 'ログイン')}
      </button>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-gray-600 mt-2"
      >
        {isSignUp ? 'アカウントをお持ちの方はこちら' : 'アカウントをお持ちでない方はこちら'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}