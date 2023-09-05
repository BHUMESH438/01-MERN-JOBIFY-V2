import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import Job from '../models/JobModel.js';
import cloudinary from 'cloudinary';
import { promises as fs } from 'fs';
import { formatImage } from '../middleware/multerMiddleware.js';
//promises act as a await

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  //convert objId string to json obj
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStatus = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
  //just in case if the password in the obj exist remove it
  const obj = { ...req.body };
  delete obj.password; //if we accedentally included password in the react input
  //imge check
  if (req.file) {
    const file = formatImage(req.file); //upload to cloudinary from the local path
    const cloudinary_response = await cloudinary.v2.uploader.upload(file);
    //including the new property in obj - dot notation
    obj.avatar = cloudinary_response.secure_url;
    obj.avatarPublicId = cloudinary_response.public_id;
  }
  //destory previously stored image in the cloudinary
  const old_updated_User = await User.findByIdAndUpdate(req.user.userId, obj);
  //input form update - file & imageupdate - destory old-updateUser.avatarPublicId
  //if the user uploaded a file and image then there will be the image id so we can destroy it.
  if (req.file && old_updated_User.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(old_updated_User.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: 'user updated' });
};
