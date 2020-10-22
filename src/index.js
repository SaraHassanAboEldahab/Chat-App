const path = require("path")
const http = require("http")
const express = require("express")
const socketIo = require("socket.io")
const Filter = require("bad-words")
const { generateMsg, generateLocationMsg } = require("./utils/messages")
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const port = process.env.PORT || 3000
const publicPath = path.join(__dirname, "../public")

app.use(express.static(publicPath))

//every connection has a unique id associated with it, which is => socket.id
io.on('connection', (socket) => {
    console.log("new  webSocket connection :)")

    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit("sendMsg", generateMsg("Admin", "Welcome ^__^"))
        socket.broadcast.to(user.room).emit("sendMsg", generateMsg("Admin", `${user.username} has joined :)`))

        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })
    console.log("ay 7aga")
    socket.on("sendMsg", (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback("the profane words are not allowed :(")
        }
        io.to(user.room).emit("sendMsg", generateMsg(user.username, msg))
        callback()
    })
    socket.on("typing", (content) => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit("typing", content)
    })
    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMsg", generateLocationMsg(user.username, `http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit("sendMsg", generateMsg("Admin", `${user.username} has left :(`))

            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`server is up on port ${port} ^__^`)
})