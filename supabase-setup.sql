-- =====================================================
-- SCRIPT SQL COMPLET POUR SUPABASE
-- Le Laboratoire Fabuleux v7.0
-- =====================================================
-- Instructions :
-- 1. Ouvrez Supabase SQL Editor
-- 2. Copiez-collez ce script complet
-- 3. Cliquez sur "Run"
-- =====================================================

-- Nettoyage (si vous recommencez)
-- DROP TABLE IF EXISTS purchased_resources CASCADE;
-- DROP TABLE IF EXISTS teams CASCADE;
-- DROP TABLE IF EXISTS classes CASCADE;

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_year TEXT NOT NULL,
  class_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT classes_school_year_check CHECK (length(school_year) > 0),
  CONSTRAINT classes_class_name_check CHECK (length(class_name) > 0)
);

-- Table des équipes
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  team_number INTEGER NOT NULL,
  team_name TEXT,
  members JSONB NOT NULL DEFAULT '[]',
  level INTEGER DEFAULT 1,
  budget INTEGER DEFAULT 100,
  discovery_points INTEGER DEFAULT 0,
  reasoning_points INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT teams_level_check CHECK (level >= 1 AND level <= 4),
  CONSTRAINT teams_budget_check CHECK (budget >= 0),
  CONSTRAINT teams_discovery_points_check CHECK (discovery_points >= 0),
  CONSTRAINT teams_reasoning_points_check CHECK (reasoning_points >= 0),
  CONSTRAINT teams_unique_number UNIQUE(class_id, team_number)
);

-- Table des ressources achetées
CREATE TABLE IF NOT EXISTS purchased_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  resource_data JSONB NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT purchased_resources_resource_data_check CHECK (resource_data IS NOT NULL)
);

-- =====================================================
-- INDEX POUR AMÉLIORER LES PERFORMANCES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_teams_class_id ON teams(class_id);
CREATE INDEX IF NOT EXISTS idx_teams_level ON teams(level);
CREATE INDEX IF NOT EXISTS idx_purchased_resources_team_id ON purchased_resources(team_id);
CREATE INDEX IF NOT EXISTS idx_classes_created_at ON classes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at DESC);

-- =====================================================
-- FONCTION POUR METTRE À JOUR updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS POUR updated_at
-- =====================================================

DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at 
    BEFORE UPDATE ON classes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON teams;
CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON teams
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_resources ENABLE ROW LEVEL SECURITY;

-- Politique permissive pour le développement
-- ⚠️ Pour la production, créez des politiques plus strictes basées sur l'authentification

DROP POLICY IF EXISTS "Allow public read access" ON classes;
CREATE POLICY "Allow public read access" 
    ON classes FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON classes;
CREATE POLICY "Allow public write access" 
    ON classes FOR ALL 
    USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON teams;
CREATE POLICY "Allow public read access" 
    ON teams FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON teams;
CREATE POLICY "Allow public write access" 
    ON teams FOR ALL 
    USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON purchased_resources;
CREATE POLICY "Allow public read access" 
    ON purchased_resources FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public write access" ON purchased_resources;
CREATE POLICY "Allow public write access" 
    ON purchased_resources FOR ALL 
    USING (true);

-- =====================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =====================================================
-- Décommentez ces lignes pour créer des données de test

/*
-- Créer une classe de test
INSERT INTO classes (school_year, class_name)
VALUES ('2024-2025', '3ème A');

-- Récupérer l'ID de la classe (remplacez VOTRE-CLASS-ID ci-dessous)
-- SELECT id FROM classes WHERE class_name = '3ème A';

-- Créer des équipes de test (remplacez VOTRE-CLASS-ID)
INSERT INTO teams (class_id, team_number, team_name, members, level, budget, discovery_points, reasoning_points)
VALUES 
  ('VOTRE-CLASS-ID', 1, 'Les Scientifiques', '["Alice Dupont", "Bob Martin"]'::jsonb, 1, 100, 0, 0),
  ('VOTRE-CLASS-ID', 2, 'Les Explorateurs', '["Claire Durand", "David Petit"]'::jsonb, 1, 100, 0, 0);
*/

-- =====================================================
-- VUES UTILES (OPTIONNEL)
-- =====================================================

-- Vue pour afficher les équipes avec leurs statistiques
CREATE OR REPLACE VIEW team_stats AS
SELECT 
  t.id,
  t.team_name,
  t.team_number,
  t.level,
  t.budget,
  t.discovery_points,
  t.reasoning_points,
  (t.discovery_points + t.reasoning_points) as total_points,
  c.class_name,
  c.school_year,
  COUNT(pr.id) as resources_purchased
FROM teams t
LEFT JOIN classes c ON t.class_id = c.id
LEFT JOIN purchased_resources pr ON t.id = pr.team_id
GROUP BY t.id, c.id;

-- =====================================================
-- FONCTIONS UTILES
-- =====================================================

-- Fonction pour calculer le niveau d'une équipe
CREATE OR REPLACE FUNCTION calculate_team_level(total_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN LEAST(FLOOR(total_points / 5) + 1, 4);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour calculer le budget total selon le niveau
CREATE OR REPLACE FUNCTION calculate_total_budget(current_level INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total INTEGER := 100; -- Budget de départ
BEGIN
  IF current_level >= 2 THEN total := total + 100; END IF;
  IF current_level >= 3 THEN total := total + 300; END IF;
  IF current_level >= 4 THEN total := total + 500; END IF;
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VÉRIFICATION FINALE
-- =====================================================

-- Afficher toutes les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Afficher le nombre de lignes dans chaque table
SELECT 
  'classes' as table_name, COUNT(*) as count FROM classes
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'purchased_resources', COUNT(*) FROM purchased_resources;

-- =====================================================
-- SCRIPT TERMINÉ
-- =====================================================
-- ✅ Vos tables sont prêtes à être utilisées !
-- 
-- Prochaines étapes :
-- 1. Notez l'URL de votre projet Supabase
-- 2. Récupérez votre clé API "anon public"
-- 3. Configurez votre fichier .env.local
-- 4. Lancez l'application : npm run dev
-- =====================================================
