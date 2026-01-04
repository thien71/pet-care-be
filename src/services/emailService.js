// src/services/emailService.js
const nodemailer = require("nodemailer");

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Gửi email OTP xác thực
 */
async function sendVerificationOTP(email, otpCode) {
  const mailOptions = {
    from: `"Pet Care Da Nang" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mã xác thực tài khoản Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #8e2800 0%, #c43a0e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #8e2800; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 36px; font-weight: bold; color: #8e2800; letter-spacing: 8px; font-family: 'Courier New', monospace; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pet Care Da Nang</h1>
            <p>Chào mừng bạn đến với gia đình chúng tôi!</p>
          </div>
          <div class="content">
            <h2>Xác thực địa chỉ email của bạn</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Pet Care Da Nang!</p>
            <p>Đây là mã OTP để xác thực tài khoản của bạn:</p>
            
            <div class="otp-box">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">MÃ XÁC THỰC</p>
              <div class="otp-code">${otpCode}</div>
              <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Có hiệu lực trong 3 phút</p>
            </div>

            <div class="warning">
              <strong>Lưu ý quan trọng:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Mã OTP này chỉ có hiệu lực trong vòng <strong>3 phút</strong></li>
                <li>Không chia sẻ mã này với bất kỳ ai</li>
                <li>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ: <strong>thien712k3@gmail.com</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Pet Care Da Nang - Nguyễn Văn Thanh Thiện</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", email);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

/**
 * Gửi email reset password
 */
async function sendResetPasswordEmail(email, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Pet Care Da Nang" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu - Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #8e2800 0%, #c43a0e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding-left: 30px; padding-right: 30px; padding-top: 8px; padding-bottom: 8px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #8e2800; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Đặt lại mật khẩu</h1>
          </div>
          <div class="content">
            <h2>Yêu cầu đặt lại mật khẩu</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
            <div style="text-align: center; color: #fff;">
              <a href="${resetUrl}" class="button">ĐẶT LẠI MẬT KHẨU</a>
            </div>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <div class="warning">
              <strong>Lưu ý quan trọng:</strong>
              <ul>
                <li>Link này chỉ có hiệu lực trong vòng 1 giờ</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                <li>Không chia sẻ link này với bất kỳ ai</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: thien712k3@gmail.com</p>
            <p>&copy; Nguyễn Văn Thanh Thiện</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send reset password email");
  }
}

/**
 * Gửi email thông báo đổi mật khẩu thành công
 */
async function sendPasswordChangedEmail(email) {
  const mailOptions = {
    from: `"Pet Care Da Nang" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mật khẩu đã được thay đổi - Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding-left: 30px; padding-right: 30px; padding-top: 8px; padding-bottom: 8px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thay đổi mật khẩu thành công</h1>
          </div>
          <div class="content">
            <h2>Mật khẩu của bạn đã được cập nhật</h2>
            <p>Mật khẩu cho tài khoản của bạn vừa được thay đổi thành công.</p>
            <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với chúng tôi qua email: <strong>thien712k3@gmail.com</strong></p>
          </div>
          <div class="footer">
            <p>&copy; Nguyễn Văn Thanh Thiện</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password changed notification sent to:", email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {
  sendVerificationOTP,
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
};
