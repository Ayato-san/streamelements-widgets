const tchat=document.querySelector("#tchat");function addMessage(e,t){const s=e.displayColor||`#${md5(e.displayName).substr(26)}`,a=e.badges.reduce(((e,t)=>e+`<img src="${t.url}" class="badge"/>`),""),n=document.createElement("div");n.id=`message-${e.msgId}`,n.dataset.sender=e.userId,n.classList.add("message"),n.style=`--color:${s}`,n.insertAdjacentHTML("beforeend",`<div class="meta">\n            <div class="badges">${a}</div>\n            <div class="name">${e.displayName}</div>\n        </div>\n        <div class="content">${t}</div>`),tchat.insertAdjacentElement("beforeend",n);setTimeout((()=>{n.remove()}),6e5);const d=document.querySelectorAll(".message"),i=d.length;i>20&&Array.from(d).slice(0,i-20).forEach((e=>e.remove()))}window.addEventListener("onEventReceived",(function(e){if("widget-button"!==e.detail.event.listener)if("delete-message"!==e.detail.listener)if("delete-messages"!==e.detail.listener)"message"===e.detail.listener&&addMessage(e.detail.event.data,e.detail.event.renderedText);else{const t=e.detail.event.userId;document.querySelectorAll(`.message[data-sender=${t}]`).forEach((e=>{e.remove()}))}else{const t=e.detail.event.msgId;document.querySelectorAll(`#message-${t}`).forEach((e=>{e.remove()}))}else if("testMessage"===e.detail.event.field){let e=new CustomEvent("onEventReceived",{detail:{listener:"message",event:{service:"twitch",data:{time:Date.now(),tags:{"badge-info":"",badges:"moderator/1,partner/1",color:"#5B99FF","display-name":"StreamElements",emotes:"25:46-50",flags:"",id:"43285909-412c-4eee-b80d-89f72ba53142",mod:"1","room-id":"85827806",subscriber:"0","tmi-sent-ts":"1579444549265",turbo:"0","user-id":"100135110","user-type":"mod"},nick:"Ayat0_san_",userId:"100135110",displayName:"Ayat0_san_",displayColor:"#5B99FF",badges:[{type:"moderator",version:"1",url:"https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",description:"Moderator"},{type:"partner",version:"1",url:"https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",description:"Verified"}],channel:"Ayat0_san_",text:"Howdy! My name is Bill and I am here to serve Kappa",isAction:!1,emotes:[{type:"twitch",name:"Kappa",id:"25",gif:!1,urls:{1:"https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",2:"https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",4:"https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"},start:46,end:50}],msgId:"43285909-412c-4eee-b80d-89f72ba53142"},renderedText:'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'}}});window.dispatchEvent(e)}}));