if (!process.env.NODE_ENV || process.env.NODE_ENV.toLowerCase().trim().substr(0,3) === 'dev') {
  console.log('opening coverage report coverage/lcov-report/index.html');
  require('open')(__dirname + '/../coverage/lcov-report/index.html');
}