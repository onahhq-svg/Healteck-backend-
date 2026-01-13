// config/email.config.js
export default {
  host: process.env.EMAIL_HOST || 'localhost',
  port: process.env.EMAIL_PORT || 1025,
  secure: process.env.EMAIL_SECURE === 'true',
  from: process.env.EMAIL_FROM || 'noreply@healtek.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
};