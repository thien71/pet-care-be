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
              <a href="${resetUrl}" class="button" style="color:#fff;text-decoration:none;">ĐẶT LẠI MẬT KHẨU</a>
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

/**
 * Gửi email thiết lập mật khẩu cho nhân viên mới
 */
async function sendEmployeeSetupEmail(email, hoTen, setupToken) {
  const setupUrl = `${process.env.FRONTEND_URL}/employee/setup-password?token=${setupToken}`;

  const mailOptions = {
    from: `"Pet Care Da Nang" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thiết lập tài khoản nhân viên - Pet Care Da Nang",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
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
            <h1>Pet Care Da Nang</h1>
            <p>Chào mừng đến với đội ngũ của chúng tôi!</p>
          </div>
          <div class="content">
            <h2>Xin chào ${hoTen}!</h2>
            <p>Bạn đã được thêm vào hệ thống Pet Care Da Nang với vai trò nhân viên.</p>
            <p>Để bắt đầu làm việc, vui lòng nhấn vào nút bên dưới để thiết lập mật khẩu cho tài khoản của bạn:</p>
              <div style="text-align: center;">
                <a href="${setupUrl}" class="button" style="color:#fff;text-decoration:none;">THIẾT LẬP MẬT KHẨU</a>
              </div>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
              ${setupUrl}
            </p>
            
            <div class="warning">
              <strong>⚠️ Lưu ý quan trọng:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>Link này chỉ có hiệu lực trong vòng <strong>24 giờ</strong></li>
                <li>Sau khi thiết lập mật khẩu, bạn có thể đăng nhập vào hệ thống</li>
                <li>Email đăng nhập của bạn là: <strong>${email}</strong></li>
                <li>Không chia sẻ link này với bất kỳ ai</li>
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
    console.log("Employee setup email sent to:", email);
  } catch (error) {
    console.error("Error sending employee setup email:", error);
    throw new Error("Failed to send employee setup email");
  }
}

/**
 * Gửi email xác nhận đơn đặt dịch vụ (cửa hàng xác nhận)
 */
async function sendBookingConfirmedEmail(customerEmail, customerName, bookingId, shopName, bookingDate) {
  const formattedDate = new Date(bookingDate).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: `"Pet Care Đà Nẵng" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "Đơn đã được xác nhận - Pet Care Đà Nẵng",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-box p { font-size: 15px; margin: 8px 0; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Đơn hàng đã được xác nhận</h1>
          </div>
          <div class="content">
            <h2>Xin chào ${customerName},</h2>
            <p>Cảm ơn bạn đã tin tưởng và lựa chọn dịch vụ chăm sóc thú cưng của chúng tôi!</p>
            
            <div class="info-box">
              <strong style="color: #28a745; font-size: 16px;">Trạng thái: Xác nhận thành công</strong>
              <p style="margin: 12px 0 0 0; color: #333;">
                <strong>Đơn hàng số:</strong> ${bookingId}<br>
                <strong>Cửa hàng:</strong> ${shopName}<br>
                <strong>Ngày hẹn:</strong> ${formattedDate}
              </p>
            </div>

            <p style="color: #666; margin-top: 20px;">
              Chúng tôi sẽ cập nhật trạng thái công việc qua email. Vui lòng kiểm tra email thường xuyên.
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ: <strong>thien712k3@gmail.com</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; PetCare Đà Nẵng</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmed email sent to:", customerEmail);
  } catch (error) {
    console.error("Error sending booking confirmed email:", error);
  }
}

/**
 * Gửi email dịch vụ đang được thực hiện (kỹ thuật viên bắt đầu làm)
 */
async function sendServiceStartedEmail(customerEmail, customerName, bookingId, shopName, technicianName) {
  const mailOptions = {
    from: `"Pet Care Đà Nẵng" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "Dịch vụ đang được thực hiện - Pet Care Đà Nẵng",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #0d6efd 0%, #0099ff 100%); color: white; padding: 20px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; border-left: 4px solid #0d6efd; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-box p { font-size: 15px; margin: 8px 0; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Dịch vụ đang được thực hiện</h1>
          </div>
          <div class="content">
            <h2>Xin chào ${customerName},</h2>
            <p>Chúng tôi vui mừng thông báo rằng dịch vụ của bạn đang được thực hiện.</p>
            
            <div class="info-box">
              <strong style="color: #0d6efd; font-size: 16px;">Chi tiết:</strong>
              <p style="margin: 12px 0 0 0; color: #333;">
                <strong>Đơn hàng số:</strong> ${bookingId}<br>
                <strong>Cửa hàng:</strong> ${shopName}<br>
                <strong>Kỹ thuật viên:</strong> ${technicianName}<br>
                <strong>Trạng thái:</strong> Đang thực hiện
              </p>
            </div>

            <p style="color: #666; margin-top: 20px;">
              Chúng tôi đang chăm sóc thú cưng của bạn với sự chu đáo. Dịch vụ sẽ được hoàn thành trong thời gian dự kiến.
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ: <strong>thien712k3@gmail.com</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; PetCare Đà Nẵng</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Service started email sent to:", customerEmail);
  } catch (error) {
    console.error("Error sending service started email:", error);
  }
}

/**
 * Gửi email dịch vụ hoàn thành (kỹ thuật viên hoàn tất công việc)
 */
async function sendServiceCompletedEmail(customerEmail, customerName, bookingId, shopName) {
  const mailOptions = {
    from: `"Pet Care Đà Nẵng" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "Dịch vụ đã hoàn thành - Pet Care Đà Nẵng",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%); color: white; padding: 20px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .info-box p { font-size: 15px; margin: 8px 0; }
          .action-box { background: #fffbea; border: 2px dashed #ffc107; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Dịch vụ đã hoàn thành</h1>
          </div>
          <div class="content">
            <h2>Xin chào ${customerName},</h2>
            
            <div class="info-box">
              <strong style="color: #ffc107; font-size: 16px;">Chi tiết:</strong>
              <p style="margin: 12px 0 0 0; color: #333;">
                <strong>Đơn hàng số:</strong> ${bookingId}<br>
                <strong>Cửa hàng:</strong> ${shopName}<br>
                <strong>Trạng thái:</strong> Đã hoàn thành
              </p>
            </div>

            <div class="action-box">
              <p style="margin: 0 0 10px 0; color: #333; font-size: 16px;"><strong>Bước tiếp theo:</strong></p>
              <p style="margin: 5px 0; color: #666;">
                Vui lòng đến nhận thú cưng của bạn.<br>
                Thanh toán chi phí dịch vụ tại quầy.
              </p>
            </div>

            <p style="color: #666; margin-top: 20px;">
              Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Hy vọng thú cưng của bạn sẽ khỏe và vui vẻ!
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ: <strong>thien712k3@gmail.com</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; PetCare Đà Nẵng</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Service completed email sent to:", customerEmail);
  } catch (error) {
    console.error("Error sending service completed email:", error);
  }
}

/**
 * Gửi email xác nhận hoàn tất đơn hàng (lễ tân xác nhận thanh toán)
 */
async function sendOrderCompletedEmail(customerEmail, customerName, bookingId, shopName, totalAmount) {
  const formattedAmount = parseFloat(totalAmount).toLocaleString("vi-VN");

  const mailOptions = {
    from: `"Pet Care Đà Nẵng" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: "Đơn hàng đã hoàn tất - Pet Care Đà Nẵng",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #8e2800 0%, #c43a0e 100%); color: white; padding: 20px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .summary-box { background: white; border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .summary-box p { font-size: 15px; margin: 8px 0; }
          .amount { font-size: 24px; font-weight: bold; color: #8e2800; text-align: center; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Đơn hàng đã hoàn tất</h1>
          </div>
          <div class="content">
            <h2>Xin chào ${customerName},</h2>
            <p>Đơn hàng của bạn đã hoàn tất thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            
            <div class="summary-box">
              <p style="margin: 0 0 10px 0; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                <strong style="color: #8e2800;">Thông tin đơn hàng:</strong>
              </p>
              <p style="margin: 10px 0; color: #333;">
                <strong>Đơn hàng số:</strong> ${bookingId}<br>
                <strong>Cửa hàng:</strong> ${shopName}<br>
                <strong>Trạng thái:</strong> Đã thanh toán
              </p>
              
              <div style="margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 5px;">
                <p style="margin: 0 0 5px 0; color: #666;">Tổng chi phí:</p>
                <div class="amount">${formattedAmount} VND</div>
              </div>
            </div>

            <p style="color: #666; margin-top: 20px;">
              Cảm ơn bạn đã tin tưởng dịch vụ chăm sóc thú cưng của PetCare Đà Nẵng. Chúng tôi luôn sẵn sàng phục vụ bạn trong những lần tiếp theo!
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ: <strong>thien712k3@gmail.com</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; PetCare Đà Nẵng</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order completed email sent to:", customerEmail);
  } catch (error) {
    console.error("Error sending order completed email:", error);
  }
}

/**
 * Gửi email xác nhận thanh toán gói dịch vụ (admin xác nhận thanh toán gói)
 */
async function sendPackagePaymentConfirmedEmail(ownerEmail, ownerName, packageName, validFrom, validUntil) {
  const formattedFrom = new Date(validFrom).toLocaleDateString("vi-VN");
  const formattedUntil = new Date(validUntil).toLocaleDateString("vi-VN");

  const mailOptions = {
    from: `"Pet Care Đà Nẵng" <${process.env.EMAIL_USER}>`,
    to: ownerEmail,
    subject: "Thanh toán gói dịch vụ thành công - Pet Care Đà Nẵng",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 10px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-box { background: white; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .success-box p { font-size: 15px; margin: 8px 0; }
          .validity-box { background: #e8f5e9; border: 1px solid #28a745; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .validity-box p { font-size: 15px; margin: 8px 0; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Thanh toán gói dịch vụ thành công</h1>
          </div>
          <div class="content">
            <h2>Xin chào ${ownerName},</h2>
            <p>Chúng tôi vui mừng thông báo rằng gói dịch vụ của cửa hàng bạn đã được xác nhận thanh toán thành công!</p>
            
            <div class="success-box">
              <strong style="color: #28a745; font-size: 16px;">Gói dịch vụ: ${packageName}</strong>
              <p style="margin: 12px 0 0 0; color: #333;">
                <strong>Trạng thái:</strong> Đã thanh toán<br>
                <strong>Ngày xác nhận:</strong> ${new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div class="validity-box">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #2e7d32; font-size: 16px;">Thời gian hiệu lực:</p>
              <p style="margin: 10px 0; color: #333;">
                <strong>Từ:</strong> ${formattedFrom}<br>
                <strong>Đến:</strong> ${formattedUntil}
              </p>
              <p style="margin: 15px 0 0 0; font-size: 14px; color: #555;">
                Gói dịch vụ của bạn hiện đã được kích hoạt và sẵn sàng sử dụng!
              </p>
            </div>

            <p style="color: #666; margin-top: 20px;">
              Với gói dịch vụ này, cửa hàng của bạn có thể tiếp tục cung cấp các dịch vụ chăm sóc thú cưng chất lượng cao cho khách hàng.
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ: <strong>thien712k3@gmail.com</strong>
            </p>
          </div>
          <div class="footer">
            <p>&copy; PetCare Đà Nẵng</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Package payment confirmed email sent to:", ownerEmail);
  } catch (error) {
    console.error("Error sending package payment confirmed email:", error);
  }
}

module.exports = {
  sendVerificationOTP,
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
  sendEmployeeSetupEmail,
  sendBookingConfirmedEmail,
  sendServiceStartedEmail,
  sendServiceCompletedEmail,
  sendOrderCompletedEmail,
  sendPackagePaymentConfirmedEmail,
};
