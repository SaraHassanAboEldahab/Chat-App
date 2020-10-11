/////////// 18. Storing Users Part I ///////////
const users = []

const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //validate the data
    if (!username || !room) {
        return {
            error: "username and room are required !!"
        }
    }
    //check for existing user, find() it returns an array of matched items
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    //validate if this user exists then it can't be added to this room
    if (existingUser) {
        return {
            error: "this name is in use :("
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser=(id)=>{
    //findIndex is similar to find() but it returns the position of the matched items
    //it returns -1 if didn't find match, and returns 0 if find one matched item ,1 if 2 matched items and so on
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1){
        //splice allow us to remove items from array by their index , and it takes 2 arguments 1-the number of index of that item (which i want to remove) ,2-the number of items i want to remove
        //it will return an array of the items i want to remove, and because i will remove one item(l hwa hena object of user), then to access it i select index [0], then it will return the object which i removed
        return users.splice(index,1)[0]
    }
}

///////////////////// challenge ///////////////////
const getUser=(id)=>{
    return users.find((user)=> user.id===id)
}

const getUsersInRoom=(room)=>{
    room = room.trim().toLowerCase()

    //ast5dmt hena filter msh find 3shan filter hatfdl tdwr fel array kolo l7d matgm3 kol l matching w trg3hom fe array
    //lkn find btrg3 awl user hay match w msh hatkml l searching w kda hena hatrg3 object, w d btfedny lw 3ayza user mo3yn bs fa kda hatwfr 3alya l w2t
    return users.filter((user)=>user.room===room)
}
/*addUser({
    id:23,
    username:"salma",
    room:"cairo"
})
addUser({
    id:20,
    username:"mona",
    room:"cairo"
})
addUser({
    id:50,
    username:"sara",
    room:"alex"
})
const res=getUser(20)
console.log(res)

const usersOfRoom=getUsersInRoom("cairo")
console.log(usersOfRoom) */

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}