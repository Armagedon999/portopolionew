-- ==============================================
-- COMPLETE DATABASE SETUP FOR PORTFOLIO PROJECT
-- ==============================================
-- File: COMPLETE_DATABASE_SETUP.sql
-- Description: Single file setup untuk deploy database portfolio project
-- Usage: Jalankan script ini di SQL Editor Supabase untuk setup lengkap
-- Author: Portfolio Project Setup
-- Date: 2025-01-15

-- ==============================================
-- 1. CREATE TABLES
-- ==============================================

-- Profiles table for developer information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text NOT NULL,
  bio text,
  avatar_url text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  github_url text,
  twitter_url text,
  website_url text,
  resume_url text,
  hero_title text,
  hero_subtitle text,
  hero_description text,
  hero_image_id uuid,
  about_image_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level integer DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  icon_url text,
  color text DEFAULT '#3B82F6',
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  short_description text,
  image_url text,
  demo_url text,
  repo_url text,
  tech_stack text[], -- Array of technologies used
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts table for form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Images table for managing portfolio images
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  url text NOT NULL,
  alt_text text,
  section text NOT NULL CHECK (section IN ('hero', 'about', 'portfolio', 'general')),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  file_size integer, -- in bytes
  mime_type text,
  width integer,
  height integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ==============================================
-- 2. ADD FOREIGN KEY CONSTRAINTS
-- ==============================================

-- Add foreign key constraints for image references
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS fk_profiles_hero_image 
  FOREIGN KEY (hero_image_id) REFERENCES images(id);
ALTER TABLE profiles ADD CONSTRAINT IF NOT EXISTS fk_profiles_about_image 
  FOREIGN KEY (about_image_id) REFERENCES images(id);

-- ==============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ==============================================

-- Images table indexes
CREATE INDEX IF NOT EXISTS idx_images_section ON images(section);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(is_active);
CREATE INDEX IF NOT EXISTS idx_images_sort_order ON images(sort_order);

-- Skills table indexes
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON skills(is_featured);
CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON skills(sort_order);

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- Contacts table indexes
CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- ==============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 5. CREATE SECURITY POLICIES
-- ==============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_authenticated_all" ON profiles;
DROP POLICY IF EXISTS "skills_public_read" ON skills;
DROP POLICY IF EXISTS "skills_authenticated_all" ON skills;
DROP POLICY IF EXISTS "projects_public_read" ON projects;
DROP POLICY IF EXISTS "projects_authenticated_all" ON projects;
DROP POLICY IF EXISTS "contacts_public_insert" ON contacts;
DROP POLICY IF EXISTS "contacts_authenticated_read" ON contacts;
DROP POLICY IF EXISTS "contacts_authenticated_update" ON contacts;
DROP POLICY IF EXISTS "images_public_read" ON images;
DROP POLICY IF EXISTS "images_authenticated_all" ON images;

-- Profiles policies
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT TO public
  USING (true);

CREATE POLICY "profiles_authenticated_all" ON profiles
  FOR ALL TO authenticated
  USING (true);

-- Skills policies
CREATE POLICY "skills_public_read" ON skills
  FOR SELECT TO public
  USING (true);

CREATE POLICY "skills_authenticated_all" ON skills
  FOR ALL TO authenticated
  USING (true);

-- Projects policies
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT TO public
  USING (status = 'published');

CREATE POLICY "projects_authenticated_all" ON projects
  FOR ALL TO authenticated
  USING (true);

-- Contacts policies
CREATE POLICY "contacts_public_insert" ON contacts
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "contacts_authenticated_read" ON contacts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "contacts_authenticated_update" ON contacts
  FOR UPDATE TO authenticated
  USING (true);

-- Images policies
CREATE POLICY "images_public_read" ON images
  FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "images_authenticated_all" ON images
  FOR ALL TO authenticated
  USING (true);

-- ==============================================
-- 6. GRANT PERMISSIONS
-- ==============================================

-- Profiles table
GRANT SELECT ON profiles TO public;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- Skills table
GRANT SELECT ON skills TO public;
GRANT ALL ON skills TO authenticated;
GRANT ALL ON skills TO service_role;

