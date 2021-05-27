const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const data = Array.from(Array(500).keys()).map(i => {
    return {
        id: i + 1,
        url: `site-${i + 1}.com`,
        type: 'type1',
    }
})

const paginationParams = req => {
    const page = Number(req.query.page) || 0
    const pageSize = Number(req.query.page_size)

    return { page, pageSize }
}

const paginatedResponse = (page, pageSize, data) => {
    if (!page) page = 1
    if (!pageSize) {
        return {
            params: {
                page: 1,
                pages: 1,
            },
            results: data,
        }
    }
    return {
        params: {
            page: page,
            pages: data.length / pageSize,
        },
        results: data.slice((page - 1) * pageSize, page * pageSize),
    }
}

app.get('/items', (req, res) => {
    const { page, pageSize } = paginationParams(req)

    res.json(paginatedResponse(page, pageSize, data))
})

app.post(`*`, (req, res) => {
    res.json({ status: 'Ok' })
})

app.put(`*`, (req, res) => {
    res.json({ status: 'Ok' })
})

app.patch(`*`, (req, res) => {
    res.json({ status: 'Ok' })
})

app.delete(`*`, (req, res) => {
    res.json({ status: 'Ok' })
})

app.listen(5000, function () {
    console.log('App listening on port 5000!')
})
