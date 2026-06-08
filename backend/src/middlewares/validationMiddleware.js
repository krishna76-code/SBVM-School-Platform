export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse req.body against schema. If valid, replaces req.body with clean validated data
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error.errors) {
        // Collect Zod validation error messages
        const errorDetails = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: errorDetails
        });
      }
      next(error);
    }
  };
};
