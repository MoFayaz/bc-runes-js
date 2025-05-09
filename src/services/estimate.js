const { get } = require('./http.js')
const { estimateURL } = require('../config.js')

async function estimate(blocks) {
  const estimatePerBlocksAmount = await get(estimateURL)

  // return Math.round(estimatePerBlocksAmount[blocks])
  return estimatePerBlocksAmount["fastestFee"]
}

module.exports = {
  estimate
}