const axios = require('axios')
const { Parser } = require('json2csv')
const fs = require('fs')

const fields = [
  '_created',
  '_updated',
  'short_handle',
  'uuid',
  'landing_page.title',
  'full_url',
  'ios.url',
  'ios.package_id',
  'android.url',
  'android.package_id'
]
const parser = new Parser({ fields, excelStrings: true })

if (typeof process.env.API_KEY_1LINK !== 'string') {
  throw new Error(
    '`API_KEY_1LINK` must be set with\nAPI_KEY_1LINK="your api key" node to-csv.js'
  )
  process.exit(1)
}

// get it from the dashboard
const API_KEY = process.env.API_KEY_1LINK

async function main () {
  try {
    const res = await axios.get(
      'https://api.1link.io/v1/link?limit=1000000&page=1&extended=1',
      {
        headers: { 'X-Api-key': API_KEY }
      }
    )
    const data = res.data
    const csv = parser.parse(data)
    const fileName = 'LINKS.csv'
    fs.writeFileSync(fileName, csv)
    console.log('Links exported to:', fileName)
    process.exit(0)
  } catch (err) {
    console.log('\nAn error occured:')
    console.error(err.message)
    console.error(err.response.data)
    process.exit(1)
  }
}

main()
