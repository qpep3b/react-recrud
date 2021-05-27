import React from 'react'
import Table from './Table'
import AddModal from './ModalAction/AddModal'
import EditModal from './ModalAction/EditModal'
import DeleteModal from './ModalAction/DeleteModal'
// import FilterModal from './ModalAction/FilterModal'

import { Column, PaginatedResponse } from './types'
import { getQuery } from '../api'

interface TableProps {
    columns: Column[]
    url: string // URL for getting and editing data by API
    add?: boolean // If you want table to be addable
    edit?: boolean // If you want table to be editable
    remove?: boolean // If you want table to be removable
    globalSearch?: boolean // If you want to enable searching through table
    filter?: boolean // If you want to enable filtering
    defaultSortField?: string
    defaultSortOrder?: string
    pkField?: string
    // For customization table
    extendRowParams?(row): Record<string, any>
    drawAddModal?(): JSX.Element
    drawEditModal?(): JSX.Element
    drawDeleteModal?(): JSX.Element
    drawFilterModal?(): JSX.Element
}

const CrudTable: React.FC<TableProps> = ({
    columns,
    url,
    add = true,
    edit = true,
    remove = true,
    globalSearch = false,
    filter = false,
    defaultSortField = 'id',
    defaultSortOrder = 'desc',
    pkField = 'id',
    extendRowParams = () => null,
    drawAddModal = ({ columns, url, callback }) => (
        <AddModal columns={columns} url={url} callback={callback} />
    ),
    drawEditModal = ({ columns, url, data, index, setIndex, callback, pkField }) => (
        <EditModal
            columns={columns}
            url={url}
            pageData={data}
            callback={callback}
            index={index}
            setIndex={setIndex}
            pkField={pkField}
        />
    ),
    drawDeleteModal = ({ url, data, index, callback, pkField }) => (
        <DeleteModal
            pageData={data}
            url={url}
            index={index}
            callback={callback}
            pkField={pkField}
        />
    ),
    // drawFilterModal = ({ columns, url, callback }) => (
    //     <FilterModal columns={columns} url={url} callback={callback} />
    // ),
}) => {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)

    const fetchData = React.useCallback(
        ({ pageSize, pageIndex, orderBy, order, searchQuery, filters }) => {
            setLoading(true)
            getQuery<PaginatedResponse<any[]>>(url, {
                page: pageIndex + 1,
                page_size: pageSize,
                order_by: orderBy,
                order,
                search_query: searchQuery ? searchQuery : null,
                filters: Object.keys(filters).length > 0 ? JSON.stringify(filters) : null,
            }).then(result => {
                setData(result.results)
                setPageCount(result.params.pages)
                setLoading(false)
            })
        },
        [url],
    )

    return (
        <div>
            <Table
                columns={columns}
                url={url}
                add={add}
                edit={edit}
                remove={remove}
                globalSearch={globalSearch}
                filter={filter}
                defaultSortField={defaultSortField}
                defaultSortOrder={defaultSortOrder}
                extendRowParams={extendRowParams}
                drawAddModal={drawAddModal}
                drawEditModal={drawEditModal}
                drawDeleteModal={drawDeleteModal}
                // drawFilterModal={drawFilterModal}
                data={data}
                loading={loading}
                pageCount={pageCount}
                fetchData={fetchData}
                pkField={pkField}
            />
        </div>
    )
}

export default CrudTable
