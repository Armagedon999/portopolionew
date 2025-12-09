/*
  # Add Skill Categories Table
  
  This migration adds a skill_categories table to allow dynamic category management.
  Users can add custom categories when selecting "Other" in skills form.
*/

-- Create skill_categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon_name text, -- For icon mapping (e.g., 'Code', 'Server', etc.)
  color text DEFAULT '#3B82F6',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;

-- Policies for skill_categories
CREATE POLICY "Skill categories are viewable by everyone"
  ON skill_categories FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage skill categories"
  ON skill_categories FOR ALL
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO skill_categories (name, description, icon_name, color, sort_order) VALUES
('Frontend', 'Frontend development technologies', 'Code', '#3B82F6', 1),
('Backend', 'Backend development technologies', 'Server', '#10B981', 2),
('Database', 'Database technologies', 'Database', '#8B5CF6', 3),
('Cloud', 'Cloud platforms and services', 'Cloud', '#F59E0B', 4),
('DevOps', 'DevOps tools and practices', 'Tool', '#EF4444', 5),
('Mobile', 'Mobile development frameworks', 'Smartphone', '#EC4899', 6),
('Design', 'Design tools and software', 'Palette', '#6366F1', 7),
('Tools', 'Development tools and utilities', 'Tool', '#14B8A6', 8)
ON CONFLICT (name) DO NOTHING;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_skill_categories_name ON skill_categories(name);
CREATE INDEX IF NOT EXISTS idx_skill_categories_active ON skill_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_skill_categories_sort_order ON skill_categories(sort_order);

