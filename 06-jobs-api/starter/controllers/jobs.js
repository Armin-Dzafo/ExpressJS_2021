const { StatusCodes } = require('http-status-codes');
const Job = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    });
    if (!job) {
        throw new NotFoundError(`No job with id of ${jobId} found`);
    }
    res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
    // we get the user id from the req.body
    req.body.createdBy = req.user.userId;
    // we create an instance of the model 'Job'
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId },
    } = req;

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty');
    }

    // find and update job
    // param1 -> where following conditions are met (filter object)
    // param2 -> what we are updating
    // param3 -> options (I wanna see the updated Job and pull it through validation)

    const job = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true },
    );
    if (!job) {
        throw new NotFoundError(`No job with id of ${jobId} found`);
    }
    res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndDelete({
        _id: jobId,
        createdBy: userId,
    });
    if (!job) {
        throw new NotFoundError(`No job with id of ${jobId} found`);
    }
    res.status(StatusCodes.OK).send();
};

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};
