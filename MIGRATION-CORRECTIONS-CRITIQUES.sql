-- ============================================
-- MIGRATION : Corrections Critiques
-- ============================================
-- 1. Ajouter contrainte budget >= 0
-- 2. Changer valeur par défaut de '0' à 'NN'
-- 3. Convertir les '0' existants en 'NN'

-- ============================================
-- PARTIE 1 : Contrainte Budget
-- ============================================

-- Ajouter une contrainte CHECK pour empêcher budget négatif
ALTER TABLE teams 
  ADD CONSTRAINT check_budget_positive CHECK (budget >= 0);

-- Vérification : Corriger les budgets négatifs existants (si présents)
UPDATE teams 
SET budget = 0 
WHERE budget < 0;

-- ============================================
-- PARTIE 2 : Valeurs par Défaut Sessions
-- ============================================

-- Changer les valeurs par défaut de '0' à 'NN'
ALTER TABLE team_member_sessions 
  ALTER COLUMN session_1 SET DEFAULT 'NN';

ALTER TABLE team_member_sessions 
  ALTER COLUMN session_2 SET DEFAULT 'NN';

ALTER TABLE team_member_sessions 
  ALTER COLUMN session_3 SET DEFAULT 'NN';

ALTER TABLE team_member_sessions 
  ALTER COLUMN session_4 SET DEFAULT 'NN';

ALTER TABLE team_member_sessions 
  ALTER COLUMN session_5 SET DEFAULT 'NN';

ALTER TABLE team_member_sessions 
  ALTER COLUMN session_6 SET DEFAULT 'NN';

-- ============================================
-- PARTIE 3 : Convertir les '0' en 'NN'
-- ============================================

-- Convertir tous les '0' existants en 'NN'
-- (Seulement ceux qui n'ont pas encore été notés)

UPDATE team_member_sessions 
SET session_1 = 'NN' 
WHERE session_1 = '0';

UPDATE team_member_sessions 
SET session_2 = 'NN' 
WHERE session_2 = '0';

UPDATE team_member_sessions 
SET session_3 = 'NN' 
WHERE session_3 = '0';

UPDATE team_member_sessions 
SET session_4 = 'NN' 
WHERE session_4 = '0';

UPDATE team_member_sessions 
SET session_5 = 'NN' 
WHERE session_5 = '0';

UPDATE team_member_sessions 
SET session_6 = 'NN' 
WHERE session_6 = '0';

-- ============================================
-- VÉRIFICATIONS
-- ============================================

-- Vérifier que la contrainte existe
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'teams'::regclass 
  AND conname = 'check_budget_positive';

-- Vérifier les nouvelles valeurs par défaut
SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'team_member_sessions'
  AND column_name LIKE 'session_%'
ORDER BY column_name;

-- Compter les notes convertées
SELECT 
  COUNT(*) as total_enregistrements,
  SUM(CASE WHEN session_1 = 'NN' THEN 1 ELSE 0 END) as s1_nn,
  SUM(CASE WHEN session_2 = 'NN' THEN 1 ELSE 0 END) as s2_nn,
  SUM(CASE WHEN session_3 = 'NN' THEN 1 ELSE 0 END) as s3_nn,
  SUM(CASE WHEN session_4 = 'NN' THEN 1 ELSE 0 END) as s4_nn,
  SUM(CASE WHEN session_5 = 'NN' THEN 1 ELSE 0 END) as s5_nn,
  SUM(CASE WHEN session_6 = 'NN' THEN 1 ELSE 0 END) as s6_nn
FROM team_member_sessions;

-- Vérifier qu'il n'y a plus de '0'
SELECT COUNT(*) as nombre_de_zeros
FROM team_member_sessions
WHERE session_1 = '0' 
   OR session_2 = '0' 
   OR session_3 = '0'
   OR session_4 = '0' 
   OR session_5 = '0' 
   OR session_6 = '0';

-- Résultat attendu : 0

-- ============================================
-- TEST : Vérifier que budget négatif est bloqué
-- ============================================

-- Ce test devrait ÉCHOUER avec une erreur de contrainte
-- (Décommentez pour tester, puis recommentez)

-- UPDATE teams 
-- SET budget = -100 
-- WHERE id = (SELECT id FROM teams LIMIT 1);

-- Si l'erreur apparaît : ✅ La contrainte fonctionne !
-- Erreur attendue : "new row for relation "teams" violates check constraint "check_budget_positive""

-- ============================================
-- MIGRATION TERMINÉE ✅
-- ============================================

-- Résumé des changements :
-- 1. ✅ Contrainte budget >= 0 ajoutée
-- 2. ✅ Valeurs par défaut changées de '0' à 'NN'
-- 3. ✅ Tous les '0' convertis en 'NN'
-- 4. ✅ Moyennes ne seront plus faussées
-- 5. ✅ Budget ne peut plus devenir négatif
