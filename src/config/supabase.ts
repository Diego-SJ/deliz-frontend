import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://onvvqhjemwngjsxvqxnk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udnZxaGplbXduZ2pzeHZxeG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4MDk0MjUsImV4cCI6MjAyOTM4NTQyNX0.32moi2gcZqRPK977GKPlzUjdYBor52eGlOifrVuGf5w',
);
