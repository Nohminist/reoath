// types/supabase.ts

export interface Character {
  id: string;
  name: string;
  rarity: string | null;
}

export interface CharacterChange {
  name: string;
  rarity: string | null;
}

export interface Log {
  id: string;
  logged_at: string;
  user_id: string;
  affected_table: string;
  affected_record_id: string;
  changed_data: CharacterChange ;
}

