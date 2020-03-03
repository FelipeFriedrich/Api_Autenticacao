const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/apirest1?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;
