(function() {
    let anchors = document.querySelectorAll('a');
    anchors.forEach((node) => { 
        node.setAttribute('target', '_blank'); 
    });  
})();
