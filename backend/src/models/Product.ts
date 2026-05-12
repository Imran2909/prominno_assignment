import { Schema, model, type InferSchemaType, Types } from 'mongoose';

const brandSchema = new Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true
    },
    detail: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: true }
);

const productSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
      index: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    productDescription: {
      type: String,
      required: true,
      trim: true
    },
    brands: {
      type: [brandSchema],
      required: true,
      validate: {
        validator: (brands: unknown[]) => brands.length > 0,
        message: 'At least one brand is required'
      }
    }
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
};

export const Product = model('Product', productSchema);
