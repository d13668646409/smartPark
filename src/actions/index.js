const modulesFiles = require.context('./modules', true, /\.js$/)

let api = {}

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  api = Object.assign(api,value.default)
  
},{})

export default api