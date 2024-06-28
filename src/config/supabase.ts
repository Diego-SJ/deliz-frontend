import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://owxoqhqriahxxfnhyhgj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93eG9xaHFyaWFoeHhmbmh5aGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk1NDY4NzgsImV4cCI6MjAzNTEyMjg3OH0.FOFVc0gw8F1uH7V_WpJelESUYOXDc6z7BcHY3nYQ2r0',
);
