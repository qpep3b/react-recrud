# crud-react-table

Table widget for crud operations based on `react-table` package

## Usage
Let's imagine that you have Rest API server responding with following schema on `GET` some `/items` location
```ts
interface PaginatedResponse<T> {
    results: T[]
    params: {
        pages: number
    }
}
```
Also your server provides `POST /items` for creating data, `PATCH /items/:id` for updating data and `DELETE /items/:id` for deleting items 

Then you can use this package in your frontend
```js
import axios from 'axios'
import React from 'react'
import { BrowserRouter as Router, browserHistory } from 'react-router-dom'
import {CrudTable, CrudApiClientProvider} from 'crud-react-table'

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
```

Such widget will retrieve your data and automatically provide CRUD operations for `/items` viewset
