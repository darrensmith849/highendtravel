export type AppEnv = 'local' | 'staging' | 'demo';
export type IntegrationMode = 'mock' | 'live';

export const APP_ENV: AppEnv =
  (process.env.NEXT_PUBLIC_APP_ENV as AppEnv) || 'local';

export const INTEGRATION_MODE: IntegrationMode =
  (process.env.NEXT_PUBLIC_INTEGRATION_MODE as IntegrationMode) || 'mock';

export const IS_DEMO = APP_ENV === 'demo';
export const IS_MOCK = INTEGRATION_MODE === 'mock';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
