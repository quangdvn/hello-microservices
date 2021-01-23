import mongoose, { Document, Model, Schema } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

//* Properties required to create a new Ticket
interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

//* Properties a Ticket Document (single Ticket) has
export interface TicketDocument extends Document {
  title: string;
  price: number;
  version: number;
  createdAt: string;
  isReserved(): Promise<boolean>;
}

//* Properties a Ticket Model (All collection) has
interface TicketModel extends Model<TicketDocument> {
  build(attributes: TicketAttributes): TicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
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
      min: 0,
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
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};

ticketSchema.statics.findByEvent = function (event: {
  id: string;
  version: number;
}) {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.methods.isReserved = async function <TicketDocument>() {
  let curTicket = (this as unknown) as TicketDocument;
  const existingOrder = (await Order.findOne({
    ticket: curTicket,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Complete,
        OrderStatus.PaymentPending,
      ],
    },
  })) as OrderDocument;

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Ticket',
  ticketSchema
);

export { Ticket };
