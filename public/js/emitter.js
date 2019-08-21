
 (function bindSessionToIO(){
    const socket = io(`/`);
        // socket.emit('sessionSocket');\
        window.addEventListener('DOMContentLoaded', (event) => {
            const session = document.getElementById('sess-uid');
            socket.on('connect', function() {
                socket.emit('join', session.innerText)
              });

            socket.on('updateClients', function(data) {
                console.log(Object.keys(data).length)
                document.getElementById('clients-count').innerHTML = Object.keys(data).length;
            })
        });



    })()
