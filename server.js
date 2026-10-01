console.log("Server.js:- Starting app");
var express = require("express"),
  bodyParser = require("body-parser"),
  path = require("path"),
  https = require("https"),
  http = require("http"),
  fs = require("fs");

var app = express();
var cors = require("cors");

var helmet = require("helmet");
app.use(helmet());
// app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"],styleSrc:["'self'"] }} ))
var api = require("./routes/router");
var config = require("./config/config");
var jwt = require("jsonwebtoken");
var db = require("./helper/database");
var logger = require("./middlewares/logger");
var moment = require("moment-timezone");
var webRoomName = (room) => `web${room}`;
module.exports = app;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Object.defineProperty(global, "__stack", {
  get: function () {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  },
});

Object.defineProperty(global, "__line", {
  get: function () {
    return __stack[1].getLineNumber();
  },
});

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,Authorization,X-AUTH-TOKEN,Authorization_Token,uuid"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

var key = fs.readFileSync("./config/server/server.key", "utf8");
var cert = fs.readFileSync("./config/server/server.crt", "utf8");
var options = {
  key: key,
  cert: cert,
  cors: { origin: "*" },
};

app.use("/*", function (req, res, next) {
  var noAuthPaths = [
    "/api/pcp/doctorLogin",
    "/api/pcp/preDoctorLogin",
    "/api/pcp/getDocFromAlias",
    "/api/pcp/patientexists",
    "/connect/providersettings",
    "/api/pcp/saveUserMeeting",
    "/connect/validClientUrl",
    "/pcp/verification_code",
    "/api/pcp/patientexistsemailphone",
    "/api/pcp/getSessionFromInviteId",
    "/api/pcp/checkConnectCallBycallId",
    "/api/pcp/doctorAppConfig",
    "/api/pcp/getUserEmails",
    "/plivo/notify-join",
    "/api/pcp/forgotsendOTP",
    "/api/pcp/setPassword",
    "/connect/getPatientDetails",
    "/api/pcp/getLocationByRoomName",
    "/healthcheck",
    "/api/payumoney/requestPayment",
    "/api/payumoney/saveResponse",
    "/api/pcp/updatetcalldisconnectreason",
  ];
  var noAuthurls = [
    "/connect/providersettings/",
    "/patient/checkin/form/",
    "/pcp/verification_code/",
    "/connect/verifyThirdPartyDoc/",
    "/connect/connectProvider/",
    "/api/pcp/logoCssSettings/",
  ];
  var check_validate_token = true;
  for (var i = 0; i < noAuthPaths.length; i++) {
    if (noAuthPaths[i] == req.baseUrl) {
      check_validate_token = false;
      break;
    }
  }

  if (check_validate_token) {
    for (var j = 0; j < noAuthurls.length; j++) {
      if (req.baseUrl.indexOf(noAuthurls[j]) > -1) {
        check_validate_token = false;
        break;
      }
    }
  }
  if (check_validate_token) {
    var Badrequestjson = {
      code: 400,
      message: "Bad Request - Authentication Information was not supplied",
      data: {},
    };
    var unauthorizedJson = { code: 401, message: "Unauthorised", data: {} };

    if (req.headers["x-auth-token"]) {
      var token = req.headers["x-auth-token"];
      try {
        // console.log(token, config.jwt.jwtApiSecret);
        // var decoded = jwt.verify(token, config.jwt.jwtApiSecret);
        const decoded = jwt.decode(token, { complete: true });

        req.user = decoded.payload;

        // console.log("----------------------", req.user);
        var query =
          'SELECT * FROM user_access_tokens WHERE uuid = "' +
          req.user.sub[0] +
          '" ORDER BY `id` DESC';
        db.query(query, function (error, rows) {
          if (error) {
            console.log("Query Error", error);
            res.json(unauthorizedJson);
          } else {
            if (rows.length > 0 && rows[0].disabled == 0) {
              var updateDate = db.query(
                "UPDATE user_access_tokens SET  last_used_at = '" +
                  moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") +
                  "' WHERE uuid = '" +
                  req.user.sub[0] +
                  "'",
                function (err, rows, fields) {
                  // console.log("user access tokens ", rows);
                  if (rows) {
                    next();
                  } else {
                    res.json(unauthorizedJson);
                  }
                }
              );
            } else {
              res.json(unauthorizedJson);
            }
          }
        });
      } catch (err) {
        console.log(err);
        res.json(unauthorizedJson);
      }
    } else {
      res.json(Badrequestjson);
    }
  } else {
    next();
  }
});
app.use(api);

