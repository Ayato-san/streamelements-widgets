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

    /** Displays emotes instead of their text in the message */
    addEmotes() {
        const emotesName = []
        const emotesUrl = []
        this.data.emotes.forEach(emote => {
            emotesName.push(emote.name)
            emotesUrl.push(emote.urls[4])
        })

        const texts = this.#message.textContent.split(' ')
        let j = 0
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i].trim()
            if (emotesName.includes(text)) {
                texts[i] = `<img src='${emotesUrl[j]}' alt='${emotesName[j]}'/>`
                j++
            }
        }

        this.#message.innerHTML = texts.join(' ')
    }

    /** Displays badges of the chater */
    addBadges() {
        for (let i = 0; i < FieldData.maxBadges && i < this.data.badges.length; i++) {
            const img = document.createElement('img')
            img.src = this.data.badges[i].url
            img.alt = htmlEncode(this.data.badges[i].type)
            this.#badges.appendChild(img)
        }
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

function onMessage(event) {
  	// filters
  	if (hasIgnoredPrefix(event.data.text)) return
  	if (hasIgnoredUser(event.data.displayName)) return
  
  	// Message creation and post
    const msg = new Message(event.data, document.querySelector('chatbox'))
    if (FieldData.displayEmote) msg.addEmotes()
    if (FieldData.displayBadge) msg.addBadges()
    msg.postMessage()
}

function deleteMessage(msgId) {
  	document.querySelector(`chat[data-message-id="${msgId}"]`).remove()
}

function deleteMessages(userId) {
  	document.querySelectorAll(`chat[data-user-id="${userId}"]`).forEach(e => e.remove());
}

function onButton(event) {
  const { listener, field, value } = event

  if (listener !== 'widget-button' || value !== 'Ayato-san_AdaptiveChat') return

  switch(field) {
    case 'testMessageButton': sendTestMessage()
      break
    default: return
  }
}

function sendTestMessage(amount = 1) {
  if (devMod) console.log("send " + amount + " test message" + (amount > 1 ? "s" : ""));
  for (let i = 0; i < amount; i++) {
    window.setTimeout(_ => {
      const name = `user_${random(1, 10).toString()}`

      const event = {
        data: {
          badges: [],
          channel: '',
          displayColor: '',
          displayName: name,
          emotes: [],
          isAction: false,
          msgId: `${name}_${Date.now()}`,
          nick: '',
          tags: {},
          text: 'test',
          userId: name,
        }
      }

      const previewMessage = FieldData.previewMessage.trim()
      if (previewMessage !== '') {
        event.data.text = previewMessage
      } else {
        var text = ''
        for (let index = 0; index < random(2, 50); index++) {
            switch (random(0, 5)) {
                case 0:
                case 1:
                case 2:
                case 3:
                    text += MESSAGES[random(0, MESSAGES.length - 1)] + ' '
                    break
                default:
                    let emote
                    try {
                        emote = EMOTES[random(0, EMOTES.length - 1)]
                        text += emote.name + ' '
                        event.data.emotes.push(emote)
                    } catch (error) {
                        console.log(error)
                    }
            }
        }
        event.data.text = text
      }
      for (let i = 0; i <= random(0, 10); i++) {
        let badge = {}
        do {
          badge = BADGES[random(0, BADGES.length - 1)]
        } while (event.data.badges.includes(badge))
          event.data.badges.push(badge)
      }
      onMessage(event)
    }, i * random(10,2000))
  }
}

// ---------------------
//    Helper Functions
// ---------------------

function htmlEncode(text) {
    return text.replace(/[\<\>\"\'\^\=]/g, char => `&#${char.charCodeAt(0)};`).trim()
}

function loadFieldData(data) {
    FieldData = data
    processFieldData(
        value => stringToArray(value),
        'ignoreUserList',
        'ignorePrefixList'
    )
    processFieldData(
        value => value === 'true',
        'displayBadge',
        'displayBorder',
        'displayEmote',
        'useCustomUserColor',
        'deleteMessage'
    )
}

function processFieldData(process, ...keys) {
    for (const key of keys) { FieldData[key] = process(FieldData[key]) }
}

function stringToArray(string = '', separator = ',') {
    return string.split(separator).reduce((acc, value) => {
        const trimmed = value.trim()
        if (trimmed !== '') acc.push(trimmed)
        return acc
    }, [])
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function hasIgnoredPrefix(text) {
    for (const prefix of FieldData.ignorePrefixList) {
        if (text.startsWith(prefix)) return true
    }
    return false
}

function hasIgnoredUser(user) {
    for (const ignored of FieldData.ignoreUserList) {
        if (user.toLowerCase() == ignored.toLowerCase()) return true
    }
    return false
}

function generateColor(name) {
    if (!name) return COLORS[11]
    const value = name.split('').reduce((sum, letter) => sum + letter.charCodeAt(0), 0)
    return COLORS[value % COLORS.length]
}

// -------------
//    Dataset
// -------------

const EMOTES = [
    {
        end: 13,
        gif: false,
        id: '166263',
        name: 'TwitchLit',
        start: 5,
        type: 'twitch',
        urls: {
            1: 'https://static-cdn.jtvnw.net/emoticons/v2/166263/default/dark/1.0',
            2: 'https://static-cdn.jtvnw.net/emoticons/v2/166263/default/dark/2.0',
            4: 'https://static-cdn.jtvnw.net/emoticons/v2/166263/default/dark/3.0'
        }
    },
    {
        end: 28,
        gif: false,
        id: '27081',
        name: 'ZreknarF',
        start: 20,
        type: 'ffz',
        urls: {
            1: 'https://cdn.frankerfacez.com/emote/27081/1',
            2: 'https://cdn.frankerfacez.com/emote/27081/2',
            4: 'https://cdn.frankerfacez.com/emote/27081/4'
        }
    },
    {
        end: 36,
        gif: false,
        id: '55028cd2135896936880fdd7',
        name: 'D:',
        start: 34,
        type: 'bttv',
        urls: {
            1: 'https://cdn.betterttv.net/emote/55028cd2135896936880fdd7/1x',
            2: 'https://cdn.betterttv.net/emote/55028cd2135896936880fdd7/2x',
            4: 'https://cdn.betterttv.net/emote/55028cd2135896936880fdd7/3x'
        }
    },
    {
        end: 7,
        gif: true,
        id: '567b5b520e984428652809b6',
        name: 'SoSnowy',
        start: 0,
        type: 'bttv',
        urls: {
            1: 'https://cdn.betterttv.net/emote/567b5b520e984428652809b6/1x',
            2: 'https://cdn.betterttv.net/emote/567b5b520e984428652809b6/2x',
            4: 'https://cdn.betterttv.net/emote/567b5b520e984428652809b6/3x'
        }
    },
    {
        end: 27,
        gif: false,
        id: '302303576',
        name: 'PrideLion',
        start: 19,
        type: 'twitch',
        urls: {
            1: 'https://static-cdn.jtvnw.net/emoticons/v2/302303576/default/dark/1.0',
            2: 'https://static-cdn.jtvnw.net/emoticons/v2/302303576/default/dark/2.0',
            4: 'https://static-cdn.jtvnw.net/emoticons/v2/302303576/default/dark/3.0'
        }
    },
    {
        end: 35,
        gif: false,
        id: '25927',
        name: 'CatBag',
        start: 29,
        type: 'ffz',
        urls: {
            1: 'https://cdn.frankerfacez.com/emote/25927/1',
            2: 'https://cdn.frankerfacez.com/emote/25927/2',
            4: 'https://cdn.frankerfacez.com/emote/25927/4'
        }
    }
]

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

const MESSAGES = [
    'lol',
    'so fun',
    "it's beautiful",
    'link start',
    'nice play',
    'cool',
    'hi',
    'lmao'
]

const BADGES = [
    {
        description: 'Twitch Admin',
        type: 'admin',
        url: 'https://static-cdn.jtvnw.net/badges/v1/9ef7e029-4cdf-4d4d-a0d5-e2b3fb2583fe/3',
        version: '1'
    },
    {
        description: 'Twitch Ambassador',
        type: 'ambassador',
        url: 'https://static-cdn.jtvnw.net/badges/v1/2cbc339f-34f4-488a-ae51-efdf74f4e323/3',
        version: '1'
    },
    {
        description: 'Anonymous Cheerer',
        type: 'anonymous-cheerer',
        url: 'https://static-cdn.jtvnw.net/badges/v1/ca3db7f7-18f5-487e-a329-cd0b538ee979/3',
        version: '1'
    },
    {
        description: '{Username} created emotes for {Streamer Name}’s channel.',
        type: 'artist-badge',
        url: 'https://static-cdn.jtvnw.net/badges/v1/4300a897-03dc-4e83-8c0e-c332fee7057f/3',
        version: '1'
    },
    {
        description: ' ',
        type: 'bits',
        url: 'https://static-cdn.jtvnw.net/badges/v1/73b5c3fb-24f9-4a82-a852-2f475b59411c/3',
        version: '1'
    },
    {
        description: ' ',
        type: 'bits',
        url: 'https://static-cdn.jtvnw.net/badges/v1/09d93036-e7ce-431c-9a9e-7044297133f2/3',
        version: '100'
    },
    {
        description: ' ',
        type: 'bits',
        url: 'https://static-cdn.jtvnw.net/badges/v1/0d85a29e-79ad-4c63-a285-3acd2c66f2ba/3',
        version: '1000'
    },
    {
        description: ' ',
        type: 'cheer 5000',
        url: 'https://static-cdn.jtvnw.net/badges/v1/57cd97fc-3e9e-4c6d-9d41-60147137234e/3',
        version: '5000'
    },
    {
        description: ' ',
        type: 'cheer 25000',
        url: 'https://static-cdn.jtvnw.net/badges/v1/64ca5920-c663-4bd8-bfb1-751b4caea2dd/3',
        version: '25000'
    },
    {
        description:
            'Supported their favorite streamer during the 2018 Blizzard of Bits',
        type: 'bits-charity',
        url: 'https://static-cdn.jtvnw.net/badges/v1/a539dc18-ae19-49b0-98c4-8391a594332b/3',
        version: '1'
    },
    {
        description: 'Ranked as a top cheerer on this channel',
        type: 'bits-leader',
        url: 'https://static-cdn.jtvnw.net/badges/v1/8bedf8c3-7a6d-4df2-b62f-791b96a5dd31/3',
        version: '1'
    },
    {
        description: 'Ranked as a top cheerer on this channel',
        type: 'bits-leader',
        url: 'https://static-cdn.jtvnw.net/badges/v1/f04baac7-9141-4456-a0e7-6301bcc34138/3',
        version: '2'
    },
    {
        description: 'Ranked as a top cheerer on this channel',
        type: 'bits-leader',
        url: 'https://static-cdn.jtvnw.net/badges/v1/f1d2aab6-b647-47af-965b-84909cf303aa/3',
        version: '3'
    },
    {
        description: 'Broadcaster',
        type: 'broadcaster',
        url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3',
        version: '1'
    },
    {
        description: 'Power Clipper',
        type: 'clip-champ',
        url: 'https://static-cdn.jtvnw.net/badges/v1/f38976e0-ffc9-11e7-86d6-7f98b26a9d79/3',
        version: '1'
    }
]