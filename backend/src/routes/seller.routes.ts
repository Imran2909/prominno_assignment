import { Router } from 'express';
import {
  createProductController,
  deleteProductController,
  listProductsController,
  productPdfController
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { paginationSchema } from '../validations/common.validation.js';
import { createProductSchema, productIdParamSchema } from '../validations/product.validation.js';

const router = Router();

router.use(authMiddleware, roleMiddleware('seller'));

router.post('/products', validateRequest({ body: createProductSchema }), asyncHandler(createProductController));
router.get('/products', validateRequest({ query: paginationSchema }), asyncHandler(listProductsController));
router.get('/products/:id/pdf', validateRequest({ params: productIdParamSchema }), asyncHandler(productPdfController));
router.delete('/products/:id', validateRequest({ params: productIdParamSchema }), asyncHandler(deleteProductController));

export default router;
