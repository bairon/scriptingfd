var s = document.createElement('script');
s.src = chrome.runtime.getURL('extension4.js');
s.onload = function() {
 this.remove();
};
(document.head || document.documentElement).appendChild(s);