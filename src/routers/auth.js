import express from 'express';
import passport from '../middlewares/passport.js';
import { register, login, refresh, logout, sendResetEmail, resetUserPassword} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody, registerSchema, loginSchema, sendResetEmailSchema, resetPasswordSchema } from '../utils/validate.js';


const router = express.Router();

router.use(passport.initialize());

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/confirm-google-auth',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    const { accessToken, refreshToken } = await login(req.user.email, null, true);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in with Google!',
      data: { accessToken },
    });
  }
);

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', ctrlWrapper(refresh));
router.post('/logout', ctrlWrapper(logout));
router.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmail));
router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetUserPassword));

export default router;
