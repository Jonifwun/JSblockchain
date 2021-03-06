const express = require('express')
const bodyParser = require ('body-parser')
const Blockchain = require ('./blockchain')
const axios = require('axios')
const uuid = require ('uuid').v1
const nodeAddress = uuid().replace(/-/g, '')
const port = process.argv[2]
const coin = new Blockchain()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': true}))

app.get('/blockchain', (req, res) => {
    res.send(coin)
})

app.get('/block/:blockhash', (req, res) => {
    const hash = req.params.blockhash
    const block = coin.getBlock(hash)
    if (block) { 
        return res.json({
            note: 'Block found',
            block
        })
    } else {
        return res.json({
            note: 'Block not found'
        })
    }
})

app.get('/transaction/:transactionID', (req, res) => {
    const transactionID = req.params.transactionID
    const { correctTransaction, correctBlock } = coin.getTransaction(transactionID)
    if(correctTransaction && correctBlock){
        return res.json({
            note: 'Transaction found',
            transaction: correctTransaction,
            block: correctBlock
         })
    } else {
        return res.json({
            note: 'No transaction with this ID has been found'
    })
    }
})

app.get('/address/:address', (req, res) => {
    const address = req.params.address
    const { addressTransactions, addressBalance } = coin.getAddressData(address)
    console.log (addressTransactions, addressBalance)
    
    addressTransactions.length && addressBalance ? res.json({ addressTransactions, addressBalance }) : res.json({ note: 'No transactions for this address found'})

})

app.post('/transaction', (req, res) => {
    const newTransaction = req.body
    const blockIndex = coin.addToPendingTransactions(newTransaction)
    res.json({
        note: `Transaction will be added to block ${blockIndex}`
    })
})

app.post('/transaction/broadcast', (req, res) => {
    const {amount, sender, recipient} = req.body
    const transaction = coin.createNewTransaction(amount, sender, recipient)
    coin.addToPendingTransactions(transaction)
    const requestPromises = []
    coin.networkNodes.forEach(nodeAddress => {
        const requestOptions = {
            url: nodeAddress + '/transaction',
            method: 'POST',
            data: transaction,
            json: true
        }
        requestPromises.push(axios(requestOptions))
    })

    Promise.all(requestPromises)
    .then(data =>{
        res.json({
            note: 'Transaction successfully broadcast'
        })
    })
})

app.get('/mine', (req, res) => {
    const lastBlock = coin.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transactions: coin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = coin.proofOfWork(previousBlockHash, currentBlockData)
    const hash = coin.hashBlock(previousBlockHash, currentBlockData, nonce)
    coin.createNewTransaction(6.25, 'XX00XX', nodeAddress)
    
    const newBlock = coin.createNewBlock(nonce, previousBlockHash, hash)

    const newBlockRequests = []

    coin.networkNodes.forEach(networkNodeURL => {
        const requestOptions = {
            url: networkNodeURL + '/receive-new-block',
            method: 'POST',
            data: {newBlock},
            json: true
        }
        newBlockRequests.push(axios(requestOptions))
    })

    Promise.all(newBlockRequests)
    .then(data => {
        const requestOptions = {
            url: coin.currentNodeURL + '/transaction/broadcast',
            method: 'POST',
            data: {
                amount: 6.25,
                sender: 'XX00XX',
                recipient: nodeAddress
            },
            json: true
        }

        return axios(requestOptions)

    })
    .catch(err => console.log(err))
    .then(data => {
        res.json({
            note: 'New block mined and broadcast successfully',
            block: newBlock
        })
    })
})

app.post('/receive-new-block', (req, res) => {
    const { newBlock } = req.body
    const lastBlock = coin.getLastBlock()
    const correctHash = lastBlock.hash === newBlock.previousBlockHash
    const correctIndex = lastBlock['index'] + 1 === newBlock['index']
    if (correctHash && correctIndex){
        coin.chain.push(newBlock)
        coin.pendingTransactions = []
        res.json({
            note: 'New block received and accepted',
            newBlock
        })
    } else {
        res.json({
            note: `Block was rejected because ${!correctHash || !correctIndex ? 'previous block hash or index was incorrect' : ''}`,
            newBlock
        })
    }

    coin.pendingTransactions = []

})

