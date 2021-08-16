const express = require('express')
const cors = require('cors')
const app = express();
const db = require('./server/models')
// db.sequelize.sync({ force: true })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./server/routes')(app);

server = app.listen(8080, () => {
    console.log('server is running on port 8080')
});

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.of('/main').on('connection', (socket) => {
  console.log(socket.id)

  socket['clientData'] = {
    socket_id: socket.id,
    user_id: '',
    username: '',
    color: '',
    view: null,
    center: [0, 0],
    zoom: 3,
    features: null
  }

  let clients = []

  io.of('/main').sockets.forEach(client => {
    clients.push(client.clientData)
  })

  io.of('/main').emit('UPDATE_CLIENTS', clients)
  io.of('/main').emit('FEATURES', clients)
  io.of('/main').emit('VIEWS', clients)

  socket.on('SET_USER', (data) => {
    socket['clientData'].username = data.username
    socket['clientData'].color = data.color

    io.of('/main').emit('UPDATE_CLIENTS', clients)
  })

  socket.on('SET_FEATURE', (data) => {
    let clients = []

    socket['clientData'].features = data
    io.of('/main').sockets.forEach(client => {
      clients.push(client.clientData)
    })

    io.of('/main').emit('FEATURES', clients)
  });

  socket.on('SET_VIEW', (data) => {
    let clients = []

    if (data) {
      socket['clientData'].view = data.extent
      socket['clientData'].center = data.center
      socket['clientData'].zoom = data.zoom
    }

    io.of('/main').sockets.forEach(client => {
      clients.push(client.clientData)
    })

    io.of('/main').emit('VIEWS', clients)
  })

  socket.on('disconnect', () => {
    let clients = []

    io.of('/main').sockets.forEach(client => {
      clients.push(client.clientData)
    })

    io.of('/main').emit('UPDATE_CLIENTS', clients)
  })
});