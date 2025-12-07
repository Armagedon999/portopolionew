/*
  # Portfolio Website Database Schema

  1. New Tables
    - `profiles` - Developer profile information
    - `skills` - Technical skills and competencies
    - `projects` - Portfolio projects
    - `contacts` - Contact form messages

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and admin write access
*/

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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update their own profile"
  ON profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for skills
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage skills"
  ON skills FOR ALL
  TO authenticated
  USING (true);

-- Policies for projects
CREATE POLICY "Published projects are viewable by everyone"
  ON projects FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (true);

-- Policies for contacts
CREATE POLICY "Anyone can insert contacts"
  ON contacts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contacts"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contacts"
  ON contacts FOR UPDATE
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO profiles (full_name, title, bio, hero_title, hero_subtitle, hero_description, email, phone, linkedin_url, github_url) VALUES
('John Developer', 'Full Stack Web Developer', 'Passionate web developer with 5+ years of experience creating amazing digital experiences.', 'Hi, I''m John', 'Full Stack Web Developer', 'I create modern, responsive web applications that deliver exceptional user experiences and robust functionality.', 'john@example.com', '+1 (555) 123-4567', 'https://linkedin.com/in/johndeveloper', 'https://github.com/johndeveloper')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name, category, level, color) VALUES
('JavaScript', 'Frontend', 90, '#F7DF1E'),
('React.js', 'Frontend', 85, '#61DAFB'),
('TypeScript', 'Frontend', 80, '#3178C6'),
('Tailwind CSS', 'Frontend', 85, '#06B6D4'),
('Node.js', 'Backend', 80, '#339933'),
('Python', 'Backend', 75, '#3776AB'),
('PostgreSQL', 'Database', 70, '#336791'),
('MongoDB', 'Database', 70, '#47A248'),
('AWS', 'Cloud', 65, '#FF9900'),
('Docker', 'DevOps', 70, '#2496ED')
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, short_description, tech_stack, demo_url, repo_url, is_featured) VALUES
('E-commerce Platform', 'A full-featured e-commerce platform with user authentication, shopping cart, payment integration, and admin dashboard.', 'Modern e-commerce solution built with React and Node.js', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'https://demo.example.com', 'https://github.com/johndeveloper/ecommerce', true),
('Task Management App', 'A collaborative task management application with real-time updates, team collaboration, and project tracking.', 'Team collaboration tool with real-time updates', ARRAY['React', 'Socket.io', 'Express', 'MongoDB'], 'https://tasks.example.com', 'https://github.com/johndeveloper/tasks', true),
('Weather Dashboard', 'A beautiful weather dashboard showing current conditions, forecasts, and interactive maps.', 'Weather app with beautiful UI and detailed forecasts', ARRAY['JavaScript', 'Chart.js', 'Weather API'], 'https://weather.example.com', 'https://github.com/johndeveloper/weather', false)
ON CONFLICT DO NOTHING;