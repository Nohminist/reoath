// src/app/character/[name]/page.tsx

import { supabase } from '../../supabaseClient';
import UpdatedCharacter from './UpdateCharacter';

async function getCharacter(name: string) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('name', decodeURIComponent(name))
    .single();

  if (error) {
    console.error('キャラデータ取得エラー:', error);
    return null;
  }

  return data;
}

export default async function CharacterDetail({ params }: { params: Promise<{ name: string }> }) { // 【変更不可！】Promise
  const resolvedParams = await params; // 【変更不可！】params を解決
  const character = await getCharacter(resolvedParams.name); // 【変更不可！】解決された params を使用

  if (!character) {
    return <div>キャラが見つかりません。</div>;
  }

  return (
    <div>
      <h1>{character.name}</h1>
      <p>Rarity: {character.rarity}</p>
      {/* 他の情報を表示 */}
      <UpdatedCharacter character={character} />
    </div>
  );
}