-- ============================================
-- SUPABASE SETUP COMPLET
-- Le Laboratoire Fabuleux - Version Production
-- ============================================

-- 1. TABLE CLASSES
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_name TEXT NOT NULL,
  school_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE TEAMS (ÉQUIPES)
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  team_number INTEGER NOT NULL,
  team_name TEXT,
  members JSONB DEFAULT '[]'::jsonb,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 4),
  budget INTEGER DEFAULT 100,
  discovery_points INTEGER DEFAULT 0,
  reasoning_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, team_number)
);

-- 3. TABLE RESOURCES (RESSOURCES ÉDUCATIVES)
-- ============================================
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY, -- 'r1', 'r2', etc.
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  link TEXT,
  in_class BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLE PURCHASED_RESOURCES (ACHATS)
-- ============================================
CREATE TABLE IF NOT EXISTS purchased_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, resource_id)
);

-- ============================================
-- TRIGGERS POUR UPDATED_AT
-- ============================================

-- Fonction générique pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
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

DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLICIES RLS (Row Level Security)
-- ============================================

-- Activer RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_resources ENABLE ROW LEVEL SECURITY;

-- Policies publiques (lecture/écriture pour tous)
-- CLASSES
DROP POLICY IF EXISTS "Enable all access for classes" ON classes;
CREATE POLICY "Enable all access for classes" ON classes
  FOR ALL USING (true) WITH CHECK (true);

-- TEAMS
DROP POLICY IF EXISTS "Enable all access for teams" ON teams;
CREATE POLICY "Enable all access for teams" ON teams
  FOR ALL USING (true) WITH CHECK (true);

-- RESOURCES
DROP POLICY IF EXISTS "Enable all access for resources" ON resources;
CREATE POLICY "Enable all access for resources" ON resources
  FOR ALL USING (true) WITH CHECK (true);

-- PURCHASED_RESOURCES
DROP POLICY IF EXISTS "Enable all access for purchased_resources" ON purchased_resources;
CREATE POLICY "Enable all access for purchased_resources" ON purchased_resources
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- INSERTION DES RESSOURCES PAR DÉFAUT
-- ============================================

-- Supprimer les ressources existantes si on réinitialise
TRUNCATE resources CASCADE;

