const express = require('express')
const router = express.Router()
const passport = require('passport')

//向facebook發出請求，帶入的參數scope: ['email', 'public_profile']是我們向Facebook要求的資料。
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

//是 Facebook 把資料發回來的地方，這條路由其實和 POST /users/login 差不多，如果能用傳回來的資料順利登入，就放 request 進場，如果登入失敗，就再導向登入頁。
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router