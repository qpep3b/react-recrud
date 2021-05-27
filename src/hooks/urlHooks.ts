import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

interface UrlParams {
    page: string
    pageSize: string
}

interface UrlParsedParams {
    path: string
    urlParams: UrlParams
}

function flattenIfRequired<T>(value: T[] | T): T {
    return Array.isArray(value) ? value[0] : value
}

export const useParsedLocation = (): UrlParsedParams => {
    const url = useLocation()
    console.log(url)
    const { page, pageSize } = queryString.parse(url.search)

    return {
        path: url.pathname,
        urlParams: {
            page: flattenIfRequired(page),
            pageSize: flattenIfRequired(pageSize),
        },
    }
}
