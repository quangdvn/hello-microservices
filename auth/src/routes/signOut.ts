import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/signout', (req: Request, res: Response) => {
  req.session!.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ success: false });
    }
    res.clearCookie('qid');
    return res.status(200).send({ success: true });
  });
});

export { router as signOutRouter };
