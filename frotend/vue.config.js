const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

//關閉語法檢查
lintOnSave:false

//開啟代理服務器 要轉發給8000
// module.exports = {
//   devServer: {
//     proxy: 'http://localhost:8000'
//   }
// }