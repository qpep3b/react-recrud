import React, { useState } from 'react'
import { useTable, useSortBy, usePagination, useBlockLayout, useResizeColumns } from 'react-table'
import { faTrashAlt, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddModal from './ModalAction/AddModal'
import EditModal from './ModalAction/EditModal'

import style from './Table.module.css'

function Table({ columns, data, add = true, edit = true, remove = true, url = ''}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
        },
        useBlockLayout,
        useResizeColumns,
        useSortBy,
        usePagination,
    )

    const [selectedData, setSelected] = useState({})

    function handleDelete() {
        console.log(selectedData)
    }

    function renderControls() {
        return (
            <div className="left">
                { add ?
                    <AddModal columns={columns} url={url}/> : null
                }
                {edit ?
                    <EditModal columns={columns} data={selectedData} url={url}/> : null
                }
                {remove ?
                    <button className={Object.keys(selectedData).length ? "btn-flat" : "btn-flat disabled"} onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button> : null
                }
            </div>
        )
    }

    return (
        <>
        <div className={style.container}>
            {renderControls()}
            <table {...getTableProps()} className="highlight">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {column.disableSortBy ? null :
                                    <FontAwesomeIcon className={column.isSorted ? "right" : "right grey-text text-lighten-2"}
                                        icon={column.isSorted
                                            ? column.isSortedDesc
                                                ? faSortDown
                                                : faSortUp
                                            : faSort
                                        }
                                    />
                                    }
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}
                                    onClick={e => {
                                        e.preventDefault()
                                        setSelected(row.original)
                                    }
                                    }
                                    className={
                                        row.original.id === selectedData.id ? style.selected : null
                                    }
                                >
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
            <br />
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    className="browser-default"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[2, 10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
        </>
    )
}

export default Table