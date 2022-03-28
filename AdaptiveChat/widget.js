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
        console.log("%c%s(%s) by %s", "font-weigth:900;font-size:400%", FieldData.widgetName, FieldData.widgetVersion, FieldData.widgetAuthor)
    	console.log("%cField Data", "font-weigth:bold;font-size:200%")
   		console.table(FieldData)
    }
    chatbox.classList.add(FieldData.appearAnimation)
    chatbox.classList.add(FieldData.chatDirection)
    chatbox.classList.add(FieldData.cornerType)
    FieldData.displayBorder ? chatbox.classList.add('bordered') : null

    if (devMod) sendTestMessage(20)
})