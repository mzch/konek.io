
 function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

 (function bindSessionToIO(){
    const socket = io('/');
        // socket.emit('sessionSocket');\
        window.addEventListener('DOMContentLoaded', (event) => {
            const session = document.getElementById('sess-uid');
            const textArea = document.getElementById('text-area')
            console.log(session.innerText)
            const file = document.getElementById('file-input')
            const dataForm = document.getElementsByClassName('connection-files')[0];
            const filesContainer = document.getElementsByClassName('files-container')[0]
            socket.on('connect', function() {
                console.log(session.innerText)
                socket.emit('join', session.innerText)
              });

            socket.on('updateClients', function(data) {
                console.log(Object.keys(data).length)
                document.getElementById('clients-count').innerHTML = Object.keys(data).length;
            })

            socket.on('updateText', function(newText){
                console.log(newText)
                    const row = document.createElement('div');
                    row.classList.add('row', 'message');
                    const column = document.createElement('div');
                    column.classList.add('one-half', 'columns', 'messages');
                    const h3 = document.createElement('p');
               
                    h3.innerText = newText.data.text
                    h3.setAttribute('id', newText.data._id.substring(1, 10))
   
                    const span = document.createElement('span');
                    span.classList.add('clip')
                    span.setAttribute('data-clipboard-target', `#${newText.data._id.substring(1, 10)}`)
                                               
                    row.appendChild(column);
                    column.appendChild(h3)
                    column.appendChild(span)
                    const fa = document.createElement('i');
                    fa.classList.add('fa', 'fa-copy');
                    fa.setAttribute('aria-hidden', 'true')
                    span.appendChild(fa)
                    filesContainer.prepend(row)
            })

            socket.on('updateFiles', function(file){
                const row = document.createElement('div');
                row.classList.add('row');
                const column = document.createElement('div');
                column.classList.add('one-half', 'columns');
                const h3 = document.createElement('h3');
                h3.innerText = file.data.fileName
                const span = document.createElement('span');
                span.innerText = formatBytes(file.data.size);
                const a = document.createElement('a');
                a.classList.add('button', 'download')
                a.innerText = 'Download'
                // 'data:image/jpeg;base64,/9j/4AAQSkZ...'
                a.setAttribute('href', `data:${file.data.contentType};base64,${file.data.image}`)
                a.setAttribute('download', file.data.fileName)
                row.appendChild(column);
                column.appendChild(h3)
                column.appendChild(span)
                column.appendChild(a)
                filesContainer.prepend(row)
                
            })

            file.onchange = function(e){
                var files = this.files;
                console.log(files[0])
                var name = files[0].name;
                textArea.readOnly = true;
                textArea.value = name;
             };

             if(dataForm){
                dataForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    if(file.files.length <= 0) {
                        return fetch('/share/message', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                text: e.target.text.value
                            })
                        })
                        .then((res) => {
                            if(!res.ok){
                                throw new Error('Unable to process network request this time.');
                            }
            
                            return res.json();
                        }).then((res) => {
                            socket.emit('newText', {session: session.innerText, data: res});
                            const row = document.createElement('div');
                            row.classList.add('row');
                            const column = document.createElement('div');
                            column.classList.add('one-half', 'columns', 'messages');
                            const h3 = document.createElement('p');
                            h3.innerText = res.data.text
                            h3.setAttribute('id', res.data._id.substring(1, 10))
                            const span = document.createElement('span');
                            span.classList.add('clip')
                            span.setAttribute('data-clipboard-target', `#${res.data._id.substring(1, 10)}`)
                            row.appendChild(column);
                            column.appendChild(h3)
                            column.appendChild(span)
                            const i = document.createElement('i');
                            i.classList.add('fa', 'fa-copy');
                            i.setAttribute('aria-hidden', 'true')
                            span.appendChild(i)
                            filesContainer.prepend(row)
                            dataForm.reset();
                        }).catch((err) => alert(err))
                    }

                    const formData = new FormData();
    
                    formData.append('sessionFile', file.files[0]);
        
                    fetch('/share/file', {
                        method: 'POST',
                        body: formData
                    })
                    .then((res) => {
                        if(!res.ok){
                            throw new Error('Unable to process network request this time.');
                        }
        
                        return res.json();
                    }).then((res) => {
                        socket.emit('newFile', {session: session.innerText, data: res});
                        console.log(res)
                        const row = document.createElement('div');
                        row.classList.add('row');
                        const column = document.createElement('div');
                        column.classList.add('one-half', 'columns');
                        const h3 = document.createElement('h3');
                        h3.innerText = res.data.fileName
                        const span = document.createElement('span');
                        span.innerText = formatBytes(res.data.size);
                        const a = document.createElement('a');
                        a.classList.add('button', 'download')
                        a.innerText = 'Download'
                        // 'data:image/jpeg;base64,/9j/4AAQSkZ...'
                        a.setAttribute('href', `data:${res.data.contentType};base64,${res.data.image}`)
                        a.setAttribute('download', res.data.fileName)
                        row.appendChild(column);
                        column.appendChild(h3)
                        column.appendChild(span)
                        column.appendChild(a)
                        filesContainer.prepend(row)
                        textArea.readOnly = false;
                        dataForm.reset();
                       
                    }).catch((err) => alert(err))
                })
            
            }
    
        
        });


      
    })()
