import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000',
})

export function getQuery<T>(url: string, params = {}): Promise<T> {
    return api
        .get(url, { params })
        .then(({ data }) => data)
        .catch(Promise.reject)
}

export default api
