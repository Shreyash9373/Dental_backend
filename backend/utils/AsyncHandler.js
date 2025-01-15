// Function to pass errors thrown to middleware
export const AsyncErrorHandler = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    next(error);
  }
};
