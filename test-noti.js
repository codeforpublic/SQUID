const apn = require('apn')

const options = {
  token: {
    key: '/Users/ranatchai/appstore/AuthKey_ZZ8KF6QUAJ.p8',
    keyId: 'ZZ8KF6QUAJ',
    teamId: 'QF457V8Y87',
  },
  production: false,
}

const apnProvider = new apn.Provider(options)

let deviceToken =
  '4983aa07fd358fcb1a29d9c777b82e8c514ffdc0a0628a255e1242fae6d1c904'

var note = new apn.Notification()

note.expiry = Math.floor(Date.now() / 1000) + 3600 // Expires 1 hour from now.
note.badge = 3
note.sound = 'ping.aiff'
note.alert = '\uD83D\uDCE7 \u2709 You have a new message'
note.payload = {
  title: 'here your questionaire',
  message: 'questionarie 1',
  data: {
    type: 'OPEN',
    url: 'https://google.com',
  },
}
note.topic = 'com.cleverse.thaialert'

apnProvider.send(note, deviceToken).then(result => {
  console.log('result', result, JSON.stringify(result))
  // see documentation for an explanation of result
})
