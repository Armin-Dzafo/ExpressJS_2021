const Product = require('../models/product');

// MANUAL SETUP
const getAllProductsStatic = async (req, res) => {
    // find string in 'name'
    // const search = 'ing';
    // const products = await Product.find({
    //   name: { $regex: search, $options: 'i' },
    // });

    // sort by name desc and by price asc
    // const products = await Product.find({}).sort('-name price');

    // show only selected properties
    // const products = await Product.find({}).select('name price');

    // limit to a certain # of items (pagination)
    // const products = await Product.find({})
    //   .sort('name')
    //   .select('name price')
    //   .limit(10)
    //   .skip(1);

    // numeric filters
    const products = await Product.find({ price: { $gt: 30 } })
        .sort('price')
        .select('name price');

    // throw new Error('testing async errors');
    res.status(200).json({ products, nbHits: products.length });
};

// PRODUCTION-GRADE SETUP
const getAllProducts = async (req, res) => {
    // limit what we search for
    const {
        featured, company, name, sort, customDisplay, numericFilters,
    } = req.query;
    const queryObject = {};
    // if featured is an attribute in the object, use it it query
    if (featured) {
        queryObject.featured = featured;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: 'bed', $options: 'i' };
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };
        const regEx = /\b(<|<=|=|>=|>)\b/g;
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`,
        );

        // properties that have 'Number' values
        const options = ['price', 'rating'];
        // eslint-disable-next-line no-unused-vars
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) };
            }
        });
        // console.log(filters);
    }

    console.log(queryObject);

    // find by 'name'. 'featured' and 'company'
    // if this is an empty object, all elements will be returned
    // const products = await Product.find(queryObject);

    // sort by 'name' and 'price'
    let result = Product.find(queryObject);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    // display only selected attributes with 'select' method
    if (customDisplay) {
        const displayList = customDisplay.split(',').join(' ');
        result = result.select(displayList);
    }

    // pagination
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 10;
    // const skip = (page - 1) * limit;
    // result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
    getAllProductsStatic,
    getAllProducts,
};
