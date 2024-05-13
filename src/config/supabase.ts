import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://maavzvodgeradikmoehp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hYXZ6dm9kZ2VyYWRpa21vZWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU0MjU4NDQsImV4cCI6MjAwMTAwMTg0NH0.kEZqTHJjo_ayqbEhaXd6Gs8GaSwzbTb0t_s0EqxFim0',
);
