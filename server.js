import express from "express"
import ip from "ip"

const app = express()
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.sendFile("join.html", { root: "html" })
})

app._router.get("/game", (req, res) => {
    res.sendFile("game.html", { root: "html" })
})

app.get("/admin", async (req, res) => {
    const file = Bun.file("html/admin.html")
    const text = await file.text()
    return res.send(text.replace('INSERT_IP', ip.address()))
})

app.listen(3000)