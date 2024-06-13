module.exports = {
  apps : [{
    name: 'Robo',
    script: 'main2.js 4',
    instances: 1,
    cron_restart: '0 3 * * *'
  }]
}