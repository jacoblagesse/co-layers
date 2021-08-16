const feature = require('./controllers/feature.js')
const user = require('./controllers/user.js')

module.exports = app => {
  app.post('/api/signup', user.create)
  app.post('/api/login', user.retrieve)

  app.post('/api/features', feature.create)
  app.get('/api/features/:userId', feature.list)
  app.get('/api/features/:id', feature.retrieve)
  app.put('/api/features/:id', feature.update)
  app.delete('/api/features/:id', feature.destroy)
  app.get('/api/features/purge/:userId', feature.purge)
}