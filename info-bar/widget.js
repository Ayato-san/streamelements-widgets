// Variables
let settings = {
    global: {
        internal_clock: 1000,
        stats_clock: 60000,
    },
    stats: {
        refresh_rate: 5, // Seconds
    },
}
let state = {
    stats: {
        followers: {
            enabled: false,
            count: 0,
            icon: 'heart',
        },
        subs: {
            enabled: false,
            count: 0,
            icon: 'crown',
        },
        viewers: {
            enabled: false,
            count: 0,
            icon: 'eye',
        },
    },
    latest: {
        follower: {
            enabled: false,
            name: '',
            icon: 'heart',
            empty: '',
        },
        subscriber: {
            enabled: false,
            name: '',
            amount: 0,
            icon: 'crown',
            empty: '',
        },
        donation: {
            enabled: false,
            name: '',
            amount: 0,
            icon: 'money-bill-wave',
            empty: '',
        },
        cheer: {
            enabled: false,
            name: '',
            amount: 0,
            icon: 'gem',
            empty: '',
        },
        raid: {
            enabled: false,
            name: '',
            amount: 0,
            icon: 'handshake',
            empty: '',
        },
    },
}
let channelName = ''
let stats_keys
let stats_pos = 0
let stats_width = 0
let latest_keys
let latest_pos = 0
let currency = ''

const stats_container = document.querySelector('.stats-container')
const latest_container = document.querySelector('.latest-container')
const clock = document.querySelector('.clock')

// Start everything!
function start() {
    // Generate stats_keys variable
    stats_keys = Object.keys(state.stats)
    latest_keys = Object.keys(state.latest)

    // Live Viewers/Followers Refresh
    if (state.stats.viewers) {
        getViewerStat()
        setInterval(function () {
            // Viewers
            getViewerStat()
        }, settings.global.stats_clock)
    }

    updateFields()
    // Start refresh clock
    setInterval(updateFields, settings.stats.refresh_rate * 1000)
}

// On widget load, setup settings/state etc
window.addEventListener('onWidgetLoad', function (obj) {
    // Variables
    let fieldData = obj.detail.fieldData
    currency = obj.detail.currency.symbol
    if (channelName == '') {
        channelName = obj.detail.channel.username
    }

    // Update settings
    settings.stats.refresh_rate = fieldData.stats_refresh_rate

    // Stats
    if (fieldData.stats_toggle_followers == 'true') {
        state.stats.followers.enabled = true
        state.stats.followers.icon = fieldData.followers_icon
        // Followers
        state.stats.followers.count = obj.detail.session.data['follower-total'].count
    } else {
        delete state.stats.followers
    }
    if (fieldData.stats_toggle_subs == 'true') {
        state.stats.subs.enabled = true
        state.stats.subs.icon = fieldData.subs_icon
        state.stats.subs.count = obj.detail.session.data['subscriber-total'].count
    } else {
        delete state.stats.subs
    }
    if (fieldData.stats_toggle_viewers == 'true') {
        state.stats.viewers.enabled = true
        state.stats.viewers.icon = fieldData.viewers_icon
        // Update live viewers
        getViewerStat()
    } else {
        delete state.stats.viewers
    }

    // Latest
    if (fieldData.latest_toggle_follower == 'true') {
        state.latest.follower.empty = fieldData.latest_follower_empty
        state.latest.follower.enabled = true
        state.latest.follower.icon = fieldData.followers_icon

        if (obj.detail.session.data['follower-latest'].name != '') {
            state.latest.follower.name = obj.detail.session.data['follower-latest'].name
        }
    } else {
        delete state.latest.follower
    }
    if (fieldData.latest_toggle_donation == 'true') {
        state.latest.donation.empty = fieldData.latest_donation_empty
        state.latest.donation.enabled = true
        state.latest.donation.icon = fieldData.donation_icon

        if (obj.detail.session.data['tip-latest'].name != '') {
            state.latest.donation.name = obj.detail.session.data['tip-latest'].name
            state.latest.donation.amount = obj.detail.session.data['tip-latest'].amount
        }
    } else {
        delete state.latest.donation
    }
    if (fieldData.latest_toggle_cheer == 'true') {
        state.latest.cheer.empty = fieldData.latest_cheer_empty
        state.latest.cheer.enabled = true
        state.latest.cheer.icon = fieldData.cheer_icon

        if (obj.detail.session.data['cheer-latest'].name != '') {
            state.latest.cheer.name = obj.detail.session.data['cheer-latest'].name
            state.latest.cheer.amount = obj.detail.session.data['cheer-latest'].amount
        }
    } else {
        delete state.latest.cheer
    }
    if (fieldData.latest_toggle_subscriber == 'true') {
        state.latest.subscriber.empty = fieldData.latest_subscriber_empty
        state.latest.subscriber.enabled = true
        state.latest.subscriber.icon = fieldData.subs_icon

        if (obj.detail.session.data['subscriber-latest'].name != '') {
            state.latest.subscriber.name = obj.detail.session.data['subscriber-latest'].name
            state.latest.subscriber.amount = obj.detail.session.data['subscriber-latest'].amount
        }
    } else {
        delete state.latest.subscriber
    }
    if (fieldData.latest_toggle_raid == 'true') {
        state.latest.raid.empty = fieldData.latest_raid_empty
        state.latest.raid.enabled = true
        state.latest.raid.icon = fieldData.raid_icon

        if (obj.detail.session.data['raid-latest'].name != '') {
            state.latest.raid.name = obj.detail.session.data['raid-latest'].name
            state.latest.raid.amount = obj.detail.session.data['raid-latest'].amount
        }
    } else {
        delete state.latest.raid
    }

    // Start Everything!
    start()
})

