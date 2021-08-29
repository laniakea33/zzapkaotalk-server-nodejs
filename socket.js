const SocketIO = require('socket.io');
const { Room, Chat, User, sequelize } = require('./models');

module.exports = (server, app) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set("io", io);

    const room = io.of('/room');
    const chat = io.of('/chat');

    room.on('connection', function(socket) {
        console.log('room 유저 연결');

        //  채팅방 생성
        socket.on('create', async function(msg) {
            console.log("ROOM CREATE 메시지 수신");
            msg['created_date_time'] = Date.now();
            console.log(msg);

            const roomObj = await Room.create(msg, (reason) => {
                console.error(reason);
            });

            room.emit("room", roomObj);
            console.log(roomObj);
            
            const roomNo = roomObj.id;
            console.log("roomNo : " + roomNo);
            socket.join(roomNo);
        });

        socket.on('disconnect', function(socket) {
            console.log('room 유저 연결 해제');
        });
    });

    chat.on('connection', async function(socket) {
        console.log('chat 유저 연결');
        console.log(socket.handshake.query);

        const roomNo = socket.handshake.query['room_no'];
        const user = socket.handshake.query['user'];
        console.log(socket.handshake.query['room_no']);
        console.log(socket.handshake.query['user']);

        const userObj = await User.findOne({ where: {id: user}});
        console.log(userObj);

        socket.join(roomNo);

        const chatObj = await Chat.create({
            type: 'system',
            message: `${userObj.display_name}님이 입장하셨습니다.`,
            date_time: Date.now(),
            room_no: roomNo,
        });
        chat.to(roomNo).emit('chat', chatObj);

        //  메시지 수신
        socket.on('chat', async function(msg){
            console.log("chat 메시지 수신");
            msg['date_time'] = Date.now();
            console.log(msg);
            
            const userObj = msg['user'];
            console.log("type of userObj : " + typeof userObj);
            var message = '';
            if (msg['type'] == 'text') {
                message = msg['message'];
            } else {
                message = '사진';
            }

            const t1 = await sequelize.transaction();
            try {
                const chatObj = await Chat.create(msg, { transaction: t1 });
                chatObj.setDataValue('User', userObj);
                const roomUpdateObj = {
                    room_no: roomNo,
                    last_chat: message,
                }
                await Room.update(roomUpdateObj, { where: { id: roomNo }, transaction: t1 });
                await t1.commit();

                chat.to(roomNo).emit('chat', chatObj);

                console.log("chatObj : ", chatObj);
                console.log("roomUpdateObj : ", roomUpdateObj);
                room.emit('update', roomUpdateObj);
            } catch(error) {
                await t1.rollback();
                console.error(error);
            }
        });

        //  유저 연결 해제
        socket.on('disconnect', async function() {
            console.log('chat 유저 연결 해제');
            socket.leave(roomNo);
            const currentRoom = chat.adapter.rooms.get(roomNo);
            const userCount = currentRoom ? currentRoom.size : 0;
            console.log(`${userCount}명 남음`);

            const chatObj = await Chat.create({
                type: 'system',
                message: `${userObj.display_name}님이 퇴장하셨습니다.`,
                date_time: Date.now(),
                room_no: roomNo,
            });
            chat.to(roomNo).emit('chat', chatObj);
            // if (userCount == 0) {
            // const msg = {
            //     room_no: roomNo,
            // };
            // console.log(msg);
            // await Room.destroy({ where: {id: roomNo}});
            // room.emit("remove", msg);
            // } else {
            // const chatObj = await Chat.create({
            //     name: 'system',
            //     message: `${name}님이 퇴장하셨습니다.`,
            //     date_time: Date.now(),
            //     room_no: roomNo,
            // });
            // chat.to(roomNo).emit('chat', chatObj);
            // }
        });
    });
}