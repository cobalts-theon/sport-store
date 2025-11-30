import nodemailer from 'nodemailer';

// Hàm gửi email async lấy 3 tham số: người nhận, tiêu đề, nội dung
export const sendEmail = async (to, subject, text) => {
    try {
        //Trước hết tạo 1 thằng vận chuyển (transporter) để gửi email (Ở đây dùng Gmail)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,   // Địa chỉ email gửi đi 
                pass: process.env.EMAIL_PASS    // Mật khẩu ứng dụng (App Password) nếu dùng xác thực 2 bước không phải mật khẩu chính của google
            }
        });

        const Mailoptions = {
            from:`"Prime Souls" <${process.env.EMAIL_USER}>`, // Địa chỉ người gửi
            to: to,
            subject: subject,
            text: text,
            html: text //Nội dung có thể là thẻ html
        };

        //Sau đó tao sẽ tạo 1 cấu hình nội dung email và gửi đi
        await transporter.sendMail(Mailoptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.log(error);
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }   
    }
}

export default sendEmail;