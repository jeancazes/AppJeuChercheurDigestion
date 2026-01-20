-- =====================================================
-- CORRECTION DES POLITIQUES RLS
-- À exécuter dans Supabase SQL Editor
-- =====================================================
-- Ce script corrige l'erreur "row-level security policy violation"
-- =====================================================

-- OPTION 1 : Désactiver RLS temporairement (pour tester)
-- =====================================================
-- Décommentez ces lignes si vous voulez désactiver RLS

/*
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchased_resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
*/

-- OPTION 2 : Créer des politiques permissives (RECOMMANDÉ)
-- =====================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read access" ON classes;
DROP POLICY IF EXISTS "Allow public write access" ON classes;

DROP POLICY IF EXISTS "Allow public read access" ON teams;
DROP POLICY IF EXISTS "Allow public write access" ON teams;

DROP POLICY IF EXISTS "Allow public read access" ON purchased_resources;
DROP POLICY IF EXISTS "Allow public write access" ON purchased_resources;

DROP POLICY IF EXISTS "Allow public read access" ON resources;

-- Créer de nouvelles politiques COMPLÈTES pour CLASSES
CREATE POLICY "Enable all for classes"
ON classes
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Créer de nouvelles politiques COMPLÈTES pour TEAMS
CREATE POLICY "Enable all for teams"
ON teams
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Créer de nouvelles politiques COMPLÈTES pour PURCHASED_RESOURCES
CREATE POLICY "Enable all for purchased_resources"
ON purchased_resources
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Créer de nouvelles politiques pour RESOURCES (lecture seule)
CREATE POLICY "Enable read for resources"
ON resources
FOR SELECT
TO public
USING (true);

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Afficher toutes les politiques actives
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- TEST D'INSERTION
-- =====================================================

-- Tester l'insertion d'une classe
INSERT INTO classes (school_year, class_name)
VALUES ('2024-2025', 'Classe de test')
RETURNING *;

-- Si ça fonctionne, supprimer la classe de test
-- DELETE FROM classes WHERE class_name = 'Classe de test';

-- =====================================================
-- EXPLICATION
-- =====================================================
-- 
-- WITH CHECK (true) : Permet l'INSERT et UPDATE
-- USING (true) : Permet le SELECT et DELETE
-- FOR ALL : S'applique à toutes les opérations (SELECT, INSERT, UPDATE, DELETE)
-- TO public : S'applique à tous les utilisateurs
-- 
-- Cette configuration permet toutes les opérations sur toutes les tables
-- C'est adapté pour le développement et les petites applications
-- 
-- ⚠️ Pour la production, vous pouvez créer des politiques plus strictes
-- basées sur l'authentification des utilisateurs
-- 
-- =====================================================
