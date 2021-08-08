const express = require('express');
const path = require('path');
const { Room, Chat, User, sequelize } = require('./models');
const indexRouter = require('./routes');
const socket = require('./socket');
console.log(indexRouter);

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use('/', indexRouter);

//  force옵션이 true이면 sync호출때마다 테이블 재생성.
sequelize.sync({ force: true })
  .then(() => {
    console.log("DB연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });


//  맨처음에 서버 연결하면 몇번포트에 서버 연결되어있는지
const server = app.listen(app.get('port'), function() {
  console.log(app.get('port'), "번 포트에서 대기중");
});

socket(server, app);
