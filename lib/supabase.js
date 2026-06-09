// lib/supabase.js — REMPLACÉ PAR API PHP
// Ce fichier est conservé pour ne pas casser les imports existants
// mais ne fait plus rien — tout passe par gameStore.js via l'API PHP

export const supabase = null;

export async function testConnection() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${base}/resources.php`);
    if (res.ok) {
      console.log('✅ Connexion API PHP OK');
      return true;
    }
    return false;
  } catch (e) {
    console.error('❌ Erreur connexion API PHP:', e.message);
    return false;
  }
}
