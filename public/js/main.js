const socket = io()

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const room = urlParams.get('room');
console.log(username, room);
// sending username and room to server

// join chat room
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})
// message from the server
socket.on('message', message => {
    console.log(message);
    outputMessage(message)

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

// form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //Get message from the front 
    const msg = e.target.elements.msg.value
    // emitting the message to the server
    socket.emit('chatMessage', msg)
    // after emitting clearing the field
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// otput message to DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = ` <p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room
}

// add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(users => `<li>${users.username}</li>`).join('')}
    `
}
