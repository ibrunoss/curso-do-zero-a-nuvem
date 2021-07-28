interface ServerEnvironment {
  port: string | number;
}

interface DataBaseEnvironment {
  url: string;
}

interface Environment {
  server: ServerEnvironment;
  db: DataBaseEnvironment;
}

const environment: Environment = {
  server: { port: process.env.SERVER_PORT || 3000 },
  db: { url: process.env.DB_URL || "mongodb://localhost:27017/meat-api" },
};

export default environment;
