// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pqfhuekhelmoguenlppo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZmh1ZWtoZWxtb2d1ZW5scHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MTY1NDksImV4cCI6MjA1ODk5MjU0OX0.t7FTZbxscJv9v-aPAJOwaOz6Q_oLTXMe6T8JZgePmdc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);