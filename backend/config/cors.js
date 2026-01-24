const cors = require('cors');

const normalize = (url) => url?.replace(/\/$/, '');

module.exports = (app) => {
  const frontendEnv = process.env.FRONTEND_URL;

  if (!frontendEnv) {
    console.warn('⚠️ FRONTEND_URL missing');
    return;
  }

  const allowedOrigins = frontendEnv
    .split(',')
    .map(normalize);

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalize(origin);

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));
};
