/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

// const agg = [
//     {
//         $match: {
//             product: new ObjectId('61ee90b2915b16268596cbc2'),
//         },
//     }, {
//         $group: {
//             _id: null,
//             averageRating: {
//                 $avg: '$rating',
//             },
//             numOfReviews: {
//                 $sum: 1,
//             },
//         },
//     },
// ];

// MongoClient.connect(
//     '',
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     (connectErr, client) => {
//         assert.equal(null, connectErr);
//         const coll = client.db('').collection('');
//         coll.aggregate(agg, (cmdErr, result) => {
//             assert.equal(null, cmdErr);
//         });
//         client.close();
//     },
// );
