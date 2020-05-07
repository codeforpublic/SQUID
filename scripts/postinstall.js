const fs = require('fs')

const acExists = fs.existsSync(
  __dirname + '/../ios/ThaiAlert/AppCenter-Config.plist',
)
if (!acExists) {
  fs.copyFileSync(
    __dirname + '/../ios/ThaiAlert/AppCenter-Config.plist.example',
    __dirname + '/../ios/ThaiAlert/AppCenter-Config.plist',
  )
}

const envExists = fs.existsSync(__dirname + '/../.env')
if (!envExists) {
  fs.copyFileSync(__dirname + '/../.env.dev', __dirname + '/../.env')
}
