module.exports = {
  apps : [{
    name: 'Robo BTC',
    script: 'index.js',
    instances: 1,
    cron_restart: '0 3 * * *'
  }]
}