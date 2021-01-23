import { OrderStatus } from '@quangdvnnnn/common';
import mongoose, { Document, Model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

//* Properties required to create a new Ticket
interface OrderAttributes {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

//* Properties a Ticket Document (sigle Ticket) has
export interface OrderDocument extends Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

//* Properties a Ticket Model (All collection) has
interface OrderModel extends Model<OrderDocument> {
  build(attributes: OrderAttributes): OrderDocument;
}

const orderSchema: Schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = function (attributes: OrderAttributes) {
  return new Order({
    _id: attributes.id,
    version: attributes.version,
    price: attributes.price,
    userId: attributes.userId,
    status: attributes.status,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema);

export { Order };
