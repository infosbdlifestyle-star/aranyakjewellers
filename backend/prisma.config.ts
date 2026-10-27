import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
});
