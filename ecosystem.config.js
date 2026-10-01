module.exports = {
  apps: [{
    name: 'connect-api-akosmd',
    script: './server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    // args: 'one two',
    // instances: 'max',
    // autorestart: true,
    // watch: false,
    // max_memory_restart: '1G',
    // env: {
    //   NODE_ENV: 'dev'
    // },
    // env_production: {
    //   NODE_ENV: 'prod'
    // }
  }],

  // deploy: {
  //   production: {
  //     user: 'node',
  //     host: '20.219.253.206',
  //     ref: 'origin/master',
  //     repo: 'git@github.com:repo.git',
  //     path: '/var/www/connect-api-akosmd',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
