import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bpbtgkunrdzcoyfdhskh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Edge function URLs
export const EDGE_FUNCTIONS = {
  whaleTransactions: `${supabaseUrl}/functions/v1/fetch-whale-transactions`,
  marketFlow: `${supabaseUrl}/functions/v1/fetch-market-flow`,
  stakingData: `${supabaseUrl}/functions/v1/fetch-staking-data`,
  realTimeFeed: `${supabaseUrl}/functions/v1/aggregate-real-time-feed`,
};
