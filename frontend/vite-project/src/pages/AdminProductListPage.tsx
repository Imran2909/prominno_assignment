import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminProducts } from '../api/adminApi';
import { getErrorMessage } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import type { Pagination as PaginationType, Product } from '../types/api';

const getTotalPrice = (product: Product): number => {
  return product.brands.reduce((sum, brand) => sum + Number(brand.price), 0);
};

const getSellerName = (product: Product): string => {
  if (!product.sellerId) {
    return 'Deleted seller';
  }

  return typeof product.sellerId === 'string' ? 'Seller' : product.sellerId.name;
};

export function AdminProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async (): Promise<void> => {
      setIsLoading(true);

      try {
        const data = await getAdminProducts(pagination.page, pagination.limit);
        setProducts(data.items);
        setPagination(data.pagination);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, [pagination.page, pagination.limit]);

  return (
    <section className="page-stack">
      <div className="section-title">Product</div>

      <div className="panel">
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <EmptyState title="No products yet" message="Seller-created products will appear here." />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Seller</th>
                    <th>Description</th>
                    <th>Brands</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>{product.productName}</td>
                      <td>{getSellerName(product)}</td>
                      <td>{product.productDescription}</td>
                      <td>{product.brands.length}</td>
                      <td>Rs.{getTotalPrice(product).toFixed(2)}/-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <select
                value={pagination.limit}
                onChange={(event) =>
                  setPagination((current) => ({ ...current, page: 1, limit: Number(event.target.value) }))
                }
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <Pagination pagination={pagination} onPageChange={(page) => setPagination((current) => ({ ...current, page }))} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
