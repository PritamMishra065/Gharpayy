import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const uri = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/gharpayy';
const isCloud = uri.includes('aws.tidbcloud.com') || uri.includes('ssl=');

let sslConfig = undefined;
if (isCloud) {
  try {
    const certPath = path.resolve(process.cwd(), 'server/isrgrootx1.pem');
    const caCert = fs.readFileSync(certPath);
    sslConfig = {
      ca: caCert,
      rejectUnauthorized: true
    };
  } catch (err) {
    console.error('⚠️ Could not load CA certificate. Falling back to default SSL config.', err);
    sslConfig = { rejectUnauthorized: true };
  }
}

const pool = mysql.createPool({
  uri,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const initDB = async () => {
  try {
    const connection = await pool.getConnection();

    // Create Leads Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        stage VARCHAR(50) DEFAULT 'New Lead',
        source VARCHAR(50),
        budget VARCHAR(100),
        location VARCHAR(255),
        assignedTo VARCHAR(100),
        score INT DEFAULT 0,
        isNew BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastActivity DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Visits Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id VARCHAR(36) PRIMARY KEY,
        leadId VARCHAR(36) NOT NULL,
        property VARCHAR(255) NOT NULL,
        date DATETIME NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        INDEX idx_leadId (leadId)
      )
    `);

    // Create Activities Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(36) PRIMARY KEY,
        leadId VARCHAR(36) NOT NULL,
        type VARCHAR(50) NOT NULL,
        content TEXT,
        actor VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_leadId (leadId)
      )
    `);

    connection.release();
    console.log('✅ TiDB MySQL initialized successfully, tables verified.');
  } catch (error) {
    console.error('❌ Database Initialization failed:', error);
  }
};

export { pool, initDB };
