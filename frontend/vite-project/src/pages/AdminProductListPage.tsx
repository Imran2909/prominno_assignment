import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { downloadAdminProductPdf, getAdminProducts } from '../api/adminApi';
import { getErrorMessage } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import type { Pagination as PaginationType, Product } from '../types/api';

const getTotalPrice = (product: Product): number => {
  return product.brands.reduce((sum, brand) => sum + Number(brand.price), 0);
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

  const handlePdf = async (product: Product): Promise<void> => {
    try {
      const blob = await downloadAdminProductPdf(product._id);
      const url = URL.createObjectURL(blob);
      const pdfWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (!pdfWindow) {
        toast.error('Popup blocked. Please allow popups to view the PDF.');
      }
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

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
                    <th>Description</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product._id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>{product.productName}</td>
                      <td>{product.productDescription}</td>
                      <td>Rs.{getTotalPrice(product).toFixed(2)}/-</td>
                      <td>
                        <button type="button" className="purple-button" onClick={() => void handlePdf(product)}>
                          <Download size={14} />
                          Download PDF
                        </button>
                      </td>
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
