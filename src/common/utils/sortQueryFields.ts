import {ParsedQueryParamsType, QueryFieldParamsTypes} from "../types/types";


export const sortQueryFields = (query: QueryFieldParamsTypes): ParsedQueryParamsType => {
    const pageNumber = Number(query.pageNumber)
    const pageSize = Number(query.pageSize)

    return {
        pageNumber: isNaN(pageNumber) ? 1 : pageNumber,
        pageSize: isNaN(pageSize) ? 10 : pageSize,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection === 'asc' ? 1 : -1,
        ...(query.searchNameTerm ? { searchNameTerm: query.searchNameTerm } : {}),
    }
}

