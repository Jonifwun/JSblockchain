const Blockchain = require('./blockchain')

const coin = new Blockchain()

// coin.createNewBlock(3245, '093849389349', '47897348729')

// coin.createNewTransaction(399, '343GFDSG2G2G2', 'GSG2525252T2')
// coin.createNewTransaction(320, '43489DFDFFFFS', 'WE3435353R35')

// coin.createNewBlock(2324, '239492984929', '30392049820')

// coin.createNewTransaction(32, '343GFDSG2G2G2', 'GSG2525252T2')
// coin.createNewTransaction(44, '43489DFDFFFFS', 'WE3435353R35')


// const previousBlockHash = coin.chain[0].hash
// const currentBlockData = coin.chain[1].transactions
// // console.log(currentBlockData) 

// console.log(coin.proofOfWork(previousBlockHash, currentBlockData))
// console.log(coin.hashBlock(previousBlockHash, currentBlockData, 4922))

console.log(coin)