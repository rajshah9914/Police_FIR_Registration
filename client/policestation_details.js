var socket = io();

var id = document.getElementById('psid').innerHTML;
socket.emit('post3',{id:id})

socket.on('post4',(post) => {
    for(var i=0;i<post.rows.length;i++)
    {
        var main1 = document.getElementById('main1');
        // console.log(document.getElementById('main'));
        var td1 = document.createElement('td');
        var tr1 = document.createElement('tr');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        td1.appendChild(document.createTextNode(post.rows[i].c_userid));
        td2.appendChild(document.createTextNode(post.rows[i].c_info));
        td3.appendChild(document.createTextNode(post.rows[i].c_status));
        td4.appendChild(document.createTextNode(post.rows[i].po_name));
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);
        tr1.appendChild(td4);
        main1.appendChild(tr1);
    }
})
