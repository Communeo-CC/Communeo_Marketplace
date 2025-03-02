export const healthController = {
  check: (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'API is running correctly'
    });
  }
};