export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    
    const messages = err.errors ? err.errors.map(e => e.message) : [err.message];
    return res.status(400).json({
      message: "Validation error",
      errors: messages
    });
  }
};
