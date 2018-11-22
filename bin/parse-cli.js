const cp = require('child_process')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs-extra')
const program = require('commander')
const randomize = require('randomatic')

const MODE_0755 = parseInt('0755', 8)

program
  .version('0.0.1')
  .option('-n, --name [type]')
  .option('-h, --host [type]')
  .option('-p, --port [type]')
  .parse(process.argv)

const { name, host, port } = program

if (!name) {
  console.log('must name')
  return
}

if (!host) {
  console.log('must host')
  return
}

if (!port) {
  console.log('must port')
  return
}

const loc = path.join('/var/app', program.name)

mkdirp.sync(loc, MODE_0755)
fs.copySync(path.join(`${process.cwd()}/cloud`), `${loc}/cloud`)


const random = () => randomize('Aa0', 24)
// env
const PORT = port
const HOST = host
const APP_NAME = program.name
const APP_ID = random()
const MOUNT_PATH = `/${random()}`
const DASHBOARD_PATH = '/dashboard'
const MASTER_KEY = random()
const DATABASE_URI = 'mongodb://192.168.1.4:27017/dev'
const REST_KEY = random()
const FILE_KEY = random()
const SERVER_URL = `${HOST}:${PORT}${MOUNT_PATH}`

const env = `-e APP_NAME=${APP_NAME} -e APP_ID=${APP_ID} -e MOUNT_PATH=${MOUNT_PATH} -e DASHBOARD_PATH=${DASHBOARD_PATH} -e MASTER_KEY=${MASTER_KEY} -e DATABASE_URI=${DATABASE_URI} -e REST_KEY=${REST_KEY} -e FILE_KEY=${FILE_KEY} -e SERVER_URL=${SERVER_URL}`

cp.exec(
  `docker run -d --name ${program.name} -p ${PORT}:1337 ${env} parse`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`${env}`)
      console.log(stdout)
    }
  }
)