// On session update
window.addEventListener('onSessionUpdate', function (obj) {
    // Stats - Subs
    if (state.stats.subs) {
        state.stats.subs.count = obj.detail.session['subscriber-total'].count
    }

    // Latest - Donation
    if (state.latest.donation) {
        state.latest.donation.name = obj.detail.session['tip-latest'].name
        state.latest.donation.amount = obj.detail.session['tip-latest'].amount
    }

    // Latest - Cheer
    if (state.latest.cheer) {
        state.latest.cheer.name = obj.detail.session['cheer-latest'].name
        state.latest.cheer.amount = obj.detail.session['cheer-latest'].amount
    }

    // Latest - Subscriber
    if (state.latest.subscriber) {
        state.latest.subscriber.name = obj.detail.session['subscriber-latest'].name
        state.latest.subscriber.amount = obj.detail.session['subscriber-latest'].amount
    }

    // Latest - Follower
    if (state.latest.follower) {
        state.latest.follower.name = obj.detail.session['follower-latest'].name
    }

    // Latest - Raid
    if (state.latest.raid) {
        state.latest.raid.name = obj.detail.session['raid-latest'].name
    }

    // Follower Count
    if (state.stats.followers) {
        state.stats.followers.count = obj.detail.session['follower-total'].count
    }
})

function getViewerStat() {
    fetch(`https://decapi.me/twitch/viewercount/${channelName}`)
        .then((response) => response.text())
        .then((data) => {
            if (!data.includes('offline')) {
                state.stats.viewers.count = data
            } else {
                state.stats.viewers.count = 0
            }
        })
}

function updateFields() {
    // Stats
    // Update to new text
    stats_container.innerHTML = `<span class="text">${state.stats[stats_keys[stats_pos]].count}<i class="fa-solid fa-${
        state.stats[stats_keys[stats_pos]].icon
    }"></i></span>`

    stats_pos++
    if (stats_pos == stats_keys.length) {
        stats_pos = 0
    }

    // Latest
    // Variables
    let latestObject = state.latest[latest_keys[latest_pos]]
    let latestType = latest_keys[latest_pos]

    // Check if empty
    if (latestObject.name != '') {
        // Genereate html
        let text = ''
        text += "<span class='text'>"
        // Check type
        switch (latestType) {
            case 'follower':
                text += `<i class='fa-solid fa-${latestObject.icon}'></i> ${latestObject.name}`
                break
            case 'subscriber':
                text += `<i class='fa-solid fa-${latestObject.icon}'></i> ${latestObject.name} <span class='accent'>${
                    latestObject.amount
                } ${latestObject.amount > 1 ? 'Months' : 'Month'}</span>`
                break
            case 'donation':
                text += `<i class='fa-solid fa-${latestObject.icon}'></i> ${
                    latestObject.name
                } <span class='accent'>${currency}${latestObject.amount.toFixed(2)}</span>`
                break
            case 'cheer':
                text += `<i class='fa-solid fa-${latestObject.icon}'></i> ${latestObject.name} <span class='accent'>${
                    latestObject.amount
                } ${latestObject.amount > 1 ? 'Bits' : 'Bit'}</span>`
                break
            case 'raid':
                text += `<i class='fa-solid fa-${latestObject.icon}'></i> ${latestObject.name} <span class='accent'>${
                    latestObject.amount
                } ${latestObject.amount > 1 ? 'Viewers' : 'Viewer'}</span>`
                break
        }

        text += '</span>'

        // Update
        latest_container.innerHTML = text
    }

    latest_pos++
    if (latest_pos == latest_keys.length) {
        latest_pos = 0
    }

    const today = new Date()
    let h = today.getHours()
    let m = today.getMinutes()
    h = checkTime(h)
    m = checkTime(m)
    clock.textContent = `${h}:${m}`
}

function checkTime(i) {
    if (i < 10) {
        i = '0' + i
    } // add zero in front of numbers < 10
    return i
}
