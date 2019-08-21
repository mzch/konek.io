
const socket = io('/');

function domReady(exec){
    if(document.readyState = 'loading') exec();


    else if (document.addEventListener)
        document.addEventListener('DOMContentLoaded', exec);
        
    else document.attachEvent('onreadystatechange', function() {
        if(document.readyState == 'complete') exec();
    });
}

domReady(function() {

});