-- Insérer toutes les ressources du catalogue
INSERT INTO resources (id, level, type, title, description, price, link, in_class) VALUES
-- Niveau 2 - Examens médicaux (vidéos)
('r1', 2, 'examens médicaux (vidéos)', 'Vidéo de déglutition - radiographie', 'On observe une personne qui mâche et avale aux rayons X (radiographie)', 50, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/X-ray_%20Swallow.flv', false),
('r2', 2, 'examens médicaux (vidéos)', 'Vidéo de déglutition - endoscopie', 'Une caméra descend dans le pharynx, on observe la déglutition. + modèle explicatif', 50, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Deglutition.avi', false),
('r3', 2, 'examens médicaux (vidéos)', 'Endoscopie de la partie supérieure du système digestif', 'Une caméra descend dans le tube digestif, on observe la partie supérieure du système digestif.', 50, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Endoscopie-SortieduDuodenumEstomacOesophage.flv', false),
('r4', 2, 'examens médicaux (vidéos)', 'Vidéo au rayon X du tube digestif en fonctionnement', 'On observe une personne qui digère aux rayons X (radiographie) une pâte opaque aux rayons.', 70, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Radiographie-Trajetdesaliments.flv', false),
('r5', 2, 'examens médicaux (vidéos)', 'Divers examens de l''estomac', 'Extrait de vidéo documentaire sur l''estomac', 100, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Estomac.flv', false),
('r6', 2, 'examens médicaux (vidéos)', 'Divers examens de l''intestin grêle', 'Extrait de vidéo documentaire sur l''intestin grêle.', 100, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/IntestinGrele.flv', false),
('r7', 2, 'examens médicaux (vidéos)', 'Divers examens du gros intestin', 'Extrait de vidéo documentaire sur le colon', 100, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/GrosIntestin.flv', false),
('r8', 2, 'examens médicaux (vidéos)', 'Divers examens au niveau de la bouche', 'Extrait de vidéo documentaire sur la bouche', 100, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Videos/Video-Bouche.flv', false),

-- Niveau 1 - Ressources anatomiques
('r9', 1, 'Ressources anatomique', 'Modèle anatomique 3D', 'Un site pour l''anatomie humaine en 3D', 50, 'https://zygotebody.com/', false),
('r10', 1, 'Ressources anatomique', 'AIDE 3D : Système digestif', 'aide : que le système digestif', 200, 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u', false),
('r11', 1, 'Ressources anatomique', 'AIDE 3D : Bile Pancréas', 'aide : "pour mieux comprendre le trajet de la bile et des sucs pancréatiques"', 200, 'https://human.biodigital.com/widget?be=qlw&ui-annotations=true&ui-dissect=true&ui-xray=true&uaid=1gm9u', false),
('r12', 1, 'Ressources anatomique', 'Modèle anatomique (plastique)', 'Utiliser le modèle en plastique présent dans la salle', 20, '', true),
('r13', 1, 'Ressources anatomique', 'Squelette', 'Utiliser le squelette présent dans la salle', 20, '', true),

-- Niveau 1 - Ressources pour observations
('r14', 1, 'Ressources pour observations', 'Microscope et préparations microscopiques', 'Microscope et préparations microscopiques (lames minces) pour l''observation de diverses parties du corps (peau, foie, pancréas, intestins, …)', 70, '', true),
('r15', 1, 'Ressources pour observations', 'Loupes binoculaires', '', 50, '', true),
('r16', 1, 'Ressources pour observations', 'Dissection (poulet, lapin, …)', 'Attention une requête doit être formulée une semaine avant …', 150, 'https://tube-sciences-technologies.apps.education.fr/w/cSTMHDW3XVuPbp2fLvj8zH', false),
('r17', 1, 'Ressources pour observations', 'Observation de selles animales', 'Photographie commentée de comparaisons de selles animales', 20, 'https://drive.google.com/file/d/18T_L__BbwAa7huC0I7XsAkPOvBDo2vqi/view?usp=sharing', false),
('r18', 2, 'Ressources pour observations', 'Lames minces de bactéries de la flore intestinales (microbiote)', 'Frottis de contenu intestinal coloré pour détecter les Bactéries', 100, '', true),

-- Niveau 1 - Ressources historiques
('r19', 1, 'Ressources historiques', 'Expériences historiques Réaumur, Spallanzani, Beaumont', 'Un fichier regroupant des expériences historiques sur la digestion (contexte, expériences, résultats obtenus …)', 70, 'https://www.pedagogie.ac-nantes.fr/medias/fichier/experiences_1459779287861-pdf?INLINE=FALSE', false),

-- Niveau 2 - Ressources expérimentales
('r20', 2, 'Ressources expérimentales', 'Protocole + kit Digestion in-vitro', 'Du matériel et une fiche permettant de faire une expérience de digestion in-vitro. ** A demander une semaine avant **', 150, '', true),
('r21', 2, 'Ressources expérimentales', 'Résultats de dissection de système digestif', 'Un site où vous retrouverez des photos commentées des étapes de la dissection d''une souris.', 200, 'https://echapot.wixsite.com/svtaubrac/copie-de-la-digestion', false),
('r22', 2, 'Ressources expérimentales', 'Expérience de digestion par des micro-organismes', 'Du matériel et une fiche permettant de faire une expérience où des micro-organismes digèrent des aliments.', 150, '', true),

-- Niveau 3 - Résultats d'analyses médicales
('r23', 3, 'Résultats d''analyses médicales', 'Pack d''analyses : analyse d''urine et analyse de sang', 'Des documents relatant les résultats d''analyse de sang et d''analyses d''urine - un tableau comparatif peut être imprimé', 50, 'https://drive.google.com/file/d/1sBl1LLbC_BhH-ZOyGP008mBh8n5klUtD/view?usp=sharing', false),
('r24', 2, 'Résultats d''analyses médicales', 'Analyse des liquides (eau minérale, jus de fruit, ...)', 'Différentes étiquettes de composition de boissons.', 20, 'https://drive.google.com/file/d/1sVQvDo0hxTbQ_zeJlJB37IB-j3tgyuVI/view?usp=sharing', false),
('r25', 3, 'Résultats d''analyses médicales', 'Comparaison de la concentration en sucre avant et après l''intestin grêle', 'Résultat d''expérience et graphique', 100, 'https://drive.google.com/file/d/0Bzssu-9nqRWyNDlWRVlZS2xjc2c/view?usp=sharing&resourcekey=0-AWgsNgAwurPIEkMdoQeW7Q', false),
('r26', 3, 'Résultats d''analyses médicales', 'Mesure chimique des quantités de nutriments tout le long du tube digestif', 'Schéma d''interprétation de résultats', 300, '', true),
('r27', 2, 'Résultats d''analyses médicales', 'Analyse de la composition des aliments', 'Différentes étiquettes de composition d''aliments.', 20, 'http://www.lanutrition.fr/les-aliments-a-la-loupe.html?layout=advanced', false),

-- Niveau 1 - Ressources documentaires
('r28', 1, 'Ressources documentaires', 'Articles de presse sur les selles', 'Un article grand public qui permet de tester sa santé en observant l''état de ses selles.', 10, 'https://www.livi.fr/en-bonne-sante/selles/', false),
('r29', 1, 'Ressources documentaires', 'Analyse de composition des aliments', 'L''analyse des étiquettes alimentaires devrait permettre de trouver de quoi sont composé les aliments ou quels sont les 7 nutriments.', 10, '', true),
('r30', 4, 'Ressources documentaires', 'Recherche documentaire (livre, internet, …)', 'Sur la fiche de requête, le sujet de recherche doit être très précis et différent du problème à résoudre.', 300, 'https://www.ecosia.org/?c=fr', false),

-- Niveau 2 - Aides
('r31', 2, 'Aides', 'Rappel sur les surfaces d''échanges', 'Vous regardez dans vos anciens cours pour vous souvenir ce qu''est une surface d''échanges.', 10, '', true),
('r32', 2, 'Aides', 'Aides calcul surface intestin', 'Vous demandez de l''aide à un collègue de labo qui est plutôt doué pour ces questions de Math…', 50, '', true),
('r33', 1, 'Ressources documentaires', 'Article de presse de divertissement', 'Comment avoir un ventre plat !', 10, 'https://www.elle.fr/Minceur/News/Nutrition-Sante/Microbiote-Comment-les-prebiotiques-equilibrent-la-flore-intestinale-3735125', false),
('r34', 1, 'Ressources pour observations', 'Observations quotidiennes sur la digestion', 'Des notes rédigées par des personnes sur leurs soucis de digestion', 10, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/ObsQuot.pdf', false),
('r35', 2, 'Aides', 'Aide sur simplification des glucides', 'Vous plongez dans vos anciens cours de chimie pour retrouver comment les aliments sont simplifiés en nutriments solubles', 10, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/SchémaGlucidesSVT.pdf', false),
('r36', 2, 'Aides', 'Aides sur les enzymes', 'Vous retrouvez vos anciens cours de biochimie pour comprendre comment les enzymes agissent.', 20, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/AIDE-Enzymes.pdf', false),
('r37', 1, 'Aides', 'Comment faire une copie d''écran', 'Une aide pour comprendre comment faire une copie d''écran et pouvoir ajouter l''impression sur le carnet d''investigation', 10, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/CopieEcran.pdf', false),
('r38', 1, 'Aides', 'Rappel sur la démarche scientifique', 'Une aide pour retrouver les étapes de la démarche scientifique et comment remplir le livret d''investigation', 10, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/DemSc.pdf', false),
('r39', 2, 'Ressources documentaires', 'Fiche sur les maladies en rapport avec la bile', 'Une fiche avec des informations sur les maladies en rapport avec la bile', 30, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/MaladieBile.pdf', false),
('r40', 2, 'Ressources anatomique', 'Une fiche anatomique sur le pancréas et la vésicule biliaire', 'Un schéma pour retrouver le fonctionnement du pancréas et de la vésicule biliaire', 30, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/pancreas-anat.jpg', false),
('r41', 2, 'Ressources anatomique', 'Une fiche anatomique des organes du système digestif', 'Un schéma très dense en information sur les noms des différents organes', 20, 'https://lelaboratoirefabuleux.com/SeriousGame/DigestionRessources/Docs/planche-Anat-Syst-Dig.pdf', false);

-- ============================================
-- INDEX POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_teams_class_id ON teams(class_id);
CREATE INDEX IF NOT EXISTS idx_purchased_resources_team_id ON purchased_resources(team_id);
CREATE INDEX IF NOT EXISTS idx_purchased_resources_resource_id ON purchased_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_resources_level ON resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);

-- ============================================
-- VUES UTILES (optionnel)
-- ============================================

-- Vue pour voir les équipes avec leurs stats calculées
CREATE OR REPLACE VIEW teams_with_stats AS
SELECT 
  t.*,
  (t.discovery_points + t.reasoning_points) as total_reputation,
  CASE 
    WHEN (t.discovery_points + t.reasoning_points) >= 15 THEN 4
    WHEN (t.discovery_points + t.reasoning_points) >= 10 THEN 3
    WHEN (t.discovery_points + t.reasoning_points) >= 5 THEN 2
    ELSE 1
  END as calculated_level,
  c.class_name,
  c.school_year
FROM teams t
JOIN classes c ON t.class_id = c.id;

-- Vue pour voir les ressources achetées avec détails
CREATE OR REPLACE VIEW purchased_resources_details AS
SELECT 
  pr.id,
  pr.team_id,
  pr.purchased_at,
  r.*,
  t.team_number,
  t.team_name,
  c.class_name
FROM purchased_resources pr
JOIN resources r ON pr.resource_id = r.id
JOIN teams t ON pr.team_id = t.id
JOIN classes c ON t.class_id = c.id;

-- ============================================
-- TERMINÉ !
-- ============================================

-- Vérification
SELECT 'Setup complet terminé !' as message,
       (SELECT COUNT(*) FROM classes) as nb_classes,
       (SELECT COUNT(*) FROM teams) as nb_teams,
       (SELECT COUNT(*) FROM resources) as nb_resources,
       (SELECT COUNT(*) FROM purchased_resources) as nb_purchases;
