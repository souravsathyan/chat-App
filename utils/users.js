const { fchown } = require("fs")

const users = []
// join user to chat
function userJoin(id,username,room){
    const user = {id,username,room}
    users.push(user)
    return user
}

function getCurentUser(id){
    return users.find(user=>user.id===id)
}

// when user leaves the app
function userLeaves(id){
    const index = users.findIndex(user => user.id === id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

// get the users in room
function getRoomUsers(room){
    return users.filter(user=>user.room == room)
}


module.exports={
    userJoin,
    getCurentUser,
    userLeaves,
    getRoomUsers
}