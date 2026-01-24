const cors = require('cors');

const enableCors = (app) => {
  if (!process.env.FRONTEND_URL) return;

  const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS blocked'));
        }
      },
      credentials: true,
    })
  );
};

module.exports = enableCors;
