import { Router } from 'express';
import { listAllProductsController } from '../controllers/product.controller.js';
import { createSellerController, listSellersController } from '../controllers/seller.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { paginationSchema } from '../validations/common.validation.js';
import { createSellerSchema } from '../validations/seller.validation.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.post('/sellers', validateRequest({ body: createSellerSchema }), asyncHandler(createSellerController));
router.get('/sellers', validateRequest({ query: paginationSchema }), asyncHandler(listSellersController));
router.get('/products', validateRequest({ query: paginationSchema }), asyncHandler(listAllProductsController));

export default router;
