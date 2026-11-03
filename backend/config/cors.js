const cors = require('cors');

module.exports = (app) => {
  const defaultAllowed = [
    'http://localhost:5173',
    'http://localhost:5000',
    'http://localhost:3000',
    'https://beadsandbloom.in',
    'https://www.beadsandbloom.in'
  ];

  const envOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, '')) 
    : [];

  const allowedOrigins = Array.from(new Set([...defaultAllowed, ...envOrigins]));

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || 
        /^https?:\/\/([a-z0-9-]+\.)?beadsandbloom\.in(:\d+)?$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        // Return null, false to deny CORS cleanly without throwing an unhandled 500 error
        callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));

  // Handle preflight requests cleanly
  app.options(/(.*)/, cors(corsOptions));
};
