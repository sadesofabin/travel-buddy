const { ZodError } = require("zod");
const catchAsync = require("../helpers/catchAsync");

const validate = (schema) =>
  catchAsync(async (req, res, next) => {
    try {
      const parsedReq = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      Object.assign(req, {
        body: parsedReq.body,
        query: parsedReq.query,
        params: parsedReq.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Failed",
          errors: error.errors.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

module.exports = { validate };
