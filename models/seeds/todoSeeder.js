const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Todo = require('../todo') // 載入 todo model
const db = require('../../config/mongoose')
const user = require('../user')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => user.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 10 },
        (_, i) => Todo.create({ name: `name-${i}`, userId })
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit() //關閉這段Node執行程序，由於這段seeder程式只有在第一次初始化時才會用到，
      //不像專案主程式一旦開始就執行運作，所以在seeder做好以後把這個臨時的Node.js程序結束掉。
      //類似把臨時的Node.js執行環境關機的概念
    })
})