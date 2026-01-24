const cors = require('cors');

module.exports = (app) => {
  const origin =
    process.env.NODE_ENV === 'production'
      ? 'https://frontend-gamma-jet-917q7wc134.vercel.app'
      : 'http://localhost:5173';

  app.use(
    cors({
      origin,
      credentials: true,
    })
  );
};
