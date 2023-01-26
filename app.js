const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override') // 載入method-override
const flash = require('connect-flash')
const routes = require('./routes') // 引用路由器
const usePassport = require('./config/passport') //要寫在express-session以後
require('./config/mongoose')
const dotenv = require("dotenv");
//const { use } = require('passport')
const app = express()
// 如果在 Heroku 環境則使用 process.env.PORT
// 否則為本地環境，使用 3000 
const PORT = process.env.PORT
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'ThisIsMySecret', //驗證sessionID字串
  resave: false, //當設定為 true 時，會在每一次與使用者互動後，強制把 session 更新到 session store 裡
  saveUninitialized: true //強制將未初始化的 session 存回 session store。未初始化表示這個 session 是新的而且沒有被修改過，例如未登入的使用者的 session
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  console.log(req.user) //觀察用
  res.locals.isAuthenticated = req.isAuthenticated() //把 req.isAuthenticated() 回傳的布林值，交接給 res 使用
  res.locals.user = req.user //把使用者資料交接給 res 使用
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // 設定每一筆請求都會透過 methodOverride 進行前置處理
app.use(routes) // 將 request 導入路由器。引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。

app.listen(PORT, () => {
  console.log(`Express is running on http://localhost:${PORT}`)
})