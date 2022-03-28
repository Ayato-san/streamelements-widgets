const devMod = false
let FieldData = {}
const Widget = {
  width: 0,
  height: 0
}

// ---------------------------
//    Widget Initialization
// ---------------------------

window.addEventListener('onWidgetLoad', obj => {
  	const chatbox = document.querySelector('chatbox')
    window.setTimeout(_ => {
      Widget.width = chatbox.innerWidth
      Widget.height = chatbox.innerHeight
    }, 1000)

    loadFieldData(obj.detail.fieldData)
 
    if (devMod) {
        console.clear()
        console.log("%c%s(v%s) by %s", "font-weigth:900;font-size:400%", FieldData.widgetName, FieldData.widgetVersion, FieldData.widgetAuthor)
    	console.log("%cField Data", "font-weigth:bold;font-size:200%")
   		console.table(FieldData)
    }
    chatbox.classList.add(FieldData.appearAnimation)
    chatbox.classList.add(FieldData.chatDirection)
    chatbox.classList.add(FieldData.cornerType)
    FieldData.displayBorder ? chatbox.classList.add('bordered') : null

    if (devMod) sendTestMessage(20)
})


// -----------------------
//    Message Component
// -----------------------

class Message {
    #chat
    #header
    #username
    #badges
    #message
    #chatbox
    /**
     * @param {json} data message data passed in chat
     * @param {HTMLElement} box container of all messages
     */
    constructor(data, box) {
        this.data = data
        this.#chatbox = box
        this.#chat = document.createElement('chat')
        this.#header = document.createElement('header')
        this.#username = document.createElement('username')
        this.#badges = document.createElement('badges')
        this.#message = document.createElement('message')
        this.#appendItems()
    }

    #appendItems() {
        this.#chat.appendChild(this.#header)
        this.#chat.appendChild(this.#message)
        this.#header.appendChild(this.#username)
        this.#header.appendChild(this.#badges)

        this.#username.appendChild(document.createTextNode(htmlEncode(this.data.displayName)))
        
        if (FieldData.useCustomUserColor) this.#username.style.color = FieldData.customUserColor
        else this.#username.style.color = this.data.displayColor || generateColor(this.data.displayName)
		this.#message.innerHTML = htmlEncode(this.data.text)

        this.#chat.dataset.msgId = this.data.msgId
        this.#chat.dataset.userId = this.data.userId
    }

    /** Add the message to the container */
    postMessage() {
        this.#chatbox.appendChild(this.#chat)

        if (FieldData.deleteMessage)
            window.setTimeout(_ => {
                this.#chat.remove()
            }, FieldData.lifetime * 1000)
    }
}

// --------------------
//    Event Handlers
// --------------------

window.addEventListener('onEventReceived', obj => {
    const { listener, event } = obj.detail
    switch(listener) {
      case 'message': onMessage(event)
        break
      case 'delete-message': deleteMessage(event.msgId)
        break
      case 'delete-messages': deleteMessages(event.userId)
        break
      case 'event:test': onButton(event)
        break
      default: return
    }
})


// ---------------------
//    Event Functions
// ---------------------

function onMessage(event) {}

function deleteMessage(msgId) {}

function deleteMessages(userId) {}

function onButton(event) {}

// ---------------------
//    Helper Functions
// ---------------------

function generateColor(name) {
    if (!name) return COLORS[11]
    const value = name.split('').reduce((sum, letter) => sum + letter.charCodeAt(0), 0)
    return COLORS[value % COLORS.length]
}

// -------------
//    Dataset
// -------------

const COLORS = [
    '#FF0000',
    '#0000FF',
    '#008000',
    '#B22222',
    '#FF7F50',
    '#9ACD32',
    '#FF4500',
    '#2E8B57',
    '#DAA520',
    '#D2691E',
    '#5F9EA0',
    '#1E90FF',
    '#FF69B4',
    '#8A2BE2',
    '#00FF7F',
    '#ff4a80',
    '#ff7070',
    '#fa8e4b',
    '#fee440',
    '#5fff77',
    '#00f5d4',
    '#00bbf9',
    '#4371fb',
    '#9b5de5',
    '#f670dd'
]