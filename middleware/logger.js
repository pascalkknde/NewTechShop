const {format} = require('date-fns');
const { v4:uuid} = require('uuid');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logDirectory = path.join(__dirname, '..', 'logs')
const logEvents = async (msg,logFileName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss\n')}`;
  const logItem = `${dateTime}\t${uuid()}\t${msg}`;
  if (!fs.existsSync(logDirectory)){
    await fsPromises.mkdir(logDirectory)
  }
  await fsPromises.appendFile(path.join(__dirname, '..','logs', logFileName), logItem, (error)=>{
    if(error) throw error;
  });
}

const logger = (req, res, next)=>{
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
      .then(() => console.log(`${req.method}\t${req.path}`))
      .then(()=>next())
}
module.exports = {logEvents, logger}