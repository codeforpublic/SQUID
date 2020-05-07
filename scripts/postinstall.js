const fs = require('fs')

if (!fs.existsSync(__dirname + '/../ios/ThaiAlert/AppCenter-Config.plist')) {
  fs.copyFileSync(
    __dirname + '/../ios/ThaiAlert/AppCenter-Config.plist.example',
    __dirname + '/../ios/ThaiAlert/AppCenter-Config.plist',
  )
}

if (!fs.existsSync(__dirname + '/../ios/sentry.properties')) {
  fs.copyFileSync(
    __dirname + '/../ios/sentry.properties.example',
    __dirname + '/../ios/sentry.properties',
  )
}

if (!fs.existsSync(__dirname + '/../.env')) {
  fs.copyFileSync(__dirname + '/../.env.dev', __dirname + '/../.env')
}
