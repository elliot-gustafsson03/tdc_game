import express from "express"
import ip from "ip"

const port = 3000

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.sendFile("join.html", { root: "html" })
})

app._router.get("/game", (req, res) => {
    res.sendFile("game.html", { root: "html" })
})

app.get("/admin", async (req, res) => {
    const file = Bun.file("html/admin.html")
    const text = await file.text()
    return res.send(text.replace('INSERT_ENDPOINT', ip.address() + ":" + port))
})

app.post("/join", (req, res) => {
    const newPlayer = req.body.name
    addPlayer(newPlayer)
    
    res.sendStatus(200)
})

app.post("/newRound", (req, res) => {
    newRound()
    res.sendStatus(200)
})

app.get("/players", (req, res) => {
    res.send(JSON.stringify(players))
})

app.get("/getInfo", (req, res) => {
    const name = req.query.name
    res.send(JSON.stringify(getInfo(name)))
})

app.listen(port)


// GAME LOGIC


let players = []
let lostPlayers = []
let round = -1

function addPlayer(name) {
    if (!players.includes(name)) {
        players.push(name)
    }
}

function newRound() {
    round++
    
    lostPlayers = []
    lostPlayers.push(randomPlayer())
    
    let otherRandom = randomPlayer()
    while (lostPlayers.includes(otherRandom)) {
        otherRandom = randomPlayer()
    }

    lostPlayers.push(otherRandom)
}

function randomPlayer() {
    return players[Math.floor(Math.random() * players.length)]
}

function getInfo(name) {
    if (round >= 0) {
        if (lostPlayers.includes(name)) {
            return { 
                text: "You do not know who died, make something up!",
                image : "https://emergency.com.au/wp-content/uploads/2017/02/nervous.jpg"
            }
        }

        return rounds[round % rounds.length]
    }
    
    return { 
        text: "The game has not started yet",
        image: "https://clv.h-cdn.co/assets/17/24/2048x1365/funeral-etiquette-rude-behavior.jpg" 
    }
}

const rounds = [
    { 
        text: "Shrek has died. Prepare a speech to honor him",
        image: "https://www.cool-mania.se/data/product/1f/142eaf37043adae8847fa693af2bc0.png"
    },
    {
        text: "Walter White has died. Prepare a speech to honor him",
        image: "https://static1.srcdn.com/wordpress/wp-content/uploads/2020/02/Breaking-Bad-things-Walter-White-feature.jpg"
    }
]