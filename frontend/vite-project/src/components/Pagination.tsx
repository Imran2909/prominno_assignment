import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination as PaginationType } from '../types/api';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const canGoBack = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;

  return (
    <div className="pagination">
      <button
        type="button"
        className="icon-button"
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={!canGoBack}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="page-chip">{pagination.page}</span>
      <button
        type="button"
        className="icon-button"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
