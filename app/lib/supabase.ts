import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type CoreOutput = {
  id: string;
  match: string;
  analysis: string;
  recommendation: string;
  confidence: string;
  created_at: string;
};

export type ResearchOutput = {
  id: string;
  title: string;
  notes: string;
  created_at: string;
};

export type CompetitorRecord = {
  id: string;
  name: string;
  type: string;
  strength: string;
  weakness: string;
  created_at: string;
};

export type PricingScenario = {
  id: string;
  name: string;
  assumptions: string;
  monthly_revenue: number;
  annual_revenue: number;
  created_at: string;
};
