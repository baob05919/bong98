const fs = require('fs')
const config = require('./config')

exports.createConfig = async () => {
  try {
    !fs.existsSync(config.PATH) &&
      fs.mkdirSync(config.PATH, { recursive: true })
      !fs.existsSync(config.DATA) &&
      fs.mkdirSync(config.DATA, { recursive: true })
    if (!fs.existsSync(config.USERFILE)) {
      fs.writeFileSync(config.USERFILE, "{}");
    }
    if (!fs.existsSync(config.QUAYTHUONG)) {
      fs.writeFileSync(config.QUAYTHUONG, '{"data": []}');
    }
    if (!fs.existsSync(config.DANHSACH)) {
      fs.writeFileSync(config.DANHSACH, '{"data": []}');
    }
  } catch (err) {
    console.log(err)
  }
  return
}
