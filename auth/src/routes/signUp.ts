import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@quangdvnnnn/common';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build({ email, password });
    await user.save();

    const token = user.generateAuthToken();
    req!.session!.token = token;
    return res.status(201).send({ success: true, data: user });
  }
);

export { router as signUpRouter };
