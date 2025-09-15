// const twilio = require("twilio");



// // Twilio credentials from env

// const accountSid= process.env.TWILIO_ACCOUNT_SID;
// const serviceSid = process.env.TWILIO_SERVICE_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN


// const client = twilio(accountSid,authToken);
// // Send otp to phoneNumver
// const sendOtpToPhoneNumber = async(phoneNumber)=>{
//     try {
//         console.log(`send opt to this number : ${phoneNumber}`);
//         if(!phoneNumber){
//             throw new Error(`Phone Number is Required!`);
//         }
//         const response = await client.verify.v2.services(serviceSid).verifications.create({
//             to:phoneNumber,
//             channel:"sms"
//         });
//         console.log(`this is my otp response : ${response}`);
//         return response;        
//     } catch (error) {
//         console.error(error);
//         throw new Error(`Faild to send opt`)
//     }
// }

// const verifyOtp = async(phoneNumber)=>{
//     try {
//         console.log(`This is my Otp : ${otp}`);
        
//         console.log(`send opt to this number : ${phoneNumber}`);
//         const response = await client.verify.v2.services(serviceSid).verificationChecks.create({
//             to:phoneNumber,
//             channel:"sms"
//         });
//         console.log(`this is my otp response : ${response}`);
//         return response;        
//     } catch (error) {
//         console.error(error);
//         throw new Error(`OTP verification Failed`)
//     }
// }

// module.exports = {
//     sendOtpToPhoneNumber,
//     verifyOtp
// }

const twilio = require("twilio");

// 🔑 Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

/**
 * Send OTP to a phone number
 * @param {string} phoneNumber - Full phone number including country code
 */
const sendOtpToPhoneNumber = async (phoneNumber) => {
  try {
    console.log(`Sending OTP to this number: ${phoneNumber}`);

    if (!phoneNumber) {
      throw new Error("Phone Number is required!");
    }

    const response = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    console.log("OTP send response:", response);
    return response;
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP");
  }
};

/**
 * Verify OTP for a phone number
 * @param {string} phoneNumber - Full phone number including country code
 * @param {string} otp - OTP code entered by the user
 */
const verifyOtp = async (phoneNumber, otp) => {
  try {
    if (!phoneNumber || !otp) {
      throw new Error("Phone number and OTP are required!");
    }

    console.log(`Verifying OTP ${otp} for number: ${phoneNumber}`);

    const response = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: otp, // ✅ must pass the OTP code
      });

    console.log("OTP verification response:", response);
    return response;
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    throw new Error("OTP verification failed");
  }
};

module.exports = {
  sendOtpToPhoneNumber,
  verifyOtp,
};
