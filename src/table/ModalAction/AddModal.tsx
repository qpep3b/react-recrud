import React, { useState } from 'react'
import BaseModal from './BaseModal'
import ActionButton from './ActionButton'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'
import { useCrudApiClient } from '../../apiClientProvider'

import style from './styles'
import { Column } from '../types'
import { getContentType, getFormData, getJsonData } from './utils/contentTypes'

interface AddModalProps {
    columns: Column[]
    url: string
    callback?(): void
    sendJson?: boolean
}

const AddModal: React.FC<AddModalProps> = ({
    columns = [],
    url = '',
    callback = null,
    sendJson = false,
}) => {
    const apiClient = useCrudApiClient()
    const [error, setErrorText] = useState<string>('')
    const [modalOpen, setIsOpen] = useState<boolean>(false)
    const [openCounter, setOpenCounter] = useState<number>(0)

    function buildErrorText(error) {
        let errMsg = ''

        for (const field in error.response.data) {
            errMsg += `${field}: ${error.response.data[field]}\n`
        }

        return errMsg
    }

    function closeModal() {
        setIsOpen(false)
        setErrorText('')
    }

    const handleAdd = event => {
        event.preventDefault()

        const requestData = sendJson
            ? getJsonData(event.target, columns)
            : getFormData(event.target, columns)

        const requestConfig = {
            headers: { 'content-type': getContentType(sendJson) },
        }
        apiClient
            .post(url, requestData, requestConfig)
            .then(() => {
                closeModal()
                setOpenCounter(openCounter => openCounter + 1)
            })
            .catch(e => setErrorText(buildErrorText(e)))

        if (callback) {
            callback()
        }
    }

    return (
        <>
            <ActionButton onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faPlus} />
            </ActionButton>
            <BaseModal isOpen={modalOpen} onRequestClose={closeModal}>
                {error ? <div style={style.error}>{error}</div> : null}
                <form onSubmit={handleAdd}>
                    {columns.map((column, i) => {
                        if (!column.hidden) {
                            return <ModalField key={i} column={column} />
                        } else {
                            return ''
                        }
                    })}
                    <div style={style.submitBlock}>
                        <button type="submit" style={style.submitBlockButton}>
                            Submit
                        </button>
                        <button onClick={closeModal} style={style.submitBlockButton}>
                            close
                        </button>
                    </div>
                </form>
            </BaseModal>
        </>
    )
}

export default AddModal
