import { useState } from 'react';

const usePageState = () => {
    const [currentPage, setCurrentPage] = useState(null);

    const setPage = (page) => {
        setCurrentPage(page);
    };

    return { currentPage, setPage };
};

export default usePageState;
