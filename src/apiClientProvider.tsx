import React, { createContext, useContext } from 'react'
import { AxiosInstance } from 'axios'

const ApiClientContext = createContext<AxiosInstance>(null)

interface ApiClientContextProps {
    client: AxiosInstance
    children: React.Component[]
}

export const CrudApiClientProvider: React.FC<ApiClientContextProps> = ({ client, children }) => {
    return <ApiClientContext.Provider value={client}>{children}</ApiClientContext.Provider>
}

export const useCrudApiClient = (): AxiosInstance => {
    const apiClient = useContext<AxiosInstance>(ApiClientContext)

    if (!apiClient) {
        throw new Error('No api client provided!')
    }

    return apiClient
}
