
const router = require('./router');
const createServer = require('./server')(router);

module.exports = async () => {
  return createServer;
};


