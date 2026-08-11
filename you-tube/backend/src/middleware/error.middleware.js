// import { ApiError } from "../utils/apiError.js";

// const errorHandler = (err, req, res, next) => {
//   const statusCode = err?.statuscode || 500;
//   const message = err?.message || "Internal Server Error";
//   const errors = err?.errors || [];

//   const responseBody = {
//     success: false,
//     message,
//   };

//   if (errors && errors.length) responseBody.errors = errors;
//   // Include stack only in development for easier debugging
//   if (process.env.NODE_ENV === "development") responseBody.stack = err?.stack;
  
//   res.status(statusCode).json(responseBody);
// };

// export default errorHandler;
