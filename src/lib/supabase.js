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
      // Try with foreign key relationship first
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          hero_image:images!hero_image_id(*),
          about_image:images!about_image_id(*)
        `)
        .single();
      
      if (error) {
        console.log('Foreign key query failed, trying alternative approach:', error.message);
        
        // Fallback: Get profile and images separately
        const [profileRes, heroImageRes, aboutImageRes] = await Promise.all([
          supabase.from('profiles').select('*').single(),
          supabase.from('images').select('*').eq('section', 'hero').single(),
          supabase.from('images').select('*').eq('section', 'about').single()
        ]);
        
        if (profileRes.error) {
          return { data: null, error: profileRes.error };
        }
        
        const profileData = profileRes.data;
        profileData.hero_image = heroImageRes.data;
        profileData.about_image = aboutImageRes.data;
        
        return { data: profileData, error: null };
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error in getProfile:', error);
      return { data: null, error };
    }
  },

  async updateProfile(profileData) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([profileData])
      .select()
      .single();
    return { data, error };
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
    const { data, error } = await supabase
      .from('profiles')
      .update({
        hero_image_id: heroImageId,
        about_image_id: aboutImageId
      })
      .select()
      .single();
    return { data, error };
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