import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';
export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  //setting if the role is given or not
  req.body.role = isFirstAccount ? 'admin' : 'user';
  //setting and resetting the #password
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user registerd and created' });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new UnauthenticatedError('email not registerd');
  const isPasswordCorrect = await comparePassword(req.body.password, user.password);
  if (!isPasswordCorrect) throw new UnauthenticatedError('password did not match');
  const oneDay = 1000 * 60 * 60 * 24;
  //intoken we pass the user info - jwt
  const token = createJWT({ userId: user._id, role: user.role });
  //in cookie we pass the user data via jwt token and  how long it will expire
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(StatusCodes.CREATED).json({ msg: 'user logged in' });
};

//2nd parameter replace the cookie value in the respective 1st parameter token named "token"'s value.
//we can sinmply pass '' emptystring also
export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
