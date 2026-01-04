// src/services/emailService.js
const nodemailer = require("nodemailer");

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc SMTP server khác
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn
    pass: process.env.EMAIL_PASSWORD, // App password (không phải password thường)
  },
});

/**
 * Gửi email xác thực
 */
async function sendVerificationEmail(email, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Pet Care Da Nang" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🐾 Xác thực tài khoản Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8e2800 0%, #c43a0e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #8e2800; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 Pet Care Da Nang</h1>
            <p>Chào mừng bạn đến với gia đình chúng tôi!</p>
          </div>
          <div class="content">
            <h2>Xác thực địa chỉ email của bạn</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại Pet Care Da Nang!</p>
            <p>Vui lòng nhấn vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">XÁC THỰC EMAIL</a>
            </div>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
              ${verificationUrl}
            </p>
            <p><strong>Lưu ý:</strong> Link xác thực này sẽ hết hạn sau 24 giờ.</p>
          </div>
          <div class="footer">
            <p>Nếu bạn không yêu cầu email này, vui lòng bỏ qua.</p>
            <p>&copy; 2024 Pet Care Da Nang. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send verification email");
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
    subject: "🔐 Đặt lại mật khẩu - Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8e2800 0%, #c43a0e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #8e2800; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Đặt lại mật khẩu</h1>
          </div>
          <div class="content">
            <h2>Yêu cầu đặt lại mật khẩu</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">ĐẶT LẠI MẬT KHẨU</a>
            </div>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <div class="warning">
              <strong>⚠️ Lưu ý quan trọng:</strong>
              <ul>
                <li>Link này chỉ có hiệu lực trong vòng 1 giờ</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                <li>Không chia sẻ link này với bất kỳ ai</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ: support@petcare.vn</p>
            <p>&copy; 2024 Pet Care Da Nang. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Reset password email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
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
    subject: "✅ Mật khẩu đã được thay đổi - Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Thay đổi mật khẩu thành công</h1>
          </div>
          <div class="content">
            <h2>Mật khẩu của bạn đã được cập nhật</h2>
            <p>Mật khẩu cho tài khoản của bạn vừa được thay đổi thành công.</p>
            <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với chúng tôi qua email: <strong>support@petcare.vn</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Pet Care Da Nang. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Password changed notification sent to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
};
