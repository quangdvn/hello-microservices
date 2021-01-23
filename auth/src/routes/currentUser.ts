import express, { Request, Response } from 'express';
import { currentUser } from '@quangdvnnnn/common';

const router = express.Router();

router.get('/me', currentUser, (req: Request, res: Response) => {
  return res.status(200).send({ success: true, data: req.currentUser || null });
});

export { router as currentUserRouter };
