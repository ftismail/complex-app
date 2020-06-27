import axios from 'axios'
import DOMPurify from 'dompurify'
export default class Search{
    //select DOM element and keep traking any usefull data
    constructor(){
        this.injuctHtml()
        this.headerSearchIcon = document.querySelector('.header-search-icon')
        this.overlay = document.querySelector('.search-overlay')
        this.closeIcon = document.querySelector('.close-live-search')
        this.searchInput = document.querySelector('#live-search-field')
        this.resultatsArea = document.querySelector('.live-search-results')
        this.loaderIcon = document.querySelector('.circle-loader')
        this.typeWaitingTimer
        this.previousValue = ''
        this.events() 
    }
    //events
    events(){
        this.searchInput.addEventListener('keyup',()=>{this.keyPressHendler()})
        this.headerSearchIcon.addEventListener('click',(e)=>{
            e.preventDefault()
            this.openivelay()
        })
        this.closeIcon.addEventListener('click',(e)=>{
            e.preventDefault()
            this.closeOverlay()
        })
    }
    //methodes
    keyPressHendler(){
      let value = this.searchInput.value
      if (value == '') {
        clearTimeout(this.typeWaitingTimer)
        this.removeLoader()
        this.hideResultatsArea()
      }
      if (value != "" && value != this.previousValue ) {
        clearTimeout(this.typeWaitingTimer)
        this.showLoader()
        this.hideResultatsArea()
        this.typeWaitingTimer = setTimeout( ()=>this.sendRequest(),750)
      }
      this.previousValue = value
    }
    sendRequest(){
      axios.post('/search',{searchTerm:this.searchInput.value})
      .then(response=>{
        console.log(response.data)
        this.renderResultatsHtml(response.data)
      })
      .catch(()=>{
        alert('th request failed')
      })
    }
    renderResultatsHtml(posts){
      if (posts.length) {
        this.resultatsArea.innerHTML = DOMPurify.sanitize(`<div class="list-group shadow-sm">
        <div class="list-group-item active"><strong>Search Results</strong> (${posts.length} items found)</div>
        ${posts.map(element =>{
          let elementDate = new Date(element.createDate)
          return `<a href="/post/${element._id}" class="list-group-item list-group-item-action">
          <img class="avatar-tiny" src="${element.author.avatar}"> <strong>${element.title} #1</strong>
          <span class="text-muted small">by ${element.author.username} on ${elementDate.getDate()} / ${elementDate.getMonth() + 1} / ${elementDate.getFullYear()} </span>
        </a>`
        }).join('')}
      </div>`)
      } else {
        this.resultatsArea.innerHTML = `<p>there is no resultast`
      }
      this.removeLoader()
      this.showResultasArea()
    }
    showResultasArea(){
      this.resultatsArea.classList.add('live-search-results--visible')
    }
    hideResultatsArea(){
      this.resultatsArea.classList.remove('live-search-results--visible')
    }
    showLoader(){
      this.loaderIcon.classList.add('circle-loader--visible')
    }
    removeLoader(){
      this.loaderIcon.classList.remove('circle-loader--visible')
    }
    openivelay(){
        this.overlay.classList.add('search-overlay--visible')
        setTimeout(()=>this.searchInput.focus(),50)
    }
    closeOverlay(){
        this.overlay.classList.remove('search-overlay--visible')
    }
    
    injuctHtml(){
        document.body.insertAdjacentHTML('beforeEnd',`<div class="search-overlay ">
        <div class="search-overlay-top shadow-sm">
          <div class="container container--narrow">
            <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
            <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
            <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
          </div>
        </div>
    
        <div class="search-overlay-bottom">
          <div class="container container--narrow py-3">
            <div class="circle-loader"></div>
            <div class="live-search-results ">
              
            </div>
          </div>
        </div>
      </div>`)
    }
}
console.log('kls')