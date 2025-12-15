-- ==============================================
-- CREATE PORTFOLIO-FILES BUCKET FOR CV/RESUME
-- ==============================================
-- File: CREATE_PORTFOLIO_FILES_BUCKET.sql
-- Description: SQL script untuk membuat bucket portfolio-files dan policies
-- Usage: Jalankan script ini di SQL Editor Supabase
-- ==============================================

-- Create the portfolio-files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', true)
ON CONFLICT (id) DO UPDATE
SET name = 'portfolio-files', public = true;

-- Drop existing policies if they exist (to allow re-running script)
DROP POLICY IF EXISTS "Portfolio files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "CV files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload CV files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update CV files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete CV files" ON storage.objects;

-- Allow public access to portfolio-files
CREATE POLICY "Portfolio files are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-files');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload portfolio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-files');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update portfolio files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-files');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete portfolio files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-files');

-- Alternative policies with CV-specific names (for backward compatibility)
CREATE POLICY "CV files are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-files');

CREATE POLICY "Authenticated users can upload CV files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-files');

CREATE POLICY "Authenticated users can update CV files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-files');

CREATE POLICY "Authenticated users can delete CV files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-files');

-- ==============================================
-- VERIFICATION
-- ==============================================

-- Check if bucket was created
SELECT 
  '✅ Bucket created successfully!' as status,
  id,
  name,
  public
FROM storage.buckets
WHERE id = 'portfolio-files';

-- Show all policies for portfolio-files bucket
SELECT 
  '✅ Policies created:' as info,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%portfolio%' OR policyname LIKE '%CV%'
ORDER BY policyname;

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================
-- 
-- Your portfolio-files bucket is now ready to use!
-- You can now upload CV/resume files from the admin profile page.
-- 
-- ==============================================

