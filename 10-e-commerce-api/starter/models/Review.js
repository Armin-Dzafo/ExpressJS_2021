const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please provide rating'],
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Please provide title'],
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, 'Please provide review text'],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    { timestamps: true },
);

// check if user already left review for specific product (model version)
// allow user to leave only 1 review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// static method can be called on the model itself, as opposed to only an instance
ReviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: {
                product: productId,
            },
        }, {
            $group: {
                _id: null,
                averageRating: {
                    $avg: '$rating',
                },
                numOfReviews: {
                    $sum: 1,
                },
            },
        },
    ]);
    console.log(result);
    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
            },
        );
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

// ReviewSchema.post('remove', async function() {
//     console.log('post remove hook called');
// });

module.exports = mongoose.model('Review', ReviewSchema);
