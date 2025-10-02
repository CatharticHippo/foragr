import { DrizzleDatabase as DrizzleDB } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export type DrizzleDatabase = DrizzleDB<typeof schema>;
