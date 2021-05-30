# react-recrud

Table providing CRUD operations with RESTful API based on `react-table`

[![npm](https://img.shields.io/npm/dt/react-recrud)](https://www.npmjs.com/package/react-recrud)
<<<<<<< HEAD
[![bundlephobia](https://badgen.net/bundlephobia/minzip/react-recrud@0.0.5)](https://bundlephobia.com/result?p=react-recrud@0.0.5)
=======
[![bundlephobia](https://badgen.net/bundlephobia/minzip/react-recrud@0.0.4)](https://bundlephobia.com/result?p=react-recrud@0.0.4)
>>>>>>> 990d4ebcf3e509491c50f0c28d282251740c55e1

## Installation

```sh
npm install react-recrud
```

## Usage
Let's imagine that you have RESTful API server responding with following schema on `GET` some `/items` location
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
import { CrudTable, CrudApiClientProvider } from 'react-recrud'
import 'react-recrud/lib/style.css' // Insert this line to apply default styles

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
            Header: 'Type',
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
            <CrudTable url="items/" columns={getColumns()} />
        </CrudApiClientProvider>
    )
}

export default App
```

Such widget will retrieve your data and automatically provide CRUD operations for `/items` viewset
