const axios = require('axios')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
require('dotenv').config()

let holderAddresses = []

function getAssets(token_ids) {
  const url = `https://api.opensea.io/api/v1/assets?order_direction=asc&offset=0&limit=50&asset_contract_address=${process.env.CONTRACT_ADDRESS}&token_ids=${getTokenIdsQuery(token_ids)}`
  const options = {
    headers: {
      'X-API-KEY': process.env.API_KEY
    }
  }

  return axios.get(url, options).then(response => response.data.assets)
}

function getTokenIdsQuery(token_ids) {
  return token_ids.join('&token_ids=')
}

function getTokenIds(offset) {
  return Array.from(Array(30)).map((_, i) => offset + i)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function finish() {
  const fileName = `holders-${process.env.CONTRACT_ADDRESS}.json`
  const filePath = path.join(__dirname, fileName)
  const data = JSON.stringify(_.countBy(holderAddresses))

  fs.writeFileSync(filePath, data)

  console.log('Finished!')
}

async function init() {
  let running = true
  let offset = 0

  console.log('Initializing...')

  while (running) {
    console.log(`Getting new assets from offset ${offset}...`)
    let token_ids = getTokenIds(offset)
    const assets = await getAssets(token_ids)

    if (assets.length) {
      holderAddresses.push(...assets.map(a => a.owner.address))
      offset += 30
      await sleep(1000)
    } else {
      finish()
      running = false
    }
  }
}

init()
