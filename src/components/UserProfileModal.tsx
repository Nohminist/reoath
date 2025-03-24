// src/components/UserProfileModal.tsx

'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/supabaseClient';
import type { User } from '@supabase/supabase-js';

import Modal from './Modal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, onLogout }) => {
  const [newDisplayName, setNewDisplayName] = useState(user?.user_metadata?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateDisplayName = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({
      data: { displayName: newDisplayName },
    });

    if (error) {
      setError(error.message);
    } else {
      onClose(); // 更新成功後にモーダルを閉じる
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">ユーザープロフィール</h2>
        <input
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleUpdateDisplayName}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
        >
          {loading ? '更新中...' : '更新'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white p-2 rounded w-full"
        >
          ログアウト
        </button>
      </div>
    </Modal>
  );
};

export default UserProfileModal;