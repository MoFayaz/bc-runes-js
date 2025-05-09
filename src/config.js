const bitcoin = require('bitcoinjs-lib')
const { ECPairFactory } = require('ecpair')
const ecc = require('@bitcoinerlab/secp256k1')
const { tweakSigner } = require('./utils/tweakSigner.js')

const ECPair = ECPairFactory(ecc)
bitcoin.initEccLib(ecc)

const mempoolBaseURL = `https://mempool.space/testnet4/api`

const blockstreamBaseURL = 'https://blockstream.info/testnet/api'
const txURL = `${mempoolBaseURL}/tx`
const txInfoURL = (txHash) => `${txURL}/${txHash}`
const utxoURL = (address) => `${mempoolBaseURL}/address/${address}/utxo`
const runesBaseURL = 'https://open-api-testnet4.unisat.io/v1/indexer'
const runeByIdURL = (runeId) => `${runesBaseURL}/runes/${runeId}/info`
const runeByNameURL = (name) => `${runesBaseURL}/runes/info-list?rune=${name}&limit=500`
const runesByAddressURL = (address) => `${runesBaseURL}/address/${address}/runes/balance-list`
const runeUtxosForAddressURL = (address, runeId) => `${runesBaseURL}/address/${address}/runes/${runeId}/utxo`
const estimateURL = `${mempoolBaseURL}/v1/fees/recommended`
const getTipURL = `${mempoolBaseURL}/blocks/tip/height`
const testnetNetwork = bitcoin.networks.testnet

let _taprootAddress, _wif, _tweakedSigner, _feeEstimate, _feePerVByte

function setWif(wif) {
  _wif = wif
}

function setAddress(taprootAddress) {
  _taprootAddress = taprootAddress
}

function setFeeEstimate(feeEstimate) {
  _feeEstimate = feeEstimate
}

function setfeePerVByte(feePerVByte) {
  _feePerVByte = feePerVByte
}

function setSigner(wif) {
  const untweakedSigner = ECPair.fromWIF(wif, testnetNetwork)
  _tweakedSigner = untweakedSigner
}

function init({ taprootAddress, wif, feePerVByte, estimate }) {
  setWif(wif)
  setSigner(wif)
  setAddress(taprootAddress)
  
  if (feePerVByte) {
    setfeePerVByte(feePerVByte)
  } else if (estimate) {
    setFeeEstimate(estimate)
  } else {
    throw new Error('Either set a feePerVByte value or a fee estimate by blocks, for transactions')
  }
}

module.exports = {
  ECPair,
  init,
  bitcoin,
  setWif,
  setFeeEstimate,
  feeEstimate: () => _feeEstimate,
  feePerVByte: () => _feePerVByte,
  taprootInputSize: 70,
  taprootOutputSize: 50,
  wif: () => _wif,
  tweakedSigner: () => _tweakedSigner,
  taprootAddress: () => _taprootAddress,
  blockstreamBaseURL,
  txURL,
  txInfoURL,
  utxoURL,
  runeByNameURL,
  runeByIdURL,
  runesByAddressURL,
  runeUtxosForAddressURL,
  estimateURL,
  getTipURL,
  testnetNetwork
}
