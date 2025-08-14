"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test-pg.ts
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    connectionString: 'postgresql://neondb_owner:npg_jtF7PXbKQAz0@ep-proud-base-a1kgqq0z-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});
exports.default = pool;
