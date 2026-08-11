import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a numeric string')
    .transform(Number)
    .default("4000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  const formatted = parsed.error.format();
  console.error(JSON.stringify(formatted, null, 2));
  process.exit(1);
}

export const env = parsed.data;