-- Projects table
GRANT SELECT ON projects TO public;
GRANT ALL ON projects TO authenticated;
GRANT ALL ON projects TO service_role;

-- Contacts table
GRANT INSERT ON contacts TO public;
GRANT SELECT, UPDATE ON contacts TO authenticated;
GRANT ALL ON contacts TO service_role;

-- Images table
GRANT SELECT ON images TO public;
GRANT ALL ON images TO authenticated;
GRANT ALL ON images TO service_role;

-- ==============================================
-- 7. CREATE PUBLIC VIEWS
-- ==============================================

-- Drop existing views if they exist
DROP VIEW IF EXISTS public_profiles;
DROP VIEW IF EXISTS public_skills;
DROP VIEW IF EXISTS public_projects;
DROP VIEW IF EXISTS public_images;

-- Public profiles view
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
  id, full_name, title, bio, avatar_url, email, phone, location,
  linkedin_url, github_url, twitter_url, website_url, resume_url,
  hero_title, hero_subtitle, hero_description, hero_image_id, about_image_id,
  created_at, updated_at
FROM profiles;

-- Public skills view
CREATE OR REPLACE VIEW public_skills AS
SELECT 
  id, name, category, level, icon_url, color, sort_order, is_featured,
  created_at, updated_at
FROM skills;

-- Public projects view
CREATE OR REPLACE VIEW public_projects AS
SELECT 
  id, title, description, short_description, image_url, demo_url, repo_url,
  tech_stack, status, is_featured, sort_order, created_at, updated_at
FROM projects
WHERE status = 'published';

-- Public images view
CREATE OR REPLACE VIEW public_images AS
SELECT 
  id, name, description, url, alt_text, section, sort_order,
  file_size, mime_type, width, height, created_at, updated_at
FROM images
WHERE is_active = true;

-- Grant access to views
GRANT SELECT ON public_profiles TO public;
GRANT SELECT ON public_skills TO public;
GRANT SELECT ON public_projects TO public;
GRANT SELECT ON public_images TO public;

-- ==============================================
-- 8. CREATE UPDATED_AT TRIGGERS
-- ==============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
DROP TRIGGER IF EXISTS update_images_updated_at ON images;

-- Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 9. INSERT SAMPLE DATA
-- ==============================================

