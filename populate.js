import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Job from './models/JobModel.js';
import User from './models/UserModel.js';

try {
  await mongoose.connect(process.env.MONGO_URL);
  //fetching the user details from the db
  const user = await User.findOne({ email: 'cbhumesh438@gamil.com' });
  // const user = await User.findOne({ email: 'test@test.com' });
  //findone returns the whole property so from that user_id can be extracted
  //fetching the json data and parsing it to js obj and the json parse will parese the string data to array
  const jsonJobs = JSON.parse(await readFile(new URL('./utils/mockData.json', import.meta.url)));
  //populate the jobs in db for admin user and test user by destructureing the job instance in map and adding the created by property
  const jobs = jsonJobs.map(job => {
    return { ...job, createdBy: user._id };
  });
  //before creating the populated job we should delete the job created by the user
  await Job.deleteMany({ createdBy: user._id });
  //inject the populated jobs in the create
  await Job.create(jobs);
  console.log('success!!!');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