const socket = require("socket.io");

var httpServer = app
  .listen(config.app.port, function () {
    console.log("Api server Started at port :" + config.app.port);
  })
  .setTimeout(0);

// var httpsserver = https.createServer(options, app);
// var createdServer = https.createServer(httpServer);

console.log(
  "-----------------Server.js:- Connecting to Socket Server---------------------"
);

const io = socket(httpServer);
console.log(io,'ioConnect====');

io.on("connection", function (socket) {
  console.log("Socket Connection Created", socket.id);

  // Keep a reference to the socket
  var current = socket;
  // Log the connection
  // console.log(current);
  // console.log("Connected to: " + current.id + " at " + Date.now() + ".");
  socket.on("userjoin", function (data) {
    console.log("User join", data);
    socket.broadcast.emit("userjoin", data);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    try {
      const newMessage = await Chat.create({ senderId, receiverId, message });
      io.emit('newMessage', newMessage);
      console.log(`Message sent: ${message}`);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  });

  socket.on('testMessage', (msg) => {
    console.log('message: ' + msg);
  });

  socket.on("onStatusChange", function (data) {
    console.log("user onStatusChange", data);
    socket.broadcast.emit("onStatusChange", data);
  });

  socket.on("create", function (room) {
    socket.broadcast.emit("userjoin", null);
    socket.join(room);
  });

  socket.on("reconnect_room", function (room) {
    if (room && room.length > 0) {
      for (var i = 0; i < room.length; i++) {
        socket.join(room[i].patient_id + "" + room[i].group_id);
      }
    }
  });
  socket.on("leaveroom", function (room) {
    socket.leave(room);
  });
  socket.on("chatSend", function (data) {
    console.log("chatsend", data);
    socket.broadcast.to(data.room).emit("chatSend", data);
  });

  socket.on("infocreateroom", function (data) {
    sendmsgbasedongroup(data, socket);
  });
  socket.on("userleft", function (data) {
    socket.broadcast.emit("userleft", {
      waitingId: data.waitingId,
      name: data.name,
    });
  });
  socket.on("callDisconnectedByDoc", function (data) {
    socket.broadcast.emit("callDisconnectedByDoc", data);
  });

  socket.on("callCompletedByDoc", function (data) {
    const roomName = webRoomName(data.roomName),
      payload = {
        ...data,
        roomName,
      };

    socket.broadcast.to(roomName).emit("completedByDoc", payload);
  });

  socket.on("callPendingByDoc", function (data) {
    const roomName = webRoomName(data.roomName),
      payload = {
        ...data,
        roomName,
      };

    socket.broadcast.to(roomName).emit("pendingByDoc", payload);
  });
  socket.on("startArchive", function (data) {
    socket.broadcast.emit("startArchive", data);
  });
  socket.on("otheruserjoin", function (data) {
    socket.broadcast.emit("otheruserjoin", data);
  });
  socket.on("doctorGoneOffline", function (data) {
    socket.broadcast.emit("doctorGoneOffline", data);
  });
  socket.on("doctorAcceptedCall", function (data) {
    socket.broadcast.emit("doctorAcceptedCall", data);
  });
  socket.on("calldisconnectedByThirdParty", function (data) {
    socket.broadcast.emit("calldisconnectedByThirdParty", data);
  });
  socket.on("doctorGoneOnline", function (data) {
    socket.broadcast.emit("doctorGoneOnline", data);
  });
  socket.on("disconnect", function () {
    console.log("Socket Disconnected");
  });
});

function sendmsgbasedongroup(data, socket) {
  var val = data.groupid;
  data.ids = [];
  if (val == 0) {
    data.ids.push(data.id);
    socket.broadcast.emit("infocreateroom", data);
  } else {
    var q =
      "select connect_provider.id from connect_provider_groups JOIN connect_provider ON connect_provider_groups.connect_provider_id = connect_provider.id And (token != null or token !='') where group_id =" +
      val;
    db.query(q, function (err, rows) {
      if (err) {
      } else {
        if (rows.length > 0) {
          for (var i = 0; i < rows.length; i++) {
            data.ids.push(rows[i].id);
          }
          socket.broadcast.emit("infocreateroom", data);
        }
      }
    });
  }
}