-- Insert sample images
INSERT INTO images (name, description, url, alt_text, section, sort_order) VALUES
('Hero Profile Image', 'Main profile image for hero section', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Professional headshot', 'hero', 1),
('About Section Image', 'Profile image for about section', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face', 'About me image', 'about', 1),
('Portfolio Background', 'Background image for portfolio section', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 'Portfolio background', 'portfolio', 1)
ON CONFLICT DO NOTHING;

-- Insert sample profile
INSERT INTO profiles (
  full_name, 
  title, 
  bio, 
  avatar_url,
  email, 
  phone, 
  location, 
  linkedin_url, 
  github_url, 
  twitter_url, 
  website_url, 
  resume_url, 
  hero_title, 
  hero_subtitle, 
  hero_description
) VALUES (
  'John Developer',
  'Full Stack Web Developer',
  'Passionate web developer with 5+ years of experience creating amazing digital experiences. I specialize in modern web technologies and love building innovative solutions that make a difference.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'john@example.com',
  '+1 (555) 123-4567',
  'San Francisco, CA',
  'https://linkedin.com/in/johndeveloper',
  'https://github.com/johndeveloper',
  'https://twitter.com/johndeveloper',
  'https://johndeveloper.com',
  'https://johndeveloper.com/resume.pdf',
  'Hi, I''m John',
  'Full Stack Web Developer',
  'I create modern, responsive web applications that deliver exceptional user experiences and robust functionality.'
)
ON CONFLICT DO NOTHING;

-- Update profile with image references
UPDATE profiles 
SET 
  hero_image_id = (SELECT id FROM images WHERE section = 'hero' LIMIT 1),
  about_image_id = (SELECT id FROM images WHERE section = 'about' LIMIT 1)
WHERE hero_image_id IS NULL OR about_image_id IS NULL;

-- Insert sample skills
INSERT INTO skills (name, category, level, color, sort_order, is_featured) VALUES
('JavaScript', 'Frontend', 90, '#F7DF1E', 1, true),
('React.js', 'Frontend', 85, '#61DAFB', 2, true),
('TypeScript', 'Frontend', 80, '#3178C6', 3, true),
('Tailwind CSS', 'Frontend', 85, '#06B6D4', 4, true),
('Node.js', 'Backend', 80, '#339933', 5, true),
('Python', 'Backend', 75, '#3776AB', 6, false),
('PostgreSQL', 'Database', 70, '#336791', 7, false),
('MongoDB', 'Database', 70, '#47A248', 8, false),
('AWS', 'Cloud', 65, '#FF9900', 9, false),
('Docker', 'DevOps', 70, '#2496ED', 10, false)
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, short_description, image_url, demo_url, repo_url, tech_stack, status, is_featured, sort_order) VALUES
('E-commerce Platform', 'A full-featured e-commerce platform with user authentication, shopping cart, payment integration, and admin dashboard. Built with modern technologies and best practices.', 'Modern e-commerce solution built with React and Node.js', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop', 'https://demo.example.com', 'https://github.com/johndeveloper/ecommerce', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'published', true, 1),
('Task Management App', 'A collaborative task management application with real-time updates, team collaboration, and project tracking. Features include drag-and-drop interface and advanced filtering.', 'Team collaboration tool with real-time updates', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop', 'https://tasks.example.com', 'https://github.com/johndeveloper/tasks', ARRAY['React', 'Socket.io', 'Express', 'MongoDB'], 'published', true, 2),
('Weather Dashboard', 'A beautiful weather dashboard showing current conditions, forecasts, and interactive maps. Features responsive design and real-time data updates.', 'Weather app with beautiful UI and detailed forecasts', 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop', 'https://weather.example.com', 'https://github.com/johndeveloper/weather', ARRAY['JavaScript', 'Chart.js', 'Weather API'], 'published', false, 3)
ON CONFLICT DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts (name, email, subject, message, is_read) VALUES
('Alice Johnson', 'alice@example.com', 'Project Inquiry', 'Hi John, I saw your portfolio and I''m interested in working with you on a new project. Could we schedule a call?', false),
('Bob Smith', 'bob@example.com', 'Freelance Opportunity', 'Hello, I have a freelance opportunity that might interest you. Please let me know your availability.', false),
('Carol Davis', 'carol@example.com', 'Collaboration', 'I''m a designer looking to collaborate with a developer. Your work looks amazing!', true)
ON CONFLICT DO NOTHING;

-- ==============================================
-- 10. VERIFICATION AND SUMMARY
-- ==============================================

-- Display completion message
SELECT '🎉 DATABASE SETUP COMPLETED SUCCESSFULLY! 🎉' as status;
SELECT 'All tables, policies, views, and sample data have been created.' as message;

-- Show data counts
SELECT '📊 DATA SUMMARY:' as info;

SELECT 'Profiles:' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Skills:' as table_name, COUNT(*) as count FROM skills
UNION ALL
SELECT 'Projects:' as table_name, COUNT(*) as count FROM projects
UNION ALL
SELECT 'Contacts:' as table_name, COUNT(*) as count FROM contacts
UNION ALL
SELECT 'Images:' as table_name, COUNT(*) as count FROM images;

-- Show table structure verification
SELECT '✅ TABLES CREATED:' as verification;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'skills', 'projects', 'contacts', 'images')
ORDER BY table_name;

-- Show policies verification
SELECT '🔒 POLICIES CREATED:' as verification;
SELECT schemaname, tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Show views verification
SELECT '👁️ VIEWS CREATED:' as verification;
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE 'public_%'
ORDER BY table_name;

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================
-- 
-- Your portfolio database is now ready to use!
-- 
-- Next steps:
-- 1. Update your Supabase environment variables in your app
-- 2. Test the connection from your React application
-- 3. Customize the sample data with your own information
-- 4. Deploy your application
-- 
-- For any issues, check the troubleshooting guide or contact support.
-- ==============================================