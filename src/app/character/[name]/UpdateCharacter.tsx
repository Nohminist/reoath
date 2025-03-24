// src/app/character/[name]/UpdatedCharacter.tsx

'use client'; //クライアントサイドコンポーネント

import { useState, useEffect } from 'react';
import { supabase } from '@/app/supabaseClient';
import { Character } from '@/types/supabase'; 

export default function UpdateCharacter({ character }: { character: Character }) { // 型を適用
  const [name, setName] = useState(character.name);
  const [rarity, setRarity] = useState(character.rarity || '');
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // userIdの状態を追加

  useEffect(() => {
    // ユーザー認証情報を取得
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser(); // errorを追加

      if (error) {
        console.error('ユーザー認証情報取得エラー:', error);
        setUserId(null); // エラー時はnullを設定
        return;
      }

      setUserId(user?.id || null);
    };

    fetchUser();
  }, []);


  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);

    const { data: updatedCharacter, error: updateError } = await supabase
      .from('characters')
      .update({ name, rarity })
      .eq('id', character.id)
      .select(); // 更新後のデータを取得

    if (updateError) {
      console.error('キャラデータ更新エラー:', updateError);
      setError('キャラデータの更新に失敗しました。');
      setIsUpdating(false);
      return;
    }

    // ログテーブルに追加
    const logData = {
      user_id: userId || null, // nullを送信
      affected_table: 'characters',
      affected_record_id: character.id,
      changed_data: {
        name: updatedCharacter?.[0]?.name,
        rarity: updatedCharacter?.[0]?.rarity,
      },
    };

    const { error: logError } = await supabase.from('logs').insert(logData);

    if (logError) {
      console.error('ログ追加エラー:', logError);
      setError('ログの追加に失敗しました。');
    } else {
      console.log('キャラデータ更新とログ追加成功');
      // キャラ詳細ページをリフレッシュするなどの処理
    }

    setIsUpdating(false);
  };

  return (
    <div>
      <h2>キャラデータ更新</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Rarity:
        <input type="text" value={rarity} onChange={(e) => setRarity(e.target.value)} />
      </label>
      <button onClick={handleUpdate} disabled={isUpdating}>
        {isUpdating ? '更新中...' : '更新'}
      </button>
    </div>
  );
}