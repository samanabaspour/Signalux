import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemLabel?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 8,
  itemLabel = 'مورد',
  className = ''
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show (with ellipsis if needed)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : currentPage * itemsPerPage;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-amber-500/20 my-8 ${className}`}>
      {/* Item Range / Status Counter */}
      {totalItems !== undefined && (
        <div className="text-xs font-mono text-amber-200/70">
          نمایش <span className="text-amber-400 font-bold">{startItem}</span> تا{' '}
          <span className="text-amber-400 font-bold">{endItem}</span> از مجموع{' '}
          <span className="text-white font-bold">{totalItems}</span> {itemLabel}
        </div>
      )}

      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-2">
        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] text-xs font-bold border transition-all cursor-pointer ${
            currentPage === 1
              ? 'bg-[#121017]/40 border-amber-500/10 text-zinc-600 cursor-not-allowed'
              : 'bg-[#121017] border-amber-500/30 text-amber-100 hover:text-white hover:border-amber-400 hover:bg-amber-500/10'
          }`}
          aria-label="صفحه قبلی"
        >
          <ChevronRight className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">صفحه قبلی</span>
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1.5">
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-zinc-500 font-mono text-xs">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 rounded-[5px] text-xs font-mono font-bold flex items-center justify-center border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#121017] border-amber-500/20 text-amber-100/80 hover:text-white hover:border-amber-400/50 hover:bg-amber-500/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[5px] text-xs font-bold border transition-all cursor-pointer ${
            currentPage === totalPages
              ? 'bg-[#121017]/40 border-amber-500/10 text-zinc-600 cursor-not-allowed'
              : 'bg-[#121017] border-amber-500/30 text-amber-100 hover:text-white hover:border-amber-400 hover:bg-amber-500/10'
          }`}
          aria-label="صفحه بعدی"
        >
          <span className="hidden sm:inline">صفحه بعدی</span>
          <ChevronLeft className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
