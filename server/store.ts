import dotenv from 'dotenv';
import { PersistentDatabase } from './db.ts';
import { PostgresDatabase } from './db-postgres.ts';
import { SqlServerDatabase } from './db-sqlserver.ts';

// Nạp biến môi trường ngay tại đây để biết chọn nhà cung cấp dữ liệu nào
// (server.ts cũng gọi dotenv.config(); gọi lại là vô hại, không ghi đè biến đã có).
dotenv.config();

export type AppDatabase = PersistentDatabase | SqlServerDatabase | PostgresDatabase;

const provider = (process.env.DB_PROVIDER || 'json').trim().toLowerCase();
const usePostgres = provider === 'postgres' || provider === 'postgresql' || provider === 'pg';
const useSqlServer = provider === 'sqlserver' || provider === 'mssql';

let instance: AppDatabase;
if (usePostgres) {
  instance = new PostgresDatabase();
  console.log('[Database] Nha cung cap du lieu: PostgreSQL');
} else if (useSqlServer) {
  instance = new SqlServerDatabase();
  console.log('[Database] Nhà cung cấp dữ liệu: SQL Server (SSMS)');
} else {
  instance = new PersistentDatabase();
  console.log('[Database] Nhà cung cấp dữ liệu: JSON file (data/database.json)');
}

export const db: AppDatabase = instance;

// Promise hoàn tất khi dữ liệu đã nạp xong (SQL Server cần thời gian kết nối + đọc bảng).
export const dbReady: Promise<void> =
  instance instanceof SqlServerDatabase || instance instanceof PostgresDatabase
    ? instance.ready
    : Promise.resolve();
