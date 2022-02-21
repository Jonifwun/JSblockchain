const sha256 = require('sha256')
const port = process.argv[2]
const currentNodeURL = `http://localhost:${port}`
const uuid = require ('uuid').v1

function Blockchain (){
    this.chain = []
    this.pendingTransactions = []
    this.createNewBlock(777, '0', '0')
    this.currentNodeURL = currentNodeURL
    this.networkNodes = []
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash){
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce,
        hash,
        previousBlockHash
    }

    this.pendingTransactions = []
    this.chain.push(newBlock)

    return newBlock
}

Blockchain.prototype.getLastBlock = function (){
    return this.chain[this.chain.length-1]
}

Blockchain.prototype.createNewTransaction = function (amount, sender, recipient){
    const transactionID = uuid().split('-').join('')
    const newTransaction = {
        amount,
        sender,
        recipient,
        transactionID
    }

    return newTransaction  
}

Blockchain.prototype.addToPendingTransactions = function (transactionObj){

    this.pendingTransactions.push(transactionObj)

    return this.getLastBlock()['index'] + 1
    
}

Blockchain.prototype.hashBlock = (previousBlockHash, currentBlockData, nonce) => {
    const dataString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData) 
    const hash = sha256(dataString)
    return hash
}

Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData){
    let nonce = 0
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    while (hash.substring(0,4) !== '0000'){
        nonce++
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    } 
    return nonce
}

Blockchain.prototype.chainIsValid = function (blockchain){
    let validChain = true
    for (let i = 1; i < blockchain.length; i++){
        const currentBlock = blockchain[i]
        const prevBlock = blockchain[i - 1]
        const currentBlockData = {
            transactions: currentBlock['transactions'],
            index: currentBlock['index']
        }

        const blockHash = this.hashBlock(currentBlock['previousBlockHash'], currentBlockData, currentBlock['nonce'])
        if (blockHash.substring(0,4) !== '0000'){
            validChain = false
        }
        if (currentBlock.previousBlockHash !== prevBlock.hash){
            validChain = false
        }
    }

    const genesisBlock = blockchain[0]
    const correctNonce = genesisBlock['nonce'] === 777
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0'
    const correctHash = genesisBlock['hash'] === '0'
    const correctTransactions = genesisBlock['transactions'].length === 0

    if( !correctNonce || !correctHash || !correctTransactions || !correctPreviousBlockHash){
        validChain = false 
    }
    
    return validChain

}

module.exports = Blockchain
