import { body, param, validationResult } from 'express-validator';
import { BadrequestError, NotFoundError, UnauthorizedError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import job from '../models/JobModel.js';
import User from '../models/UserModel.js';

const withValidationErrors = validateValues => {
  //if we get more returns can use []
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      //if any value is missed then
      if (!errors.isEmpty()) {
        //for registerroutes
        const errorMessage = errors.array().map(error => error.msg);

        //for login
        if (errorMessage[0].startsWith('not a valid')) {
          throw new NotFoundError(errorMessage);
        }
        //for login
        if (errorMessage[0].startsWith('not authorized')) {
          throw new UnauthorizedError('not authorized to access this route');
        }
        throw new BadrequestError(errorMessage);
      }
      next();
    }
  ];
};

export const validateJobInput = withValidationErrors([body('company').notEmpty().withMessage('company is required'), body('position').notEmpty().withMessage('position is required'), body('jobLocation').notEmpty().withMessage('jobLocation is required'), body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('jobStatus is required'), body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('jobType invalid type value')]);

export const validateParams = withValidationErrors([
  param('id').custom(async (value, { req }) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new Error('invalid Mongo id');

    const Job = await job.findById(value);
    if (!Job) throw new Error(`not a valid id:${value}`);

    const isAdmin = req.user.role === 'admin';
    //createdBy will be obj -> tostring
    const isOwner = req.user.userId === Job.createdBy.toString();
    if (!isAdmin && !isOwner) throw new UnauthorizedError('not to authorized to access this route!!!!');
  })
]);

//register validation
export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async email => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadrequestError('email already exists');
      }
    }),
  body('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('location is required'),
  body('lastName').notEmpty().withMessage('lastName is required')
]);

//login - validation
export const validateLoginInput = withValidationErrors([body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format'), body('password').notEmpty().withMessage('password is required')]);

export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      //if email exist
      const user = await User.findOne({ email });
      //if the req.user.userId and the user id are same
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('email already exists');
      }
    }),
  body('lastName').notEmpty().withMessage('last name is required'),
  body('location').notEmpty().withMessage('location is required')
]);
