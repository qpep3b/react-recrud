import React, { useState, useEffect, useCallback } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useHistory } from 'react-router-dom'
import { useParsedLocation } from '../hooks/urlHooks'

import { Column } from './types'

interface TableProps {
    data: Record<string, any>[]
    columns: Column[]
    hiddenColumns?: Column[]
    add: boolean
    edit: boolean
    remove: boolean
    globalSearch: boolean
    filter: boolean
    url: string

    fetchData(paginationParams): void
    extendRowParams(row): Record<string, any>

    loading: boolean
    pageCount: number
    defaultSortField: string
    defaultSortOrder: string
    pkField: string

    drawAddModal({ columns, url, callback }): void
    drawEditModal({ columns, url, data, index, setIndex, callback, pkField }): void
    drawDeleteModal({ url, data, index, callback, pkField }): void
    // drawFilterModal({ columns, url, callback }): void;
}

const Table: React.FC<TableProps> = ({
    columns,
    url,
    add,
    edit,
    remove,
    filter,
    globalSearch,
    defaultSortField,
    defaultSortOrder,
    pkField,
    drawAddModal,
    drawEditModal,
    drawDeleteModal,
    // drawFilterModal,
    extendRowParams,
    // special props
    data,
    loading,
    pageCount,
    fetchData,
    hiddenColumns = [],
}) => {
    const { path, urlParams } = useParsedLocation()
    const history = useHistory()

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        setPageSize,
        state: { pageSize, sortBy },
    } = useTable(
        {
            columns,
            data,
            initialState: {
                hiddenColumns: hiddenColumns,
                sortBy: [
                    {
                        id: defaultSortField,
                        desc: defaultSortOrder == 'desc',
                    },
                ],
                pageSize: urlParams.pageSize
                    ? parseInt(urlParams.pageSize)
                    : localStorage.getItem('tablePageSize')
                    ? localStorage.getItem('tablePageSize')
                    : 20,
            },
            manualPagination: true,
            manualSortBy: true,
        },
        useSortBy,
        usePagination,
    )

    const [pageIndex, setPageIndex] = useState(urlParams.page ? parseInt(urlParams.page) - 1 : 0)
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({})
    const [selectedIndex, setSelectedIndex] = useState()

    useEffect(() => {
        let order = defaultSortOrder
        let orderBy = defaultSortField
        if (sortBy[0]) {
            order = sortBy[0].desc ? 'desc' : 'asc'
            orderBy = sortBy[0].id
        }

        fetchData({ pageIndex, pageSize, orderBy, order, searchQuery, filters })
        setSelectedIndex(null)
    }, [fetchData, pageIndex, pageSize, sortBy, filters])

    useEffect(() => {
        history.push({
            pathname: path,
            search: `?page=${pageIndex + 1}&pageSize=${pageSize}`,
        })
    }, [pageIndex, pageSize])

    const onUpdate = useCallback(() => {
        let order = defaultSortOrder
        let orderBy = defaultSortField
        if (sortBy[0]) {
            order = sortBy[0].desc ? 'desc' : 'asc'
            orderBy = sortBy[0].id
        }

        fetchData({ pageIndex, pageSize, orderBy, order, searchQuery, filters })
        setSelectedIndex(null)
    }, [pageIndex, pageSize, sortBy, searchQuery, filters])

    const filtersCallback = newFilters => {
        setPageIndex(0)
        setFilters(newFilters)
    }

    const getTrProps = row => {
        const rowParams = {
            ...row.getRowProps(),
            ...extendRowParams(row),
        }

        if (row.index === selectedIndex) {
            rowParams.style={backgroundColor: 'yellow'}
        }

        return rowParams
    }

    const getCellPropsByColumn = (column, ...args) => {
        if (column.getCellProps) {
            return column.getCellProps(...args)
        }

        return {}
    }

    const handleEnterPress = event => {
        if (event.key === 'Enter') {
            setPageIndex(0)
            setSearchQuery(event.target.value)
            onUpdate()
        }
    }

    const renderControls = () => (
        <div>
            {add ? drawAddModal({ columns, url, callback: onUpdate }) : null}
            {edit
                ? drawEditModal({
                      columns,
                      url,
                      pkField,
                      data: page,
                      index: selectedIndex,
                      setIndex: setSelectedIndex,
                      callback: onUpdate,
                  })
                : null}
            {remove
                ? drawDeleteModal({
                      url,
                      pkField,
                      data: page,
                      index: selectedIndex,
                      callback: onUpdate,
                  })
                : null}
        </div>
    )

    return (
        <>
            {renderControls()}
            <div>
                <table {...getTableProps()} className="tbl-content">
                    <thead className="ant-table-thead">
                        {headerGroups.map((headerGroup, i) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                                {headerGroup.headers.map((column, i) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        key={i}
                                    >
                                        {column.render('Header')}
                                        {column.disableSortBy ? null : (
                                            <FontAwesomeIcon
                                                style={{
                                                    float: 'right',
                                                    alignSelf: 'center',
                                                }}
                                                icon={
                                                    column.isSorted
                                                        ? column.isSortedDesc
                                                            ? faSortDown
                                                            : faSortUp
                                                        : faSort
                                                }
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className="ant-table-tbody">
                        {page.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr
                                    {...getTrProps(row)}
                                    onClick={e => {
                                        e.preventDefault()
                                        setSelectedIndex(row.index)
                                    }}
                                    key={i}
                                >
                                    {row.cells.map((cell, i) => (
                                        <td
                                            {...cell.getCellProps(
                                                getCellPropsByColumn(cell.column, row),
                                            )}
                                            key={i}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="pagination row">
                <div className="col s3">
                    Show{' '}
                    <select
                        style={{
                            display: 'inline-block',
                            width: 'auto',
                            backgroundColor: '#fff',
                            margin: '0 5px',
                        }}
                        value={pageSize}
                        onChange={event => {
                            setPageIndex(0)
                            setPageSize(Number(event.target.value))
                            localStorage.setItem('tablePageSize', event.target.value)
                        }}
                    >
                        {[2, 10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </select>
                    elements
                </div>
                <div className="col s9">
                    <button onClick={() => setPageIndex(0)} disabled={!(pageIndex > 0)}>
                        {'<<'}
                    </button>{' '}
                    <button
                        onClick={() => setPageIndex(idx => idx - 1)}
                        disabled={!(pageIndex > 0)}
                    >
                        {'<'}
                    </button>{' '}
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageCount}
                        </strong>{' '}
                    </span>
                    <button
                        onClick={() => setPageIndex(idx => idx + 1)}
                        disabled={!(pageIndex < pageCount - 1)}
                    >
                        {'>'}
                    </button>{' '}
                    <button
                        onClick={() => setPageIndex(pageCount - 1)}
                        disabled={!(pageIndex < pageCount - 1)}
                    >
                        {'>>'}
                    </button>{' '}
                </div>
            </div>
        </>
    )
}

export default Table
