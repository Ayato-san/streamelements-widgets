const tchat = document.querySelector('#tchat')

let fieldData = {}
window.addEventListener('onWidgetLoad', function (obj) {
    fieldData = obj.detail.fieldData
    console.log(fieldData)
})
window.addEventListener('onEventReceived', function (obj) {
    const data = obj.detail.event
    if (data.listener === 'widget-button') {
        if (data.field === 'someButton' && data.value === 'Thanks') {
            console.log('button click')
        }
    }
})
