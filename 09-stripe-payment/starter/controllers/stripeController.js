const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeController = async (req, res) => {
    const { purchase, total_amount, shipping_fee } = req.body;

    // normally, you would iterate through the items in the db and
    // check if the item IDs and prices match
    // because the user can easily manipulate the values on the front-end
    const calculateOrderAmount = () => {
        return total_amount + shipping_fee;
    };

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;
