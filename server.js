const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const hbs = require('hbs');
const socketio = require('socket.io');
const http = require('http');

var app = express();
var server = http.createServer(app);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.set('view engine','hbs');
app.use(express.static(__dirname + '/client'));


function connect(){
    var connection = mysql.createConnection({
        host:'localhost',
        port:3306,
        user:'root',
        password:'Enter your SQL password..',
        database:'Enter database name..',
        insecureAuth:true
    })
    connection.connect
    return connection;
}

// try{
//     var connection = connect();
//     // console.log(connection);
//     connection.query('select * from initial',(err,rows,fields) => {
//         connection.end;
//         if(!err)
//         {
//             console.log(rows);
//             console.log(fields);
//         }
//         else
//         {
//             console.log(err);
//         }
//      })
// }
// catch(e){
//     console.log(e);
// }

//for user signup

app.post('/check',(req,res) =>{
    // console.log(req.body.username);
    var connection = connect();
    connection.query('insert into user values("'+req.body.username+'","'+req.body.userid+'","'+req.body.password+'","'+req.body.mobile+'","'+req.body.email+'","'+req.body.address+'");',(err,res1) =>{
        connection.end;
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(res1);
            res.render('index.hbs',{
                text:'continue to Login'
            });
        }
    })

})

//for user login

app.post('/login',(req,res) =>{
    var connection = connect();
    connection.query('select password from user where userid = "'+req.body.userid+'" and username = "'+req.body.username+'" ',(err,rows,fields) => {
        connection.end;
        if(err)
        {
            console.log(err);
        }
        else
        {
            // console.log(rows);
            if(rows.length==0)
            {
                res.render('user.hbs',{text:'enter correct userid'})
            }
            else if(rows[0].password === req.body.password)
            {
                res.render('user_complaints.hbs',{
                    id:req.body.userid
                });
            }
            else
            {
                res.render('user.hbs',{text:'enter correct password'});
            }
        }
    })
});

//for registring complaints

app.post('/complaint',(req,res) => {
    var connection = connect();
    connection.query('select ps_id from police_officer where po_id = "'+req.body.poid+'"',(err,rows,fields) =>{
        connection.end;
        if(rows.length===0)
        {
            res.render('complaints.hbs',{
                text:'police_officerid is wrong'
            })
        }
        else if(req.body.psid === rows[0].ps_id)
        {
        connection.query('insert into cases values("'+ req.body.userid+'","'+ req.body.psid+'","'+ req.body.info+'","pending","'+ req.body.poid+'")',(err,rows,fields) => {
            connection.end;
            if(err)
            {
                console.log(err);
            }
            else
            {
                res.render('complaints.hbs',{
                    text:'complaint is registered'
                });
            }
        })
        }
        else
        {
            res.render('complaints.hbs',{
                text:'police officer does not belong to this police station'
            })
        }

    })
});

//for user cases details

var io = socketio(server);
io.on('connection',(socket) => {
    console.log("connected");
    socket.on('post1',function(msg1) {
        // Message.find({}).then((posts) => {
        //     socket.emit('post',{
        //         posts
        //     })
        // })
        var connection = connect();
        connection.query('select user.userid,cases.c_info,cases.c_status from user,cases where user.userid = cases.c_userid and user.userid = "'+msg1.id+'"',(err,rows,fields) => {
            if(err)
            {
                console.log(err);
            }
            else{
                socket.emit('post2',{
                    rows
                })
            }
        });
    });
    socket.on('post3',function(msg){
        var connection =connect();
        connection.query('select cases.c_userid,cases.c_info,cases.c_status,police_officer.po_name from police_officer,cases,police_station where police_station.ps_id = cases.c_psid and cases.c_poid = police_officer.po_id and police_station.ps_id = "'+msg.id+'"',(err,rows,fields) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                socket.emit('post4',{
                    rows
                })
            }
        })
    });
    socket.on('post5',function(msg){
        var connection =connect();
        connection.query('select * from solved',(err,rows,fields) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                socket.emit('post6',{
                    rows
                })
            }
        })
    })
})

//for police station login

app.post('/pslogin',(req,res) => {
    var connection = connect();
    connection.query('select ps_passcode from police_station where ps_id = "'+req.body.ps_id+'"',(err,rows,fields) => {
        if(err)
        {
            console.log(err);
        }
        else if(rows.length===0)
        {
            res.render('police.hbs',{
                text:'enter correct policestaion id'
            })
        }
        else if(rows[0].ps_passcode === req.body.ps_passcode)
        {
            res.render('policestation_details.hbs',{
                id:req.body.ps_id
            })
        }
        else
        {
            res.render('police.hbs',{
                text:'enter correct passcode'
            })
        }
    })
})


//for police station cases details


//update

app.post('/update',(req,res) =>{
    var connection  = connect();
    connection.query('select ps_passcode from police_station where police_station.ps_id="'+req.body.ps_id+'"',(err,rows,fields) => {
        connection.end;
        // console.log(rows);
        if(rows[0].ps_passcode === req.body.ps_passcode)
        {
            // connection.query('update cases set cases.c_status = "solved" where cases.c_poid = "'+req.body.po_id+'"',(err,rows,fields) => {
            //     connection.end;
            //     connection.query('update solved set cases_solved = cases_solved+1 where s_poid = "'+req.body.po_id+'"')
            //     res.render('update.hbs');
            // })
            connection.query('update cases set cases.c_status = "solved" where cases.c_poid = "'+req.body.po_id+'" and c_status ="Pending"',(err,rows,fields) => {
                connection.end;
                if(rows.changedRows!=0)
                connection.query('update solved set cases_solved = cases_solved+1 where s_poid = "'+req.body.po_id+'"',(err,rows,fields)=>{});
                res.render('update.hbs');
            })
        }
        else{
            res.render('update1.hbs',{
                text:'enter correct passcode'
            })
        }
    })
});

server.listen(3000,(err,res) =>{
    if(!err)
    {
        console.log('connected to 3000');
    }
    else
    {
        console.log(err);
    }
})
