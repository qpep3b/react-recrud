import React from 'react'
import Table from './Table'
import AddModal from './ModalAction/AddModal'
import EditModal from './ModalAction/EditModal'
import DeleteModal from './ModalAction/DeleteModal'
// import FilterModal from './ModalAction/FilterModal'

import { Column, PaginatedResponse } from './types'
import { useCrudApiClient } from '../apiClientProvider'

interface TableProps {
    columns: Column[]
    url: string // URL for getting and editing data by API
    add?: boolean // If you want table to be addable
    edit?: boolean // If you want table to be editable
    remove?: boolean // If you want table to be removable
    defaultSortField?: string
    defaultSortOrder?: string
    pkField?: string
    sendJsonData?: boolean
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
    defaultSortField = 'id',
    defaultSortOrder = 'desc',
    pkField = 'id',
    sendJsonData = false,
    extendRowParams = () => null,
    drawAddModal = ({ columns, url, callback, sendJson }) => (
        <AddModal columns={columns} url={url} callback={callback} sendJson={sendJson} />
    ),
    drawEditModal = ({ columns, url, data, index, setIndex, callback, pkField, sendJson }) => (
        <EditModal
            columns={columns}
            url={url}
            pageData={data}
            callback={callback}
            index={index}
            setIndex={setIndex}
            pkField={pkField}
            sendJson={sendJson}
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
    const apiClient = useCrudApiClient()
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [pageCount, setPageCount] = React.useState(0)

    const fetchData = React.useCallback(
        ({ pageSize, pageIndex, orderBy, order }) => {
            setLoading(true)
            apiClient
                .get<any, { data: PaginatedResponse<any[]> }>(url, {
                    params: {
                        page: pageIndex + 1,
                        page_size: pageSize,
                        order_by: orderBy,
                        order,
                    },
                })
                .then(({ data }) => {
                    setData(data.results)
                    setPageCount(data.params.pages)
                    setLoading(false)
                })
        },
        [url],
    )

    return (
        <div id="recrud-content-wrapper">
            <Table
                columns={columns}
                url={url}
                add={add}
                edit={edit}
                remove={remove}
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
                sendJsonData={sendJsonData}
            />
        </div>
    )
}

export default CrudTable
