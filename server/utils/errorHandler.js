import models from '../models';

/**
 * Modified express error handler
 * @returns {void}
 */
export default function errorHandler() {
  // error handlers must always take four arguments
  // eslint-disable-next-line
  return (error, req, res, next) => {
    console.log(error, '============');
    if (error.validations) return res.status(422).json({ errors: error.validations });
    const { sequelize } = models;
    if (!error.code) {
      if (error instanceof sequelize.ValidationError || error instanceof sequelize.UniqueConstraintError) {
        error.code = 422;
      } else if (error instanceof sequelize.EmptyResultError) {
        error.code = 404;
        error.message = 'The resource requested was not found';
      } else {

        error.code = 500;
        error.message = 'Exception 500! Operation failed.';
      }
    }
    return res.status(error.code).json({ error: error.message });
  };
}
