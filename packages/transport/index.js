'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/transport.cjs.prod.js')
} else {
  module.exports = require('./dist/transport.cjs.js')
}
