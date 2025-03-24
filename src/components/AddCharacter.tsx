// src/components/AddCharacter.tsx

'use client'; // クライアントコンポーネントとしてマーク

import { useState } from 'react';
import { supabase } from '@/app/supabaseClient';

export default function AddCharacter() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 重複チェック
    const { data, error: selectError } = await supabase
      .from('characters')
      .select('name')
      .eq('name', name);

    if (selectError) {
      console.error('重複チェックエラー:', selectError);
      setError('重複チェックに失敗しました。');
      return;
    }

    if (data && data.length > 0) {
      setError('同じ名前のキャラがすでに存在します。');
      return;
    }

    // レコード追加
    const { error: insertError } = await supabase.from('characters').insert([{ name }]);

    if (insertError) {
      console.error('レコード追加エラー:', insertError);
      setError('レコードの追加に失敗しました。');
    } else {
      console.log('レコード追加成功');
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Name:
        <input type="text" value={name} onChange={handleInputChange} />
      </label>
      <button type="submit">レコード追加</button>
    </form>
  );
}