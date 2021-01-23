import mongoose, { Document, Model, Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//* Properties required to create a new Ticket
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

//* Properties a Ticket Document (sigle Ticket) has
export interface TicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
  createdAt: string;
  version: number;
  orderId?: string;
}

//* Properties a Ticket Model (All collection) has
interface TicketModel extends Model<TicketDocument> {
  build(attributes: TicketAttributes): TicketDocument;
}

const ticketSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'tickets',
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = function (attributes: TicketAttributes) {
  return new Ticket(attributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
