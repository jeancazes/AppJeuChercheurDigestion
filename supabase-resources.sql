-- =====================================================
-- AJOUT DE LA TABLE DES RESSOURCES ÉDUCATIVES
-- À exécuter dans Supabase SQL Editor
-- =====================================================

-- Créer la table des ressources
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('LEVEL 1', 'LEVEL 2', 'LEVEL 3', 'LEVEL 4')),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price > 0),
  title_link TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT resources_unique_title UNIQUE(title)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_resources_level ON resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- Activer RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Politique permissive (tout le monde peut lire)
DROP POLICY IF EXISTS "Allow public read access" ON resources;
CREATE POLICY "Allow public read access" 
    ON resources FOR SELECT 
    USING (true);

-- =====================================================
-- INSERTION DES RESSOURCES ÉDUCATIVES
-- =====================================================

-- LEVEL 1 - Observations et Livres
INSERT INTO resources (level, type, title, description, price, title_link, link) VALUES
('LEVEL 1', 'Observation', 'Observation de cellules au microscope', 'Découvrez la structure des cellules végétales et animales au microscope optique', 30, 'observation-cellules', 'https://example.com/obs-cellules'),
('LEVEL 1', 'Observation', 'Observation du système digestif', 'Schémas annotés et légendés du système digestif humain complet', 25, 'observation-digestif', 'https://example.com/obs-digestif'),
('LEVEL 1', 'Livre', 'Livre: Les fondamentaux de la digestion', 'Manuel illustré détaillant le processus complet de la digestion', 40, 'livre-digestion', 'https://example.com/livre-digestion'),
('LEVEL 1', 'Livre', 'Atlas anatomique illustré', 'Atlas complet du corps humain avec focus sur le système digestif', 50, 'atlas-anatomique', 'https://example.com/atlas'),

-- LEVEL 2 - Dissections et Expériences
('LEVEL 2', 'Dissection', 'Dissection virtuelle: Appareil digestif', 'Exploration interactive en 3D des organes du système digestif', 60, 'dissection-virtuelle', 'https://example.com/dissection'),
('LEVEL 2', 'Dissection', 'Kit de dissection de grenouille', 'Étude comparative du système digestif des amphibiens', 55, 'kit-grenouille', 'https://example.com/kit-grenouille'),
('LEVEL 2', 'Expérience', 'Expérience: Action de la salive', 'Protocole expérimental sur la digestion enzymatique salivaire', 45, 'exp-salive', 'https://example.com/exp-salive'),
('LEVEL 2', 'Expérience', 'Test des nutriments', 'Kit de tests chimiques pour identifier glucides, lipides et protéines', 50, 'test-nutriments', 'https://example.com/test-nutriments'),

-- LEVEL 3 - Analyses et Doc Médical
('LEVEL 3', 'Analyse', 'Analyse de suc gastrique', 'Étude détaillée de la composition et du pH du suc gastrique', 70, 'analyse-gastrique', 'https://example.com/analyse-gastrique'),
('LEVEL 3', 'Analyse', 'Analyse microscopique des villosités', 'Observation détaillée au microscope électronique de l''intestin grêle', 65, 'analyse-villosites', 'https://example.com/analyse-villosites'),
('LEVEL 3', 'Doc Médical', 'Dossier médical: Pathologies digestives', 'Études de cas cliniques de maladies du système digestif', 80, 'doc-pathologies', 'https://example.com/doc-pathologies'),
('LEVEL 3', 'Doc Médical', 'Imagerie médicale digestive', 'Collection d''IRM et scanners du système digestif commentés', 75, 'imagerie-medicale', 'https://example.com/imagerie'),

-- LEVEL 4 - Synthèses
('LEVEL 4', 'Synthèse', 'Synthèse: De la bouche au sang', 'Document complet sur l''absorption et le transport des nutriments', 100, 'synthese-complete', 'https://example.com/synthese'),
('LEVEL 4', 'Synthèse', 'Modélisation 3D du système digestif', 'Application de modélisation interactive du processus digestif', 120, 'modelisation-3d', 'https://example.com/model-3d'),
('LEVEL 4', 'Synthèse', 'Conférence: Recherches actuelles', 'Vidéo de conférence sur les dernières recherches en gastro-entérologie', 90, 'conference-recherche', 'https://example.com/conference');

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Compter les ressources par niveau
SELECT 
  level, 
  COUNT(*) as nombre_ressources,
  SUM(price) as prix_total
FROM resources
GROUP BY level
ORDER BY level;

-- Afficher toutes les ressources
SELECT * FROM resources ORDER BY level, type, title;

-- =====================================================
-- RÉSULTAT ATTENDU
-- =====================================================
-- LEVEL 1: 4 ressources (Observations: 2, Livres: 2)
-- LEVEL 2: 4 ressources (Dissections: 2, Expériences: 2)
-- LEVEL 3: 4 ressources (Analyses: 2, Doc Médical: 2)
-- LEVEL 4: 3 ressources (Synthèses: 3)
-- TOTAL: 15 ressources
-- =====================================================
