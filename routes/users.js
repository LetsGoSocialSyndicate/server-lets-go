const express = require('express')
const router = express.Router()

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.get('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

router.post('/', (req, res, next) => {
  res.send('respond with a resource')
})

router.patch('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

router.delete('/:id', (req, res, next) => {
  res.send('respond with a resource')
})

module.exports = router
