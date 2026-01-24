-- ============================================
-- MIGRATION : Ajouter support ABS et NN
-- ============================================
-- Ce script corrige la table team_member_sessions
-- pour supporter les valeurs ABS et NN

-- ⚠️ ATTENTION : Ce script supprime les données existantes
-- Si vous avez des notes déjà enregistrées, faites d'abord
-- une sauvegarde de votre base de données Supabase !

-- ÉTAPE 1 : Supprimer la table existante
DROP TABLE IF EXISTS team_member_sessions CASCADE;

-- ÉTAPE 2 : Recréer la table avec VARCHAR(3)
CREATE TABLE team_member_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  session_1 VARCHAR(3) DEFAULT '0' CHECK (session_1 IN ('0','1','2','3','4','5','ABS','NN')),
  session_2 VARCHAR(3) DEFAULT '0' CHECK (session_2 IN ('0','1','2','3','4','5','ABS','NN')),
  session_3 VARCHAR(3) DEFAULT '0' CHECK (session_3 IN ('0','1','2','3','4','5','ABS','NN')),
  session_4 VARCHAR(3) DEFAULT '0' CHECK (session_4 IN ('0','1','2','3','4','5','ABS','NN')),
  session_5 VARCHAR(3) DEFAULT '0' CHECK (session_5 IN ('0','1','2','3','4','5','ABS','NN')),
  session_6 VARCHAR(3) DEFAULT '0' CHECK (session_6 IN ('0','1','2','3','4','5','ABS','NN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, member_name)
);

-- ÉTAPE 3 : Ajouter le trigger pour updated_at
CREATE TRIGGER update_team_member_sessions_updated_at
  BEFORE UPDATE ON team_member_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ÉTAPE 4 : Activer RLS (Row Level Security)
ALTER TABLE team_member_sessions ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 5 : Créer la policy d'accès
CREATE POLICY "Enable all access for team_member_sessions" 
  ON team_member_sessions FOR ALL 
  USING (true) WITH CHECK (true);

-- ÉTAPE 6 : Créer l'index pour les performances
CREATE INDEX idx_team_member_sessions_team_id ON team_member_sessions(team_id);

-- ============================================
-- VÉRIFICATION (optionnel)
-- ============================================
-- Vérifier que la table a été créée correctement
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'team_member_sessions'
  AND column_name LIKE 'session_%'
ORDER BY column_name;

-- Résultat attendu :
-- session_1 | character varying | 3
-- session_2 | character varying | 3
-- session_3 | character varying | 3
-- session_4 | character varying | 3
-- session_5 | character varying | 3
-- session_6 | character varying | 3

-- ============================================
-- MIGRATION TERMINÉE ✅
-- ============================================
