const { StatusCodes } = require('http-status-codes');
const Review = require('../models/Review');
const Product = require('../models/Product');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
    const { product: productId } = req.body;
    const { userId } = req.user;

    const isValidProduct = await Product.findOne({ _id: productId });

    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }

    // check if user already left review for specific product (controller version)
    const hasAlreadyReviewed = await Review.findOne({
        product: productId,
        // user: req.user.userId,
        user: userId,
    });

    if (hasAlreadyReviewed) {
        throw new CustomError.BadRequestError('Already submitted review for this priduct');
    }

    // req.body.user = req.user.userId;
    req.body.user = userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({})
        .populate({
            path: 'user',
            select: 'name',
        })
        .populate({
            path: 'product',
            select: 'name company price',
        });
    res.status(StatusCodes.OK).json({ reviewCount: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId })
        .populate({
            path: 'user',
            select: 'name',
        });
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }
    res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();
    res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });
    if (!review) {
        throw new CustomError.NotFoundError(`No review with id: ${reviewId}`);
    }

    checkPermissions(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ msg: 'Review deleted' });
};

// alternative way of setting up querying of review of a product
const getSingleProductReviews = async (req, res) => {
    // first check for product id
    const { id: productId } = req.params;

    // get reviews that belong to a certain product
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews,
};
