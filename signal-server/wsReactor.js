const { WebSocketServer } = require('../../vf/ws/')
const Toss = require('./toss.js')
const dbPath = process.argv[3] || '/data-ws'
const tss = new Toss(dbPath)

const wss = new WebSocketServer({ port: 8080 });

const sockets = []

wss.on("connection", (ws, request) => {
    console.log('connected')
    sockets.push(ws)
    
    ws.on('message', async (datum) => {
        const d = JSON.parse(datum)
        if(d.channel == '*') sockets.map((s) => s.send(JSON.stringify({status: 107, msg: 'broadcast'})))
        else sockets.map((s) => s.send(JSON.stringify({channel: d.channel, status: d.status, msg: d.msg})))
        
        if(d.channel == 'update') {
            const obj = {}
            console.log(d)
            obj[d.msg.key] = d.msg.value
            await tss.apnd(obj)
            sockets.map((s) => {console.log('sending'); s.send(JSON.stringify({channel: d.channel, status: d.status, msg: d.msg}))})
        }
    })
})
