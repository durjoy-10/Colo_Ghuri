import { useState, useCallback } from 'react';

export const usePagination = (initialPage = 1, initialPageSize = 12) => {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / pageSize);

    const nextPage = useCallback(() => {
        if (page < totalPages) setPage(p => p + 1);
    }, [page, totalPages]);

    const prevPage = useCallback(() => {
        if (page > 1) setPage(p => p - 1);
    }, [page]);

    const goToPage = useCallback((pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) setPage(pageNum);
    }, [totalPages]);

    return {
        page,
        pageSize,
        total,
        totalPages,
        setPage,
        setPageSize,
        setTotal,
        nextPage,
        prevPage,
        goToPage
    };
};