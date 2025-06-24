// a middleware to log the routes being accessed during the work of the project:
export const routeLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};