
const socket = io('/');

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    var startBTN = document.getElementsByClassName('start-connection')[0];
    const data = {
        _id: 'rfwdwqrfqweawf6y5665YE'
    }
    startBTN.addEventListener('click', function(){
        socket.emit('start', data);
    })
});