const express = require('express')
const bodyParser = require ('body-parser')
const Blockchain = require ('./blockchain')
const rp = require('request-promise')
const uuid = require ('uuid').v1
const nodeAddress = uuid().replace(/-/g, '')
const port = process.argv[2]
const coin = new Blockchain()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': false}))



app.get('/blockchain', (req, res) => {
    res.send(coin)
})

app.post('/transaction', (req, res) => {
    const {amount, sender, recipient} = req.body
    const blockIndex = coin.createNewTransaction(amount, sender, recipient)
    res.json({
        note: `Transaction will be added to block ${blockIndex}`
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
    res.json({
        note: 'New block mined',
        block: newBlock
    })
})

//Register node with the network and broadcast to other nodes
app.post('/register-broadcast-node', (req, res) => {
    //Grab the new node URL
    const newNodeURL = req.body.newNodeURL
    //Check that the node doesn't already exist in list of network nodes
    if (coin.networkNodes.indexOf() == -1 ){
        //Add node by pushing into networkNodes array
        coin.networkNodes.push(newNodeURL)
        //Initialize an empty array for to add a promise for each individual node
        const registerNodesPromises = []
        //Loop through current existing nodes
        coin.networkNodes.forEach(networkNode => {
            const requestOptions = {
                //Create register node uri for each node
                uri: networkNode + '/register-node',
                method: 'POST',
                body: {newNodeURL},
                json: true
            }
        //Push promise into register nodes array
        registerNodesPromises.push(rp(requestOptions))    
    })

    Promise.all(registerNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeURL + '/register-nodes-all',
            method: 'POST',
            body: { allNodes: [...coin.networkNodes, coin.currentNodeURL]},
            json: true
        }
        return rp(bulkRegisterOptions)
    })
    .then(data => {
        res.json({
            note: 'New node registered successfully'
        })
    })
}})

//Each already existing node registers new node
app.post('/register-node', (req, res) => {

})

//New node registers all original nodes
app.post('/register-nodes-all', (req, res) => {

})

app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})