(function() {
    let anchors = document.querySelectorAll('a');
    console.log(anchors);
    anchors.forEach((node) => { 
        let href = node.getAttribute('href');
        if(!href || href.indexOf('#') > -1 || href.startsWith(window.location.origin) || !/(\w+:\/\/)|(\W\w+%3A%2F%2F)/.test(href)) return;
        
        if (node.getAttribute('target') === '_blank') node.dataset.targetFlag = 'true'
        node.setAttribute('target', '_blank'); 
        
    });  
    
    window.addEventListener('click', e => {
        if(e.metaKey) {
            if(!e.target.dataset.targetFlag) window.location = e.target.getAttribute('href');
            e.preventDefault();
        }
    });
})();
