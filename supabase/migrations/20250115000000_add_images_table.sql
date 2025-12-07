/*
  # Add Images Management Table

  This migration adds a new `images` table to support CRUD operations
  for images used in Hero and About sections, and other parts of the portfolio.
*/

-- Images table for managing portfolio imagessx 
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

-- Enable Row Level Security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policies for images
CREATE POLICY "Images are viewable by everyone"
  ON images FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage images"
  ON images FOR ALL
  TO authenticated
  USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_images_section ON images(section);
CREATE INDEX IF NOT EXISTS idx_images_active ON images(is_active);
CREATE INDEX IF NOT EXISTS idx_images_sort_order ON images(sort_order);

-- Insert sample images data
INSERT INTO images (name, description, url, alt_text, section, sort_order) VALUES
('Hero Profile Image', 'Main profile image for hero section', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Professional headshot', 'hero', 1),
('About Section Image', 'Main image for about section', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=face', 'About me image', 'about', 1),
('Portfolio Background', 'Background image for portfolio section', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 'Portfolio background', 'portfolio', 1)
ON CONFLICT DO NOTHING;

-- Update profiles table to reference images
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hero_image_id uuid REFERENCES images(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS about_image_id uuid REFERENCES images(id);

-- Update existing profile to use the new image system
UPDATE profiles 
SET 
  hero_image_id = (SELECT id FROM images WHERE section = 'hero' LIMIT 1),
  about_image_id = (SELECT id FROM images WHERE section = 'about' LIMIT 1)
WHERE hero_image_id IS NULL OR about_image_id IS NULL;