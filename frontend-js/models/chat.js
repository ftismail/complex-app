import DOMPurify from 'dompurify'
export default class Chat{
    constructor(){
        this.openedYet = false
        this.chatWrapper = document.getElementById('chat-wrapper')
        this.openIcon = document.querySelector('.header-chat-icon')
        this.injectHtml()
        this.chatLog = document.querySelector('.chat-log')
        this.chatField = document.querySelector('#chatField')
        this.chatForm = document.querySelector('#chatForm')
        this.closeIcon = document.querySelector('.chat-title-bar-close')
        this.events()
        
    }
    /////events///
    events(){
        this.chatForm.addEventListener('submit',(e)=>{
            e.preventDefault()
            this.sendMessageToServer()
        })
        this.openIcon.addEventListener('click',()=>{this.showChat()})
        this.closeIcon.addEventListener('click',()=>{this.closeChat()})
    }
    ////method///
    sendMessageToServer(){
        this.socket.emit('chatMessageFromBrowser',{message:this.chatField.value})
        this.chatLog.insertAdjacentHTML('beforeend',DOMPurify.sanitize(`
        <div class="chat-self">
        <div class="chat-message">
        <div class="chat-message-inner">
            ${this.chatField.value}
        </div>
        </div>
        <img class="chat-avatar avatar-tiny" src="${this.avatar}">
        </div>
    `))
        this.chatLog.scrollTop = this.chatLog.scrollHeight
        this.chatField.value=''
        this.chatField.focus()
    }
    showChat(){
        if (!this.openedYet) {
            this.openConnection()
        }
        this.openedYet = true
        this.chatWrapper.classList.add('chat--visible')
    }
    
    closeChat(){
        this.chatWrapper.classList.remove('chat--visible')
    }
    openConnection(){
        this.socket = io()
        this.socket.on('welcom',(data)=>{
            this.username = data.username
            this.avatar = data.avatar
        })
        this.socket.on('chatMessageFromServer',(data)=>{
            this.displatMessageFromServer(data)
        })
        this.chatField.focus()
    }
    displatMessageFromServer(data){
        this.chatLog.insertAdjacentHTML('beforeend',DOMPurify.sanitize(`
        <div class="chat-other">
        <a href="/profile/${data.username}"><img class="avatar-tiny" src="${data.avatar}"></a>
        <div class="chat-message"><div class="chat-message-inner">
          <a href="/profile/${data.username}"><strong>${data.username}</strong></a>
          ${data.message}
        </div></div>
      </div>
        `))
        this.chatLog.scrollTop = this.chatLog.scrollHeight
    }
    injectHtml(){
        this.chatWrapper.innerHTML= `
        <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
        <div id ="chat" class="chat-log"></div>
        <form id="chatForm" class="chat-form border-top">
      <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
    </form>
        `
    }
}