const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION
});

const enviarSms = async (message, number) => {
  return new Promise((resolve, reject) => {
    const status = sns
      .publish({
        Message: message,
        PhoneNumber: number
      })
      .promise();

    status
      .then(status => {
        resolve(status);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports = {
  enviarSms
};

// var params = {
//   attributes: {
//     /* required */
//     DefaultSMSType: "Transactional" /* highest reliability */
//     //'DefaultSMSType': 'Promotional' /* lowest cost */
//   }
// };

// // Create promise and SNS service object
// var setSMSTypePromise = sns.setSMSAttributes(params).promise();

// // Handle promise's fulfilled/rejected states
// setSMSTypePromise
//   .then(function(data) {
//     console.log(data);
//   })
//   .catch(function(err) {
//     console.error(err, err.stack);
//   });
