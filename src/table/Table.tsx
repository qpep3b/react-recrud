import React, { useState, useEffect, useCallback } from 'react'
import { useTable, useSortBy, usePagination, Column as RTColumn } from 'react-table'
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort'
import { faSortUp } from '@fortawesome/free-solid-svg-icons/faSortUp'
import { faSortDown } from '@fortawesome/free-solid-svg-icons/faSortDown'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Column } from './types'

interface TableProps {
    data: Record<string, any>[]
    columns: Column[]
    hiddenColumns?: Column[]
    add: boolean
    edit: boolean
    remove: boolean
    url: string

    fetchData(paginationParams): void
    extendRowParams(row): Record<string, any>

    loading: boolean
    pageCount: number
    defaultSortField: string
    defaultSortOrder: string
    pkField: string
    sendJsonData: boolean

    drawAddModal({ columns, url, callback, sendJson }): void
    drawEditModal({ columns, url, data, index, setIndex, callback, pkField, sendJson }): void
    drawDeleteModal({ url, data, index, callback, pkField }): void
    // drawFilterModal({ columns, url, callback }): void;
}

const Table: React.FC<TableProps> = ({
    columns,
    url,
    add,
    edit,
    remove,
    defaultSortField,
    defaultSortOrder,
    pkField,
    sendJsonData,
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
                pageSize: 20,
            },
            manualPagination: true,
            manualSortBy: true,
        },
        useSortBy,
        usePagination,
    )

    const [pageIndex, setPageIndex] = useState<number>(0)
    const [selectedIndex, setSelectedIndex] = useState()

    useEffect(() => {
        let order = defaultSortOrder
        let orderBy = defaultSortField
        if (sortBy[0]) {
            order = sortBy[0].desc ? 'desc' : 'asc'
            orderBy = sortBy[0].id
        }

        fetchData({ pageIndex, pageSize, orderBy, order })
        setSelectedIndex(null)
    }, [fetchData, pageIndex, pageSize, sortBy])

    const onUpdate = useCallback(() => {
        let order = defaultSortOrder
        let orderBy = defaultSortField
        if (sortBy[0]) {
            order = sortBy[0].desc ? 'desc' : 'asc'
            orderBy = sortBy[0].id
        }

        fetchData({ pageIndex, pageSize, orderBy, order })
        setSelectedIndex(null)
    }, [pageIndex, pageSize, sortBy])

    const tableProps = () => {
        const defaultTableProps = {
            style: {
                borderCollapse: 'collapse',
            },
        }
        return {
            ...defaultTableProps,
            ...getTableProps(),
        }
    }

    const getTrProps = row => {
        const rowParams = {
            ...row.getRowProps(),
            ...extendRowParams(row),
        }

        if (row.index === selectedIndex) {
            rowParams.style = { backgroundColor: 'yellow' }
        }

        return rowParams
    }

    const getHeaderCellPropsByColumn = (column: RTColumn, ...args) => {
        const defaultHeaderCellProps = {
            style: {
                border: '1px solid gray',
                padding: '10px',
                backgroundColor: '#eee',
                cursor: 'pointer',
            },
        }

        return {
            ...column.getHeaderProps(column.getSortByToggleProps()),
            ...defaultHeaderCellProps,
        }
    }

    const getCellPropsByColumn = (column: RTColumn, ...args) => {
        const defaultCellProps = {
            style: {
                border: '1px solid gray',
                padding: '10px',
            },
        }
        if (column.getCellProps) {
            return {
                ...defaultCellProps,
                ...column.getCellProps(...args),
            }
        }

        return defaultCellProps
    }

    const renderControls = () => (
        <div>
            {add
                ? drawAddModal({ columns, url, callback: onUpdate, sendJson: sendJsonData })
                : null}
            {edit
                ? drawEditModal({
                      columns,
                      url,
                      pkField,
                      data: page,
                      index: selectedIndex,
                      setIndex: setSelectedIndex,
                      callback: onUpdate,
                      sendJson: sendJsonData,
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

    const renderHeaderCell = (column: RTColumn, i: number) => (
        <th {...getHeaderCellPropsByColumn(column)} key={i}>
            {column.render('Header')}
            {column.disableSortBy ? null : (
                <FontAwesomeIcon
                    style={{
                        float: 'right',
                        alignSelf: 'center',
                    }}
                    icon={column.isSorted ? (column.isSortedDesc ? faSortDown : faSortUp) : faSort}
                />
            )}
        </th>
    )

    const renderTableCell = (row, cell, i: number) => (
        <td {...cell.getCellProps(getCellPropsByColumn(cell.column, row))} key={i}>
            {cell.render('Cell')}
        </td>
    )

    return (
        <>
            {renderControls()}
            <div>
                <table {...tableProps()} className="tbl-content">
                    <thead>
                        {headerGroups.map((headerGroup, i) => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                                {headerGroup.headers.map((column, i) =>
                                    renderHeaderCell(column, i),
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
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
                                    {row.cells.map((cell, i) => renderTableCell(row, cell, i))}
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
