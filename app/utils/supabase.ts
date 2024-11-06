import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add a test function to verify connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')
      .limit(1);
    
    console.log('Supabase connection test:', { data, error });
    return { success: !error, error };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
};
