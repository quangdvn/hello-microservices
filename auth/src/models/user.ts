import mongoose, { Document, Model, Schema } from 'mongoose';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

//* Properties required to create a new User
interface UserAttributes {
  email: string;
  password: string;
}

//* Properties a User Document (sigle user) has
interface UserDocument extends Document {
  email: string;
  password: string;
  generateAuthToken(): string;
}

//* Properties a User Model (All collection) has
interface UserModel extends Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

const userSchema: Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

userSchema.pre('save', async function (next) {
  let user = this;
  //* only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  try {
    const hashed = await Password.toHash(user.get('password'));
    user.set('password', hashed);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.generateAuthToken = function () {
  let user = this;
  const token = jwt.sign(
    { id: user._id, email: user.email },
    `${process.env.JWT_KEY}`
  );
  return token;
};

userSchema.statics.build = function (attributes: UserAttributes) {
  return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
