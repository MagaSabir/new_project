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