import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
});

// Database helper functions
export const db = {
  // Profiles
  async getProfile() {
    try {
      // Get the profile data - handle multiple rows by taking the most recent one
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (profileError) {
        console.error('Error loading profile:', profileError);
        return { data: null, error: profileError };
      }
      
      // If no profiles or empty array, return null
      if (!profiles || profiles.length === 0) {
        return { data: null, error: null };
      }
      
      // Get the first (most recent) profile
      const profileData = profiles[0];
      
      // Get images separately using the IDs from profile
      const imagePromises = [];
      
      if (profileData.hero_image_id) {
        imagePromises.push(
          supabase
            .from('images')
            .select('*')
            .eq('id', profileData.hero_image_id)
            .single()
            .then(({ data, error }) => ({ type: 'hero', data, error }))
        );
      } else {
        imagePromises.push(Promise.resolve({ type: 'hero', data: null, error: null }));
      }
      
      if (profileData.about_image_id) {
        imagePromises.push(
          supabase
            .from('images')
            .select('*')
            .eq('id', profileData.about_image_id)
            .single()
            .then(({ data, error }) => ({ type: 'about', data, error }))
        );
      } else {
        imagePromises.push(Promise.resolve({ type: 'about', data: null, error: null }));
      }
      
      const imageResults = await Promise.all(imagePromises);
      
      // Attach images to profile data
      const heroImageResult = imageResults.find(r => r.type === 'hero');
      const aboutImageResult = imageResults.find(r => r.type === 'about');
      
      profileData.hero_image = heroImageResult?.data || null;
      profileData.about_image = aboutImageResult?.data || null;
      
      return { data: profileData, error: null };
    } catch (error) {
      console.error('Error in getProfile:', error);
      return { data: null, error };
    }
  },

  async updateProfile(profileData) {
    try {
      // First, get the existing profile
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      // If profile exists, update it; otherwise create new one
      if (existingProfiles && existingProfiles.length > 0) {
        const profileId = existingProfiles[0].id;
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('id', profileId)
          .select()
          .single();
        return { data, error };
      } else {
        // Create new profile if none exists
        const { data, error } = await supabase
          .from('profiles')
          .insert([{
            ...profileData,
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
        return { data, error };
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { data: null, error };
    }
  },

  // Skills
  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  async createSkill(skillData) {
    const { data, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select()
      .single();
    return { data, error };
  },

  async updateSkill(id, skillData) {
    const { data, error } = await supabase
      .from('skills')
      .update(skillData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteSkill(id) {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Skill Categories
  async getSkillCategories() {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  async createSkillCategory(categoryData) {
    const { data, error } = await supabase
      .from('skill_categories')
      .insert([categoryData])
      .select()
      .single();
    return { data, error };
  },

  async updateSkillCategory(id, categoryData) {
    const { data, error } = await supabase
      .from('skill_categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteSkillCategory(id) {
    const { error } = await supabase
      .from('skill_categories')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Projects
  async getProjects(includeUnpublished = false) {
    let query = supabase.from('projects').select('*');
    
    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }
    
    const { data, error } = await query.order('sort_order', { ascending: true });
    return { data, error };
  },

  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    return { data, error };
  },

  async updateProject(id, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteProject(id) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Contacts
  async getContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createContact(contactData) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();
    return { data, error };
  },

  async updateContact(id, contactData) {
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteContact(id) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Images
  async getImages(section = null) {
    let query = supabase
      .from('images')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (section) {
      query = query.eq('section', section);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  async getAllImages() {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('section', { ascending: true })
      .order('sort_order', { ascending: true });
    return { data, error };
  },

  async createImage(imageData) {
    const { data, error } = await supabase
      .from('images')
      .insert([imageData])
      .select()
      .single();
    return { data, error };
  },

  async updateImage(id, imageData) {
    const { data, error } = await supabase
      .from('images')
      .update(imageData)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteImage(id) {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);
    return { error };
  },

  async updateProfileImages(heroImageId, aboutImageId) {
    try {
      // Get the existing profile (most recent one)
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (!existingProfiles || existingProfiles.length === 0) {
        return { data: null, error: { message: 'No profile found to update' } };
      }
      
      const profileId = existingProfiles[0].id;
      const { data, error } = await supabase
        .from('profiles')
        .update({
          hero_image_id: heroImageId,
          about_image_id: aboutImageId,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error in updateProfileImages:', error);
      return { data: null, error };
    }
  },
};

// Storage helper functions
export const storage = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
    return { data, error };
  },

  async deleteFile(bucket, path) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { data, error };
  },

  getPublicUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data?.publicUrl;
  },
};