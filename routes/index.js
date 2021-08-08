const express = require('express');
const { Room, Chat, User } = require('../models');

const router = express.Router();

router.post("/user", async (req, res, next) => {
  console.log("post /user");

  const user = {
    device_id: req.body.device_id,
    display_name: req.body.device_id,
  }
  
  try {
    const userObj = await User.findOrCreate({
      where: {device_id: req.body.device_id},
      defaults: user,
    });

    console.log(userObj[0]);

    res.json(userObj[0]);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.put("/user", async (req, res, next) => {
  console.log("put /user");
  try {
    await User.update({ 
      display_name: req.body.display_name,
      profile_image_url: req.body.profile_image_url,
    }, {
      where: { id: req.body.id }
    });
    const userObj = await User.findOne({ where: {id: req.body.id}});

    console.log(userObj);
    res.json(userObj);
  } catch(error) {
    console.error(error);
    next(error);
  }
});

router.get("/rooms", async (req, res, next) => {
    console.log("get /room");
    try {
      const rooms = await Room.findAll({});
      res.json(rooms);
    } catch(error) {
      console.error(error);
      next(error);
    }
  });

router.get("/chats", async (req, res, next) => {
    const roomNo = req.query['room_no'];
    console.log("get /chats ? room_no=" + roomNo);
    
    try {
      const chats = await Chat.findAll({ where: { room_no: roomNo }, include: { model: User } });
      console.log("chats");
      console.log(chats);
      res.json(chats);
    } catch(error) {
      console.error(error);
      next(error);
    }
  });

module.exports = router;