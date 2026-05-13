import { Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { deleteSeller, getSellers } from '../api/adminApi';
import { getErrorMessage } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import type { Pagination as PaginationType, Seller } from '../types/api';

export function SellerListPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadSellers = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const data = await getSellers(pagination.page, pagination.limit);
      setSellers(data.items);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [pagination.limit, pagination.page]);

  useEffect(() => {
    void loadSellers();
  }, [loadSellers]);

  const handleDeleteSeller = async (seller: Seller): Promise<void> => {
    const confirmed = window.confirm(`Delete ${seller.name}? This will also delete this seller's products.`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteSeller(seller._id);
      toast.success('Seller deleted successfully');
      if (sellers.length === 1 && pagination.page > 1) {
        setPagination((current) => ({ ...current, page: current.page - 1 }));
      } else {
        await loadSellers();
      }
    } catch (error) {
      const message = getErrorMessage(error);

      if (message.toLowerCase().includes('seller not found')) {
        toast.success('Seller already removed');
        await loadSellers();
        return;
      }

      toast.error(message);
    }
  };

  return (
    <section className="page-stack">
      <div className="section-title">List</div>

      <div className="panel">
        <div className="table-actions">
          <span />
          <Link to="/admin/sellers/new" className="success-button">
            <Plus size={15} />
            New
          </Link>
        </div>

        {isLoading ? (
          <div className="loading">Loading sellers...</div>
        ) : sellers.length === 0 ? (
          <EmptyState title="No sellers yet" message="Create the first seller account from the Add button." />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone No</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller, index) => (
                    <tr key={seller._id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>{seller.name}</td>
                      <td>{seller.email}</td>
                      <td>{seller.mobileNo}</td>
                      <td>{seller.gender}</td>
                      <td>
                        <button type="button" className="danger-icon" onClick={() => void handleDeleteSeller(seller)} aria-label="Delete seller">
                          <Trash2 size={14} />
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
