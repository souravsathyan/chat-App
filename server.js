const http = require('http')
const express = require('express')
const path = require('path')
const { Server } = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurentUser, userLeaves, getRoomUsers } = require('./utils/users')


const app = express()

const PORT = 3000 || process.env.port
const botName = 'Chatcord Bot'

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})


// setting the static folder
app.use(express.static(path.join(__dirname, 'public')))

// Run when client connects
io.on('connection', socket => {
    // joining the room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)
        //Welcome the current user 
        // sending to the user connected
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'));

        // Broadcast when a user connects
        // sending to all others except user
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username}has joined the chat`))
        // listing all the users
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })


    // to all
    // io.emit()

    // listen for the chat message
    socket.on('chatMessage', (msg) => {
        const user = getCurentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    // runs when user disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))
        }
        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })

    })
})






