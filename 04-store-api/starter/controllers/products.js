const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const search = 'bed';
  const products = await Product.find({
    name: { $regex: search, $options: 'i' },
  });
  // throw new Error('testing async errors');
  // eslint-disable-next-line no-unreachable
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // limit what we search for
  const { featured, company, name } = req.query;
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
  // if this is an empty object, all elements will be returned
  console.log(queryObject);
  const products = await Product.find(queryObject);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
