const { Schema, model } = require('mongoose');

// const authorSchema = new Schema( // won't have an id in this case because stored/embedded in a book
//   {
//     name: String,
//     country: String,
//     favFood: String
//   },
// );
// const bookSchema = new Schema(
//   {
//     title: String,
//     description: String,
//     author: authorSchema, // single embedded document
//     authors: [authorSchema], // array of emebedded documents
//     rating: Number
//   },
//   {
//     timestamps: true
//   }
// );

/*************************/
/* normalized data model */
/*************************/

// const mongoose = require('mongoose');
// const authorSchema = new Schema(
//   {
//     name: String,
//     country: String,
//     favFood: String
//   },
// );
// const bookSchema = new Schema(
//   {
//     title: String,
//     description: String,
//     author: { // single reference
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Author'
//     },
//     authors: [{ // multiple references
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Author'
//     }],
//     rating: Number
//   },
//   {
//     timestamps: true
//   }
// );
// module.exports = model('Book', bookSchema);

const bookSchema = new Schema(
  {
    title: String,
    description: String,
    author: { // single reference
      type: Schema.Types.ObjectId, // using Schema directly because already imported
      ref: 'Author'
    },
    authors: [{ // multiple references
      type: Schema.Types.ObjectId, // using Schema directly because already imported
      ref: 'Author'
    }],
    rating: Number
  },
  {
    timestamps: true
  }
);
module.exports = model('Book', bookSchema);