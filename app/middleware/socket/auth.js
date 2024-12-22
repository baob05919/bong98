const socketModel = require('../../models/eboxModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
exports.appAuth = async (socket, next) => {
  if (!socket.handshake.auth.uid) {
    next(new Error('Invalid authorization'))
  } else {
    var address = socket.handshake.address
    if (address.substr(0, 7) == '::ffff:') {
      address = address.substr(7)
    }
    socketModel
      .AppOnStatus(socket.id, socket.handshake.auth.uid, 'stopped', address)
      .then(([data]) => {
        if (data.affectedRows == 0) {
          next(new Error('Invalid authorization'))
        } else {
          next()
        }
      })
      .catch(err => {
        next(new Error('Invalid authorization'))
      })
  }
}

exports.webAuth = async (socket, next) => {
  const error = new Error('Your session is invalid')
  error.data = { status: 401 }
  try {
    const token = socket.handshake.headers['authorization']
    if (!token || token === 'null') {
      return next(error)
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    socket.handshake.user = { ...decoded }
    return next()
  } catch (err) {
    console.log(err)
    return next(error)
  }
}
