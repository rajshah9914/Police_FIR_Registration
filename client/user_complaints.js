var socket = io();
// console.log(document.getElementById('userid'));
var id = document.getElementById('userid').innerHTML;
socket.emit('post1',{id:id});

socket.on('post2',(post) =>{
    console.log(post.rows);
    for(i=0;i<post.rows.length;i++)
    {
        var div=document.createElement('div');
        var div1=document.createElement('div');
        var div2=document.createElement('div');
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        p1.appendChild(document.createTextNode(post.rows[i].c_info));
        p2.appendChild(document.createTextNode(post.rows[i].c_status));
        div.className='outer';
        div1.className='inner_left';
        div2.className='inner_right';
        const main_div = document.querySelector('.main');
        // console.log(main_div);
        p1.setAttribute("style","text-align:center");
        p2.setAttribute("style","text-align:center");
        div.setAttribute("style","height:30px;width:100%");
        div1.setAttribute("style","width:48%;float:left;border:1px solid black");
        div2.setAttribute("style","width:50%;float:right;border:1px solid black");
        div1.appendChild(p1);
        div2.appendChild(p2);
        div.appendChild(div1);
        div.appendChild(div2);
        main_div.appendChild(div);
    }
});