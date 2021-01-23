import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@quangdvnnnn/common';

const router = express.Router();

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    const token = existingUser.generateAuthToken();
    req!.session!.token = token;
    console.log(req.sessionID)
    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
