import database from 'infra/database.js';

async function status(req, res) {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await database.query("SHOW server_version;");
  const databaseMaxConnections = await database.query("SHOW max_connections;");
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  console.log(databaseOpenedConnections.rows)
  res.status(200).json({
    update_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: parseInt(databaseMaxConnections.rows[0].max_connections),
        opened_connections: databaseOpenedConnections.rows[0].count,
      },
    },
  });
}

export default status;