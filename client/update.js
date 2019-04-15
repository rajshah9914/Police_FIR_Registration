var socket = io();

// var id = document.getElementById('psid').innerHTML;
socket.emit('post5',{})

socket.on('post6',(post) => {
    for(var i=0;i<post.rows.length;i++)
    {
        var main1 = document.getElementById('main1');
        // console.log(document.getElementById('main'));
        var td1 = document.createElement('td');
        var tr1 = document.createElement('tr');
        var td2 = document.createElement('td');
        td1.appendChild(document.createTextNode(post.rows[i].s_poid));
        td2.appendChild(document.createTextNode(post.rows[i].cases_solved));
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        main1.appendChild(tr1);
    }
})
