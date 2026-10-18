let app;
let initError = null;

try {
  app = require('../server/app');
} catch (err) {
  initError = err;
  console.error('[Vercel App Init Fatal Error]:', err);
}

module.exports = (req, res) => {
  // If app failed to initialize during module load
  if (initError) {
    return res.status(500).json({
      success: false,
      error: 'Vercel Serverless Initialization Error',
      message: initError.message,
      stack: process.env.NODE_ENV === 'production' ? initError.stack : initError.stack
    });
  }

  // Pass request to Express
  return app(req, res);
};
