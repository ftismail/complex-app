import Search from './models/search'
import Chat from './models/chat'
if(document.querySelector('#chat-wrapper')){new Chat()}
if (document.querySelector('.header-search-icon')) {new Search()}
