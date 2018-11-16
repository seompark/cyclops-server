module.exports = {
  apps: [
    {
      name: 'cyclops',
      script: 'index.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}