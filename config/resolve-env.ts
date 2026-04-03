import * as fs from 'fs';
import * as path from 'path';

/** Priorytet: zmienna srodowiskowa TEST_ENV, potem plik config/runtime.json, na koncu production. */
export type TargetEnv = 'local' | 'staging' | 'production';

const ALLOWED: readonly TargetEnv[] = ['local', 'staging', 'production'] as const;

const BASE_URLS: Record<TargetEnv, string> = {
  local: 'http://localhost:4000/fashionhub/',
  staging: 'https://staging-env/fashionhub/',
  production: 'https://pocketaces2.github.io/fashionhub/',
};

function assertAllowedEnv(value: string, source: string): TargetEnv {
  const normalized = value.trim().toLowerCase();
  if (!ALLOWED.includes(normalized as TargetEnv)) {
    throw new Error(
      `${source}: "${value}" is invalid. Use one of: ${ALLOWED.join(', ')}.`,
    );
  }
  return normalized as TargetEnv;
}

export function resolveTargetEnv(): TargetEnv {
  const fromCli = process.env.TEST_ENV;
  if (fromCli != null && fromCli !== '') {
    return assertAllowedEnv(fromCli, 'TEST_ENV (CLI)');
  }

  const runtimePath = path.join(__dirname, 'runtime.json');
  if (fs.existsSync(runtimePath)) {
    const raw = fs.readFileSync(runtimePath, 'utf-8');
    const parsed = JSON.parse(raw) as { env?: string };
    if (parsed.env != null && String(parsed.env).trim() !== '') {
      return assertAllowedEnv(String(parsed.env), 'config/runtime.json (env)');
    }
  }

  return 'production';
}

export function getBaseURL(): string {
  return BASE_URLS[resolveTargetEnv()];
}

export function getResolvedEnvSummary(): { env: TargetEnv; baseURL: string; source: string } {
  const fromCli = process.env.TEST_ENV;
  if (fromCli != null && fromCli !== '') {
    const env = assertAllowedEnv(fromCli, 'TEST_ENV');
    return { env, baseURL: BASE_URLS[env], source: 'TEST_ENV (CLI)' };
  }
  const runtimePath = path.join(__dirname, 'runtime.json');
  if (fs.existsSync(runtimePath)) {
    const raw = fs.readFileSync(runtimePath, 'utf-8');
    const parsed = JSON.parse(raw) as { env?: string };
    if (parsed.env != null && String(parsed.env).trim() !== '') {
      const env = assertAllowedEnv(String(parsed.env), 'runtime.json');
      return { env, baseURL: BASE_URLS[env], source: 'config/runtime.json' };
    }
  }
  return { env: 'production', baseURL: BASE_URLS.production, source: 'default production' };
}
