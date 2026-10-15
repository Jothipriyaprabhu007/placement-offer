import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

// Read from env or local configuration
function getStoredSupabaseConfig() {
  try {
    const customUrl = localStorage.getItem('hireready_supabase_url');
    const customKey = localStorage.getItem('hireready_supabase_anon_key');
    if (customUrl && customKey && customUrl.startsWith('https://')) {
      return { url: customUrl, key: customKey };
    }
  } catch {}
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
}

const config = getStoredSupabaseConfig();
let activeSupabaseUrl = config.url;
let activeSupabaseAnonKey = config.key;

export const isSupabaseConfigured = (): boolean => {
  const current = getStoredSupabaseConfig();
  return Boolean(
    current.url && 
    current.key && 
    !current.url.includes('your-project') &&
    !current.key.includes('your-anon-public-key') &&
    current.url.startsWith('https://')
  );
};

export function getSupabaseCredentials() {
  return getStoredSupabaseConfig();
}

export function saveSupabaseCredentials(url: string, key: string) {
  try {
    localStorage.setItem('hireready_supabase_url', url.trim());
    localStorage.setItem('hireready_supabase_anon_key', key.trim());
    window.location.reload();
  } catch (e) {
    console.error('Failed to save Supabase credentials:', e);
  }
}

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(getStoredSupabaseConfig().url, getStoredSupabaseConfig().key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Auth helper signatures
export async function authenticateWithSupabase(email: string, password: string) {
  if (!supabase) {
    return { data: { user: null, session: null }, error: new Error('Supabase credentials not configured in environment.') };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function registerWithSupabase(email: string, password: string, metadata: Record<string, any>) {
  if (!supabase) {
    return { data: { user: null, session: null }, error: new Error('Supabase credentials not configured in environment.') };
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });
}

export async function signOutFromSupabase() {
  if (!supabase) return { error: null };
  return await supabase.auth.signOut();
}

// Upload resume to Supabase Storage Bucket ('resumes')
export async function uploadResumeToSupabase(userId: string, file: File): Promise<{ url: string | null; error: any }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase Storage is not configured.') };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}_resume.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Storage bucket upload error:', error.message);
      return { url: null, error };
    }

    const { data: publicUrlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);

    return { url: publicUrlData.publicUrl || null, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}

// Save or Update student profile in Supabase
export async function saveStudentProfileSupabase(
  profile: UserProfile, 
  resumeFile?: File
): Promise<{ profile: UserProfile | null; error: any }> {
  if (!supabase) {
    return { 
      profile: null, 
      error: new Error('Supabase is not configured. Please configure your Supabase URL and Anon Key.') 
    };
  }

  try {
    let resumeUrl = profile.resume_url;

    // Upload resume file if provided
    if (resumeFile) {
      const uploadRes = await uploadResumeToSupabase(profile.id, resumeFile);
      if (uploadRes.url) {
        resumeUrl = uploadRes.url;
      }
    }

    const payload = {
      id: profile.id,
      auth_user_id: profile.auth_user_id || profile.id,
      role: 'student',
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone || '',
      college_id: profile.student_id || profile.college_id || '',
      college_name: profile.college_name || '',
      branch: profile.department || profile.branch || '',
      batch_year: profile.graduation_year || profile.batch_year || 2026,
      cgpa: profile.cgpa,
      skills: profile.technical_skills || profile.skills || [],
      resume_url: resumeUrl,
      resume_filename: profile.resume_filename || resumeFile?.name || '',
      resume_text: profile.resume_text || '',
      status: 'active',
      is_placed: false,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase profile save error:', error);
      return { profile: null, error };
    }

    return { 
      profile: {
        ...profile,
        ...data,
        is_profile_completed: true,
        resume_url: resumeUrl
      }, 
      error: null 
    };
  } catch (err: any) {
    return { profile: null, error: err };
  }
}

// Fetch student profile from Supabase
export async function fetchStudentProfileSupabase(
  userId: string, 
  email?: string
): Promise<{ profile: UserProfile | null; error: any }> {
  if (!supabase) {
    return { profile: null, error: new Error('Supabase is not configured.') };
  }

  try {
    let query = supabase.from('profiles').select('*');
    if (userId) {
      query = query.or(`id.eq.${userId},auth_user_id.eq.${userId}`);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      return { profile: null, error };
    }

    if (!data) {
      return { profile: null, error: null };
    }

    const profile: UserProfile = {
      id: data.id,
      auth_user_id: data.auth_user_id,
      role: data.role || 'student',
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      student_id: data.college_id,
      college_name: data.college_name,
      department: data.branch,
      degree_and_year: data.degree_and_year || 'B.Tech',
      graduation_year: data.batch_year,
      cgpa: data.cgpa,
      technical_skills: data.skills || [],
      programming_languages: data.programming_languages || [],
      projects: data.projects || [],
      certifications: data.certifications || [],
      resume_url: data.resume_url,
      resume_filename: data.resume_filename,
      resume_text: data.resume_text,
      is_profile_completed: Boolean(data.full_name && data.college_name && data.cgpa),
      status: data.status || 'active',
      is_placed: data.is_placed || false,
      current_placement: data.current_placement,
      created_at: data.created_at || new Date().toISOString()
    };

    return { profile, error: null };
  } catch (err: any) {
    return { profile: null, error: err };
  }
}
