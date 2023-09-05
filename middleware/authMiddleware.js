import { BadrequestError, UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import { verifyJWT } from '../utils/verifyToken.js';

export const authenticateUser = (req, res, next) => {
  //check the token in the req
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('authentication invalid,token not found in req.cookies');
  }
  //verify the token jwt by password
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === '64f22a2568f6a9cd27bd777b'; //returns true
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};

//if test user throw bad req eror
export const checkForTestUser = (req, res, next) => {
  //if test user exist then this check will make those route block
  if (req.user.testUser) {
    throw new BadrequestError('Demo User. Read Only!');
  }
  next();
};
