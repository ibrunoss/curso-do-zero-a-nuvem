module.exports = {
  apps: [
    {
      name: "meat-api",
      script: "./dist/main.js",
      instances: 0,
      exec_mode: "cluster",
      env: {
        SERVER_PORT: 5000,
        NODE_ENV: "development",
      },
      env_production: {
        SERVER_PORT: 5001,
        NODE_ENV: "production",
      },
    },
  ],
};
