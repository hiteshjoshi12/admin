const cors = require('cors');

module.exports = (app) => {
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',') 
    : ['http://localhost:5173'];

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));

  // Fix: Use regex for the wildcard to avoid PathError
  app.options(/(.*)/, cors(corsOptions));
};