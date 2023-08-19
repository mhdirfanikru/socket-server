const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
  },
});

try {
    
  let users = [];
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId == userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    console.log(userId,"user")
    console.log(users,"users")
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    console.log("socket connected")
    //when connect
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      console.log("first")
      console.log(userId,socket.id,"on")
      try {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
      } catch (error) {
        console.log("something went wrong");
      }
    });
  
    //send and get messages
    socket.on("sendMessage", ({ senderId, recieverId, text }) => {
      try {
      
        const user = getUser(recieverId);
        console.log(user,"aaaa")
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
        
      } catch (error) {
        // res.json("something went wrong")
        console.log("something went wrong",error);
      }
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      try {
        removeUser(socket.id);
        io.emit("getUsers", users);
      } catch (error) {
        console.log("something went wrong");
        // res.json("something went wrong")
      }
    });
  });
  
  } catch (error) {
    console.log("something went wrong");
    // res.json("something went wrong")
  }