const tchat = document.querySelector('#tchat')

let fieldData = {}
window.addEventListener('onWidgetLoad', function (obj) {
    loadFieldData(obj.detail.fieldData)
})

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.event.listener === 'widget-button') {
        if (obj.detail.event.field === 'testMessage') {
            let emulated = new CustomEvent('onEventReceived', {
                detail: {
                    listener: 'message',
                    event: {
                        service: 'twitch',
                        data: {
                            time: Date.now(),
                            tags: {
                                'badge-info': '',
                                badges: 'moderator/1,partner/1',
                                color: '#5B99FF',
                                'display-name': 'StreamElements',
                                emotes: '25:46-50',
                                flags: '',
                                id: `43285909-412c-4eee-b80d-89f72ba${Math.floor(Math.random() * 90000) + 10000}`,
                                mod: '1',
                                'room-id': '85827806',
                                subscriber: '0',
                                'tmi-sent-ts': '1579444549265',
                                turbo: '0',
                                'user-id': '100135110',
                                'user-type': 'mod',
                            },
                            nick: 'Ayat0_san_',
                            userId: '100135110',
                            displayName: 'Ayat0_san_',
                            displayColor: '#5B99FF',
                            badges: [
                                {
                                    type: 'broadcaster',
                                    version: '1',
                                    url: 'https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3',
                                    description: 'Broadcaster',
                                },
                                {
                                    type: 'partner',
                                    version: '1',
                                    url: 'https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3',
                                    description: 'Verified',
                                },
                                {
                                    type: 'prime',
                                    version: '1',
                                    url: 'https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/3',
                                    description: 'Prime',
                                },
                                {
                                    type: 'subscriber',
                                    version: '1',
                                    url: 'https://static-cdn.jtvnw.net/badges/v1/5d9f2208-5dd8-11e7-8513-2ff4adfae661/3',
                                    description: 'Subscriber',
                                },
                            ],
                            channel: 'Ayat0_san_',
                            text: 'Howdy! My name is Bill and I am here to serve Kappa',
                            isAction: !1,
                            emotes: [
                                {
                                    type: 'twitch',
                                    name: 'Kappa',
                                    id: '25',
                                    gif: !1,
                                    urls: {
                                        1: 'https://static-cdn.jtvnw.net/emoticons/v1/25/1.0',
                                        2: 'https://static-cdn.jtvnw.net/emoticons/v1/25/1.0',
                                        4: 'https://static-cdn.jtvnw.net/emoticons/v1/25/3.0',
                                    },
                                    start: 46,
                                    end: 50,
                                },
                            ],
                            msgId: `43285909-412c-4eee-b80d-89f72ba${Math.floor(Math.random() * 90000) + 10000}`,
                        },
                        renderedText:
                            'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">',
                        // 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo ad sunt consequatur magnam perspiciatis omnis dignissimos mollitia quisquam cum hic, sit facere neque itaque alias sed voluptatum temporibus quo beatae labore! Perferendis veritatis ad molestias odit quibusdam minima possimus adipisci. Et fugiat facilis ab consequuntur dignissimos. Nihil sapiente at rem nobis quibusdam et vel exercitationem magni porro, quam cumque voluptates molestiae ab nisi quae ullam sequi voluptatum voluptatibus corrupti eaque, veniam suscipit, cum velit animi? Nulla nihil aliquid corporis exercitationem doloribus, labore totam sint rerum tempora, quas rem, soluta quod delectus nobis esse minus perferendis laboriosam mollitia neque itaque. Tempora architecto cumque asperiores est fugiat? Fuga facilis ullam ratione eius consectetur dolore inventore odit, itaque beatae ab odio doloribus nostrum, vero dolorem, placeat ea aperiam accusamus! Soluta exercitationem, ipsam architecto non, nam distinctio odio similique repellendus tempora illum animi tenetur repellat at beatae quaerat molestias enim nihil. Dicta, impedit. Atque sit recusandae facilis ipsa corrupti ipsum ducimus molestias cumque. Eligendi voluptate sint iure? Repellendus minus magnam, ratione asperiores corrupti at deleniti error impedit odit ducimus quas maiores iste, quam dolorum ipsa beatae sint. Natus, eius blanditiis. Necessitatibus aut maiores ipsum minima labore, voluptatum deleniti eum pariatur impedit recusandae quis suscipit ducimus saepe odit provident dolore veritatis. Animi cupiditate, aspernatur, eveniet iure unde magni velit impedit sunt modi illo, doloribus vel nulla provident praesentium hic esse amet at? Aspernatur tenetur consectetur non dolore, et minima veritatis accusamus blanditiis repudiandae, deserunt eaque laborum error consequuntur quisquam nesciunt optio odit, magnam nihil architecto.',
                    },
                },
            })
            window.dispatchEvent(emulated)
        }
        return
    }
    if (obj.detail.listener === 'delete-message') {
        const msgId = obj.detail.event.msgId
        document.querySelectorAll(`#message-${msgId}`).forEach((el) => {
            el.remove()
        })
        return
    } else if (obj.detail.listener === 'delete-messages') {
        const sender = obj.detail.event.userId
        document.querySelectorAll(`.message[data-sender=${sender}]`).forEach((el) => {
            el.remove()
        })
        return
    }

    if (obj.detail.listener !== 'message') return

    // filters
    if (hasIgnoredPrefix(obj.detail.event.data.text)) return
    if (hasIgnoredUser(obj.detail.event.data.displayName)) return

    addMessage(obj.detail.event.data, obj.detail.event.renderedText)
})

function addMessage(data, message) {
    const color = data.displayColor || `#${md5(data.displayName).substr(26)}`
    const badges = data.badges.slice(0, 3).reduce((acc, badge) => acc + `<img src="${badge.url}" class="badge"/>`, '')
    const messageDiv = document.createElement('div')
    messageDiv.id = `message-${data.msgId}`
    messageDiv.dataset.sender = data.userId
    messageDiv.classList.add('message')
    messageDiv.style = `--color:${color}`
    messageDiv.insertAdjacentHTML(
        'beforeend',
        `<div class="meta">
            <div class="badges">${badges}</div>
            <div class="name">${data.displayName}</div>
        </div>
        <div class="content">${message}</div>`
    )
    tchat.insertAdjacentElement('beforeend', messageDiv)

    const messages = document.querySelectorAll('.message')
    const messageCount = messages.length
    const limit = 20
    if (messageCount > limit) {
        Array.from(messages)
            .slice(0, messageCount - limit)
            .forEach((el) => el.remove())
    }
}

function loadFieldData(data) {
    fieldData = data
    processFieldData((value) => stringToArray(value), 'ignoreUserList', 'ignorePrefixList')
}

function processFieldData(process, ...keys) {
    for (const key of keys) {
        fieldData[key] = process(fieldData[key])
    }
}

function stringToArray(string = '', separator = ',') {
    return string.split(separator).reduce((acc, value) => {
        const trimmed = value.trim()
        if (trimmed !== '') acc.push(trimmed)
        return acc
    }, [])
}

function hasIgnoredPrefix(text) {
    for (const prefix of fieldData.ignorePrefixList) {
        if (text.startsWith(prefix)) return true
    }
    return false
}

function hasIgnoredUser(user) {
    for (const ignored of fieldData.ignoreUserList) {
        if (user.toLowerCase() == ignored.toLowerCase()) return true
    }
    return false
}
