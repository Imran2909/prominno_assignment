import { Router } from 'express';
import { adminLoginController, sellerLoginController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema } from '../validations/auth.validation.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.post('/admin/login', validateRequest({ body: loginSchema }), asyncHandler(adminLoginController));
router.post('/seller/login', validateRequest({ body: loginSchema }), asyncHandler(sellerLoginController));

export default router;
