import mongoose, { Document, Model, Schema } from 'mongoose';

//* Properties required to create a new Ticket
interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

//* Properties a Ticket Document (sigle Ticket) has
export interface PaymentDocument extends Document {
  orderId: string;
  stripeId: string;
}

//* Properties a Ticket Model (All collection) has
interface PaymentModel extends Model<PaymentDocument> {
  build(attributes: PaymentAttributes): PaymentDocument;
}

const paymentSchema: Schema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'payments',
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = function (attributes: PaymentAttributes) {
  return new Payment(attributes);
};

const Payment = mongoose.model<PaymentDocument, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
