const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  console.log('📧 Contact form submission received');
  console.log('📧 Event method:', event.httpMethod);
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('📧 Handling OPTIONS/preflight request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('📧 Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, email, phone, message } = JSON.parse(event.body);
    
    console.log('📧 Form data received:', { name, email, phone: phone ? 'provided' : 'not provided' });

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and message are required' 
        }),
      };
    }

    // Email configuration - using Gmail SMTP as a reliable option
    // You can replace this with your preferred email service
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com', // Set this in Netlify environment variables
        pass: process.env.SMTP_PASS || 'your-app-password'     // Use app password, not regular password
      }
    });

    // Alternative configuration for other SMTP services
    // const transporter = nodemailer.createTransporter({
    //   host: 'smtp.your-provider.com',
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // });

    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@praytees.com',
      to: 'support@praytees.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #1e40af;">${email}</a>
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This email was sent from the PrayTees contact form on your website.
          </p>
        </div>
      `,
      // Also include a plain text version
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

Reply to: ${email}
      `
    };

    console.log('📧 Attempting to send email...');
    
    // Send the email
    await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Email sent successfully',
        success: true 
      }),
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
    };
  }
}; 