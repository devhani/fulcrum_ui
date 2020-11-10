type networks = 'mainnet' | 'ropsten' | 'rinkeby' | 'kovan'

function getNetworkIdByString(networkName: networks | undefined): 1 | 3 | 4 | 42 | 0 {
  switch (networkName) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'kovan':
      return 42
    default:
      return 0
  }
}

export default {
  getNetworkIdByString
}
