(function() {
    const aTags = document.querySelectorAll("a");
    aTags.forEach(a => a.addEventListener('click', e => {   
        e.preventDefault();    
        let node = e.target;
        let href = node.getAttribute('href');
        
        if(!href) return;
        
        // if the user is holding the cmd key or the href is a full path, load in the same window
        if(e.metaKey || !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)) {
            if( true /*check user setting for cmd + clicks*/) window.location = href;
        } else {
            // try {
            // console.log(chrome.tabs.create({ active: false }))
            // } catch(err) { console.log(err) }
            // debugger;
            // chrome.tabs.create({ active: false });
            chrome.runtime.connect().postMessage({ "url" : href });
        }

    }));
})();
