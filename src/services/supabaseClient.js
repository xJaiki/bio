import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://omatzkwrnoptaykyolls.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYXR6a3dybm9wdGF5a3lvbGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDMyOTUsImV4cCI6MjA1NzAxOTI5NX0.DaUGb6AnouUoyXXDk6XAo9VtLsCkFwDOxdUHibcCwzU';

export const supabase = createClient(supabaseUrl, supabaseKey);
