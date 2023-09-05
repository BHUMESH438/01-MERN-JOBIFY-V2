import job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';

export const createJob = async (req, res) => {
  //obj notation - including a new obj in the existin obj
  req.body.createdBy = req.user.userId; //tying create job with specifilc user
  const create = await job.create(req.body);
  res.status(StatusCodes.CREATED).json({ create });
};

export const getAllJob = async (req, res) => {
  //it will find all the job tiedup with the userId of the req.user.userId from the authmiddleware, while logged in that specific route has single id
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId
  };
  //we use or to match the least condition
  if (search) {
    queryObject.$or = [
      {
        position: { $regex: search, $options: 'i' }
      },
      {
        company: { $regex: search, $options: 'i' }
      }
    ];
  }

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  //values are in the schema
  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position'
  };

  //looking for the sort key [] in sortoption object
  const sortKey = sortOptions[sort] || sortOptions.newest;

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const getall = await job.find(queryObject).sort(sortKey).skip(skip).limit(limit);
  const totalJobs = await job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, currentPage: page, getall });
};

export const getSingleJob = async (req, res) => {
  const getSingle = await job.findById(req.params.id);
  res.status(StatusCodes.OK).json({ getSingle });
};

export const updateJob = async (req, res) => {
  const jobedit = await job.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.status(StatusCodes.OK).json({ msg: 'job modified', jobedit });
};

export const deleteJob = async (req, res) => {
  const del = await job.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ del });
};

export const showStats = async (req, res) => {
  let stats = await job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId)
      }
    },
    {
      $group: {
        _id: '$jobStatus',
        count: { $sum: 1 }
      }
    }
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0
  };

  let monthlyApplications = await job.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        '_id.year': -1,
        '_id.month': -1
      }
    },
    {
      $limit: 6
    }
  ]);
  monthlyApplications = monthlyApplications
    .map(item => {
      const {
        _id: { year, month },
        count
      } = item;
      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date, count };
    })
    .reverse();
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
