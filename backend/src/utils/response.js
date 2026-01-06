export const success = (res, data = {}, message = "OK", meta = {}) => {
  return res.json({
    success: true,
    message,
    data,
    meta: Object.keys(meta).length ? meta : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const error = (
  res,
  status = 500,
  message = "Internal Server Error",
  data = {}
) => {
  return res.status(status).json({
    success: false,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const validationError = (
  res,
  message = "Validation Error",
  details = {}
) => error(res, 400, message, { details });

export default { success, error, validationError };
//Standard API responses
