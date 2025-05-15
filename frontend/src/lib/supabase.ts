import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nbuehlsqragmugbuuubn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idWVobHNxcmFnbXVnYnV1dWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNDMxNDIsImV4cCI6MjA2MjgxOTE0Mn0.tDDDpWlyX1mkq6uTyTxqcugHvdrpAIELzDINfHlbRV4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
