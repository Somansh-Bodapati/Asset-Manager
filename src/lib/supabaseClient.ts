import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrhjjkqhikepqkvwsgmd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyaGpqa3FoaWtlcHFrdndzZ21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3ODA5ODksImV4cCI6MjA1NDM1Njk4OX0.etj3SyiqPLVFmIHL8lHMCRs0ktWueFHXmXVTYotdFhM';

export const supabase = createClient(supabaseUrl, supabaseKey);