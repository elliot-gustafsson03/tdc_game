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
    const newUser = req.body.name
    console.log(newUser)

    res.sendStatus(200)
})

app.listen(port)