const socket = io()

//// Elements
const msgForm = document.querySelector("form")
const msgFormIn = msgForm.querySelector("input")
const msgFormButton = msgForm.querySelector("button")
const sendButton = document.querySelector("#sendLocation")
const messages = document.querySelector("#messages")//location that we will render the template
const sidebar = document.querySelector("#sidebar")


//// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    //new message element
    const newMsg = messages.lastElementChild

    //height of the new message
    const newMsgStyles = window.getComputedStyle(newMsg)
    const newMsgMargin = parseInt(newMsgStyles.marginBottom)
    const newMsgHeight = newMsg.offsetHeight + newMsgMargin

    //visible height
    const visibleHeight = messages.offsetHeight

    //height of container
    const containerHeight = messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMsgHeight <= scrollOffset) {
        messages.scrollTop = containerHeight
    }
}

socket.on("sendMsg", (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:m a")
    })
    messages.insertAdjacentHTML("beforeend", html)

    autoScroll()
})

socket.on("locationMsg", (locationMsg) => {
    console.log(locationMsg)
    const html = Mustache.render(locationTemplate, {
        username: locationMsg.username,
        locationUrl: locationMsg.url,
        createdAt: moment(locationMsg.createdAt).format("h:m a")
    })
    messages.insertAdjacentHTML("beforeend", html)

    autoScroll()
})

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})

msgForm.addEventListener("submit", (e) => {
    e.preventDefault()

    //// Disabled
    msgFormButton.setAttribute("disabled", "disabled")
    const msg = msgFormIn.value
    socket.emit("sendMsg", msg, (error) => {
        //enable
        msgFormButton.removeAttribute("disabled")
        msgFormIn.value = ""
        msgFormIn.focus()
        if (error) {
            return console.log(error)
        }
        console.log("the message was delivered :)")
    })
})
sendButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("ur browser doesn't support the geolocation")
    }
    sendButton.setAttribute("disabled", "disabled")
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendButton.removeAttribute("disabled")
            console.log("location is shared :)")
        })
    })
})

msgFormIn.addEventListener("keyup", () => {
    content = msgFormIn.value
    socket.emit("typing", content)
})
socket.on("typing", (content) => {
    if (content !== "") {
        return document.getElementById("typing").innerHTML = "typing.... "
    }
        return document.getElementById("typing").innerHTML = ""

})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }
})

