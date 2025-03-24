// src/app/page.tsx

import AddCharacter from '@/components/AddCharacter';
import { supabase } from '@/app/supabaseClient';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';

async function getCharacters() {
  const { data, error } = await supabase.from('characters').select('*');

  if (error) {
    console.error('キャラデータ取得エラー:', error);
    return [];
  }

  return data;
}



export default async function Home() {
  const characters = await getCharacters();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1>キャラ一覧</h1>
        <ul>
          {characters.map((character) => (
            <li key={character.id}>
              <Link href={`/character/${encodeURIComponent(character.name)}`}>
                {character.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <AddCharacter />
      <AuthModal />

    </main>
  );
}