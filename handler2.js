'use strict';


const func2 = require('./function2').two
module.exports.endpoint2 = (event, context, callback) => {


  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'got tihs ' + func2(),
    }),
  };

  callback(null, response);
};
