import { z } from 'zod';

export const FindingSchema = z.object({
  area: z.string(),
  observation: z.string(),
  severity: z.enum(['info', 'monitor', 'repair', 'urgent']),
  recommendation: z.string(),
  confidence: z.enum(['low', 'medium', 'high']),
  needs_closer_look: z.boolean(),
});

export type Finding = z.infer<typeof FindingSchema>;
