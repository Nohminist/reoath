// src/components/AuthModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/supabaseClient';
import type { User } from '@supabase/supabase-js';
import AuthForm from './AuthForm';
import Modal from './Modal';
import UserProfileModal from './UserProfileModal'; // 追加

const AuthModal: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // 追加

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

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <>
        <button className="text-blue-500" onClick={handleOpenProfileModal}>
          ユーザーアイコン
        </button>
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          user={user}
          onLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <>
      <button className="text-blue-500" onClick={handleOpenAuthModal}>
        ログインアイコン
      </button>
      <Modal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal}>
        <AuthForm />
      </Modal>
    </>
  );
};

export default AuthModal;