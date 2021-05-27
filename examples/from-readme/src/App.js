import axios from 'axios'
import React from 'react'
import { BrowserRouter as Router, browserHistory } from 'react-router-dom'
import { CrudTable, CrudApiClientProvider } from 'react-recrud'

const api = axios.create({
    baseURL: 'http://localhost:5000',
})

function getColumns() {
    return [
        {
            Header: 'ID',
            accessor: 'id',
            hidden: true,
            width: 70,
        },
        {
            Header: 'Domain',
            accessor: 'url',
            disableSortBy: true,
        },
        {
            Header: 'Comment',
            accessor: 'comment',
            editType: 'textarea',
        },
        {
            Header: 'type',
            accessor: 'type',
            editType: 'select',
            editValues: [
                {
                    text: 'type1',
                    value: 'type1',
                },
                {
                    text: 'type2',
                    value: 'type2',
                },
            ],
        },
    ]
}

function App() {
    return (
        <CrudApiClientProvider client={api}>
            <Router history={browserHistory}>
                <CrudTable url="items/" columns={getColumns()} hiddenColumns={['comment']} />
            </Router>
        </CrudApiClientProvider>
    )
}

export default App
