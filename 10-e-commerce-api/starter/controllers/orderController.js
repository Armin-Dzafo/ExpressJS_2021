const { StatusCodes } = require('http-status-codes');
const Product = require('../models/Product');
const Order = require('../models/Order');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
    const clientSecret = 'random';
    return { clientSecret, amount };
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ ordersCount: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
    }

    // req.user - user whos sending the request
    // user - id of the user who created the order
    checkPermissions(req.user, order.user);

    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
    const currentOrders = await Order.find({
        user: req.user.userId,
    });
    res.status(StatusCodes.OK).json({ count: currentOrders.length, currentOrders });
};

const createOrder = async (req, res) => {
    // console.log(req.body);
    const { items: cartItems, tax, shippingFee } = req.body;

    // console.log(cartItems.length);

    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No items in cart');
    }

    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError('Please provide tax and shipping fee');
    }

    let orderItems = [];
    let subtotal = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of cartItems) {
        // eslint-disable-next-line no-await-in-loop
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw CustomError.NotFoundError(`No product with id: ${item.product}`);
        }
        const {
            name, price, image, _id,
        } = dbProduct;

        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subtotal += item.amount * price;
    }

    // calculate total
    const total = tax + shippingFee + subtotal;
    // get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });

    // create order
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.clientSecret,
        user: req.user.userId,
    });

    res.status(StatusCodes.OK).json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
    }

    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
};
