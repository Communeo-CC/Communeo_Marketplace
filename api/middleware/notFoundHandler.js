export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found',
      status: 404
    }
  });
};