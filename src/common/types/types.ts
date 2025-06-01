import {Request} from "express";

export type RequestWithBody<T> = Request<T>

export type URIParamsModel = {
    id: string
    param: string
}

export type PaginationType<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

export type QueryFieldParamsTypes = {
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    searchNameTerm?: string;
    id?: string;
};

export type ParsedQueryParamsType = {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 1 | -1;
    searchNameTerm?: string;
    id?: string;
};

export type PayloadType ={
    userId: string;
    userLogin: string;
    tokenId: string
}