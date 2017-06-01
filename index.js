const path = require('path');

console.log(path.join(__dirname, 'dist'));
module.exports = {
  dist: path.join(__dirname, 'dist')
};
