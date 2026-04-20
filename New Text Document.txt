const AWS = require("aws-sdk");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1"
});

const sns = new AWS.SNS();

const sendSMS = async (message) => {
  try {
    await sns.publish({
      Message: message,
      PhoneNumber: process.env.PHONE_NUMBER
    }).promise();

    console.log("SMS sent successfully");
  } catch (error) {
    console.error("SMS error:", error);
  }
};

module.exports = sendSMS;