//Register node with the network and broadcast to other nodes
app.post('/register-broadcast-node', (req, res) => {
    //Grab the new node URL
    var newNodeURL = req.body.newNodeURL
    //Check that the node doesn't already exist in list of network nodes
    if (coin.networkNodes.indexOf(newNodeURL) == -1){
        //Add node by pushing into networkNodes array
        coin.networkNodes.push(newNodeURL)
        //Initialize an empty array for to add a promise for each individual node
        const registerNodesPromises = []
        //Loop through current existing nodes
        coin.networkNodes.forEach(networkNode => {
            const url = networkNode + '/register-node'
            const requestOptions = {
                method: 'POST',
                data: { newNodeURL },
                json: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }       
        //Push promise into register nodes array
        registerNodesPromises.push(axios(url, requestOptions))
    })

    Promise.all(registerNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            url: newNodeURL + '/register-nodes-all',
            method: 'POST',
            data: {allNodes: [...coin.networkNodes, coin.currentNodeURL]},
            json: true
        }
        return axios(bulkRegisterOptions)
    })
    .catch(err => console.log(err))
    .then(data => {
        res.json({
            note: 'New node registered successfully with network'
        })
    })
    .catch(err => {
        console.log(err)
    })
    } else {
        res.json({
            note: 'New node already registered with network'
        })
}})


//Each already existing node registers new node
app.post('/register-node', async function (req, res){
    const { newNodeURL } = await req.body
    const nodeExists = coin.networkNodes.indexOf(newNodeURL) == -1
    const notCurrentNode = coin.currentNodeURL !== newNodeURL
    if (nodeExists && notCurrentNode){coin.networkNodes.push(newNodeURL)}
    res.json({note: 'New node registered successfully with current node'})
})

//New node registers all original nodes
app.post('/register-nodes-all', async function (req, res) {    
    const allNodes = await req.body.allNodes
    allNodes.forEach(networkNodeURL => {
        const nodeExists = coin.networkNodes.indexOf(networkNodeURL) == -1
        const notCurrentNode = coin.currentNodeURL !== networkNodeURL
        if (nodeExists && notCurrentNode){coin.networkNodes.push(networkNodeURL)}
    })
    res.json({note: 'New node successfully registered existing network nodes'})
})

app.get('/consensus', (req, res) => {
    const chainRequests = []
    coin.networkNodes.forEach(networkNode => {
        const requestOptions = {
            url: networkNode + '/blockchain',
            method: 'GET',
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }
        chainRequests.push(axios(requestOptions))
    })

    Promise.all(chainRequests)
    .then(blockchains => {
        const currentBlockchainLength = coin.chain.length
        let longestChainLength = currentBlockchainLength
        let newLongestChain = null
        let newPendingTransactions = null
        //Loop through each chain and check identify if another chain has a longer length
        blockchains.forEach(blockchain => {         
            if(blockchain.data.chain.length > longestChainLength){
                longestChainLength = blockchain.data.chain.length
                newLongestChain = blockchain.data.chain
                newPendingTransactions = blockchain.data.pendingTransactions
            } 
        })
        // Check that there isn't a new longest chain/the chain is valid if there is actually a new longest chain
        if (!newLongestChain || !coin.chainIsValid(newLongestChain) && newLongestChain){
            return res.json({
                note: 'Current chain has not been replaced',
                chain: coin.chain
        })
        //If there is a new longest & valid chain, replace the chain on this current node with the longest valid chain    
        } else {
            coin.chain = newLongestChain
            coin.pendingTransactions = newPendingTransactions
            return res.json({
                note: 'Current chain has been replaced',
                chain: coin.chain
            })
        }
    })
    .catch(err => console.log(err))
})

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})