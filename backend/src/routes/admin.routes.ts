import { Router } from 'express';
import { adminProductPdfController, listAllProductsController } from '../controllers/product.controller.js';
import { createSellerController, deleteSellerController, listSellersController } from '../controllers/seller.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParamSchema, paginationSchema } from '../validations/common.validation.js';
import { createSellerSchema } from '../validations/seller.validation.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.post('/sellers', validateRequest({ body: createSellerSchema }), asyncHandler(createSellerController));
router.get('/sellers', validateRequest({ query: paginationSchema }), asyncHandler(listSellersController));
router.get('/products', validateRequest({ query: paginationSchema }), asyncHandler(listAllProductsController));
router.get('/products/:id/pdf', validateRequest({ params: idParamSchema }), asyncHandler(adminProductPdfController));
router.delete('/sellers/:id', validateRequest({ params: idParamSchema }), asyncHandler(deleteSellerController));

export default router;
