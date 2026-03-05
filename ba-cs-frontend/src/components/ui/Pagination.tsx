import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number | null;
  to: number | null;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
  className,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  // Build visible page window (max 5 pages centered on current)
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | '...')[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(lastPage - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (range[0] > 2) rangeWithDots.push('...');
  rangeWithDots.push(...range);
  if (range[range.length - 1] < lastPage - 1) rangeWithDots.push('...');

  const pages: (number | '...')[] = [1, ...rangeWithDots, lastPage];

  const btnBase =
    'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D5C73] focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-40';

  return (
    <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:justify-between', className)}>
      {/* Count info */}
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium">{from ?? 0}</span>–
        <span className="font-medium">{to ?? 0}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <button
          className={cn(btnBase, 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50')}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        {/* Prev */}
        <button
          className={cn(btnBase, 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50')}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className="inline-flex h-8 w-8 items-center justify-center text-sm text-gray-500">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                btnBase,
                page === currentPage
                  ? 'bg-[#0D5C73] text-white ring-1 ring-[#0D5C73]'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          className={cn(btnBase, 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50')}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        {/* Last */}
        <button
          className={cn(btnBase, 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50')}
          onClick={() => onPageChange(lastPage)}
          disabled={currentPage === lastPage}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
