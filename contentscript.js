(function() {
    const anchors = document.querySelectorAll("a");
    anchors.forEach(a => a.addEventListener('click', e => {   
        e.preventDefault();    
        let node = e.target;
        let href = node.getAttribute('href');
        
        // check for null href or page anchors (since a # could just be a placeholder)
        if(!href || href.startsWith('#')) return;
        
        // if the user is holding the cmd key or the href is a full path, load in the same window
        if(e.metaKey || !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)) {
            if( true /*check user setting for cmd + clicks*/) window.location = href;
        } else {
            chrome.runtime.connect().postMessage({ "url" : href });
        }

    }));
})();
