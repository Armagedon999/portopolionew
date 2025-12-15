/*
  # Setup CV/Resume Storage Policies for portfolio-files Bucket

  This migration sets up storage policies for CV/resume documents
  in the existing portfolio-files bucket.
  
  Note: The bucket 'portfolio-files' should already exist.
  This migration only adds the necessary policies.
*/

-- Drop existing policies if they exist (to allow re-running migration)
DROP POLICY IF EXISTS "CV files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload CV files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update CV files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete CV files" ON storage.objects;

-- Allow public access to CV files in portfolio-files bucket
CREATE POLICY "CV files are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-files');

-- Allow authenticated users to upload CV files
CREATE POLICY "Authenticated users can upload CV files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-files');

-- Allow authenticated users to update CV files
CREATE POLICY "Authenticated users can update CV files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-files');

-- Allow authenticated users to delete CV files
CREATE POLICY "Authenticated users can delete CV files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-files');

