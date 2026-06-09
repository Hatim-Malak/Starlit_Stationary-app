import { useState, useCallback } from 'react';

/**
 * Custom hook for managing pagination state.
 * @param {Object} options - Options object.
 * @param {number} options.initialPage - The initial page number.
 * @param {number} options.initialLimit - The initial items per page limit.
 * @returns {Object} Pagination state and control functions.
 */
export function usePagination({ initialPage = 1, initialLimit = 12 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const setTotal = useCallback((count, newLimit = limit) => {
    setTotalItems(count);
    if (newLimit !== limit) {
      setLimit(newLimit);
    }
  }, [limit]);

  const nextPage = useCallback(() => {
    setPage(prev => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage(prev => (prev > 1 ? prev - 1 : prev));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotalItems(0);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    totalPages,
    totalItems,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
    reset
  };
}
