const Blockchain = require('./blockchain')

const coin = new Blockchain()

coin.createNewBlock(3245, '093849389349', '47897348729')
coin.createNewBlock(2324, '239492984929', '30392049820')
coin.createNewBlock(6665, '0938E3899999', '234909F4949')

console.log(coin.getLastBlock())