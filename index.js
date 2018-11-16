require('dotenv').config()

const got = require('got')
const Hapi = require('hapi')

const server = Hapi.server({
  port: process.env.PORT
})

server.route({
  method: 'POST',
  path: '/',
  options: {
    payload: {
      output: 'stream',
      allow: 'multipart/form-data',
      maxBytes: 10485760
    }
  },
  async handler (request, h) {
    try {
      const data = request.payload
      const file = Object.values(data)[0]

      const query = {
        'visualFeatures': 'Tags',
        'detail': '',
        'language': 'en'
      }

      const cognitives = await got.post(process.env.VISION_HOST, {
        query,
        body: file,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': process.env.VISION_KEY
        }
      })

      const text = JSON.parse(cognitives.body).tags.slice(0, 4).map(v => v.name).join(', ')

      const result = (await got(process.env.TRANSLATE_HOST, {
        method: 'POST',
        body: {
          'source': 'en',
          'target': 'ko',
          'text': text
        },
        form: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Naver-Client-Id': process.env.TRANSLATE_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.TRANSLATE_CLIENT_SECRET
        },
        json: true
      })).body.message.result.translatedText

      console.log(result)
      return h.response(result).type('text/plain')
    } catch (err) {
      console.log(err)
    }
  }
})

const init = async () => {
  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
