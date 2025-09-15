// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");
// dotenv.config();


// const transport = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAIL_PASS
//     }
// });

// transport.verify((error,success)=>{
//     if(error){
//         console.log(`Gmail Services Failed : ${error.message}`);        
//     }else{
//         console.log(`Gmail Configured successful Ready to send email !`);        
//     }
// });

// const sendOtpToEmail=async(email,otp)=>{
//        const html = `
//     <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
//       <h2 style="color: #075e54;">🔐 WhatsApp Web Verification</h2>
      
//       <p>Hi there,</p>
      
//       <p>Your one-time password (OTP) to verify your WhatsApp Web account is:</p>
      
//       <h1 style="background: #e0f7fa; color: #000; padding: 10px 20px; display: inline-block; border-radius: 5px; letter-spacing: 2px;">
//         ${otp}
//       </h1>

//       <p><strong>This OTP is valid for the next 5 minutes.</strong> Please do not share this code with anyone.</p>

//       <p>If you didn’t request this OTP, please ignore this email.</p>

//       <p style="margin-top: 20px;">Thanks & Regards,<br/>WhatsApp Web Security Team</p>

//       <hr style="margin: 30px 0;" />

//       <small style="color: #777;">This is an automated message. Please do not reply.</small>
//     </div>
//   `;
//   await transport.sendMail({
//     from: `"WhatsApp Web" <${process.env.EMAIL_USER}>`,
//     to:email,
//     subject: "Your WhatsApp Verification OTP",
//     html,
//   })
// }

// module.exports = sendOtpToEmail;



const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ideally use an App Password
  },
});

transport.verify((error, success) => {
  if (error) {
    console.log(`❌ Gmail Services Failed: ${error.message}`);
  } else {
    console.log("✅ Gmail configured successfully. Ready to send emails!");
  }
});

const sendOtpToEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto;">
      <h2 style="color: #075e54; text-align: center;">🔐 Account Verification</h2>
      
      <p>Dear User,</p>
      
      <p>To complete the verification process, please use the one-time password (OTP) provided below:</p>
      
      <h1 style="background: #f4f4f4; color: #000; padding: 12px 24px; display: inline-block; border-radius: 6px; letter-spacing: 3px; margin: 20px 0;">
        ${otp}
      </h1>

      <p><strong>This OTP is valid for 5 minutes.</strong> For your security, please do not share this code with anyone.</p>

      <p>If you did not request this verification, you can safely ignore this message.</p>

      <p style="margin-top: 30px;">Kind regards,<br/><strong>WhatsApp Web Team</strong></p>

      <hr style="margin: 30px 0;" />

      <small style="color: #777; font-size: 12px;">This is an automated message. Please do not reply to this email.</small>
    </div>
  `;

  await transport.sendMail({
    from: `"Account Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code (OTP)",
    html,
  });
};

module.exports = sendOtpToEmail;
