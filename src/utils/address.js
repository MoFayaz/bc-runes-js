const bitcoin = require('bitcoinjs-lib')
const { toXOnly, tweakSigner } = require('./tweakSigner.js')
const { getRandomWif } = require('./getRandomWIF.js')
const { wif, testnetNetwork: network, ECPair } = require('../config.js')

function getP2tr({
  internalPubkey,
  scriptTree,
  redeem
}) {
    if (redeem) {
      return bitcoin.payments.p2tr({
        internalPubkey,
        scriptTree,
        redeem,
        network
      })
    } else {
      return bitcoin.payments.p2tr({
        internalPubkey,
        scriptTree,
        network
      })
    }
}

function generateAddress(_wif) {

  if (!_wif) {
    _wif = wif() || process.argv[3]

    if (!_wif) {
      console.log('No WIF set, generating new random address')
      _wif = getRandomWif()
    }
  }

  const untweakedSigner = ECPair.fromWIF(_wif, network)
  // const tweakedSigner = tweakSigner(untweakedSigner)
  
  const p2tr = bitcoin.payments.p2tr({
    pubkey: toXOnly(untweakedSigner.publicKey),
    network
  })

  return {
    taprootAddress: p2tr.address,
    WIF: _wif
  }
}

if (process.argv[2] === '--log=address') {
  console.log({ ...generateAddress() })
}

module.exports = {
  getP2tr,
  generateAddress
}