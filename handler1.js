'use strict';

const func1 = require('./function1').one


module.exports.endpoint1 = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'got this name ' + func1() ,
    }),
  };

  callback(null, response);
};
