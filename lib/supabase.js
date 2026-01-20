import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérification que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes !');
  console.error('Assurez-vous que .env.local contient :');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Pas besoin de session pour l'instant
  },
});

// Fonction helper pour vérifier la connexion
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('classes').select('count');
    if (error) throw error;
    console.log('✅ Connexion Supabase OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Supabase:', error.message);
    return false;
  }
}
