import React, { useState, useRef, useEffect } from 'react'
import { Row } from 'react-table'
import ActionButton from './ActionButton'
import BaseModal from './BaseModal'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'
import { useCrudApiClient } from '../../apiClientProvider'

import { Column } from '../types'
import { getContentType, getFormData, getJsonData } from './utils/contentTypes'

interface EditModalProps {
    columns: Column[]
    pageData: Row[]
    url: string
    pkField?: string
    callback?(): void
    index?: number
    setIndex(fn: (newIndex: number) => number): void
    sendJson?: boolean
}

const EditModal: React.FC<EditModalProps> = ({
    columns = [],
    pageData = [],
    url = '',
    pkField = 'id',
    sendJson = false,
    callback,
    index,
    setIndex,
}) => {
    const apiClient = useCrudApiClient()
    const [modalOpen, setIsOpen] = useState<boolean>(false)
    const [error, setErrorText] = useState<string>('')
    const [editableData, setEditableData] = useState<Object>(
        index == null ? {} : pageData[index].original,
    )

    useEffect(() => {
        if (!(index == null)) {
            setEditableData(pageData[index].original)
        }
    }, [index])

    function closeModal() {
        setIsOpen(false)
        setErrorText('')
    }

    function buildErrorText(error) {
        let errMsg = ''

        for (const field in error.response.data) {
            errMsg += `${field}: ${error.response.data[field]}\n`
        }

        return errMsg
    }

    function handleEdit(event: React.FormEvent) {
        event.preventDefault()

        const editUrl = `${url}${editableData[pkField]}/`
        const requestData = sendJson
            ? getJsonData(event.target as HTMLFormElement, columns)
            : getFormData(event.target as HTMLFormElement, columns)

        const requestConfig = {
            headers: {
                'content-type': getContentType(sendJson),
            },
        }
        apiClient
            .patch(editUrl, requestData, requestConfig)
            .then(() => {
                closeModal()
            })
            .catch(e => setErrorText(buildErrorText(e)))

        callback()
    }

    function handleSaveAndContinue(event) {
        event.preventDefault()

        const editUrl = `${url}${editableData[pkField]}/`
        const requestData = sendJson
            ? getJsonData(event.target as HTMLFormElement, columns)
            : getFormData(event.target as HTMLFormElement, columns)

        const requestConfig = {
            headers: {
                'content-type': getContentType(sendJson),
            },
        }
        apiClient
            .patch(editUrl, requestData, requestConfig)
            .then(() => {
                setIndex(idx => idx + 1)
            })
            .catch(e => setErrorText(buildErrorText(e)))

        callback()
    }

    const handleNextRow = event => {
        event.preventDefault()

        setIndex(idx => idx + 1)
    }

    const handlePreviousRow = event => {
        event.preventDefault()

        setIndex(idx => idx - 1)
    }

    return (
        <>
            <ActionButton disabled={index == null} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faEdit} />
            </ActionButton>
            {index == null ? null : (
                <BaseModal isOpen={modalOpen} onRequestClose={closeModal} title="Edit Row">
                    <form onSubmit={handleEdit}>
                        {error ? (
                            <div className="react-recrud-modal-error-message">{error}</div>
                        ) : null}
                        {columns.map((column, i) => {
                            const fieldKey = `edit:${editableData[pkField]}:${i}`
                            if (column.hidden)
                                return (
                                    <input
                                        key={fieldKey}
                                        type="hidden"
                                        name={column.accessor}
                                        id={column.accessor}
                                    />
                                )

                            return (
                                <ModalField
                                    key={fieldKey}
                                    column={column}
                                    value={editableData[column.accessor]}
                                />
                            )
                        })}
                        <div className="react-recrud-modal-controls-block">
                            <button
                                disabled={!(index > 0)}
                                onClick={handlePreviousRow}
                                className="react-recrud-modal-control-button"
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </button>
                            <button
                                disabled={!(index < pageData.length - 1)}
                                onClick={handleNextRow}
                                className="react-recrud-modal-control-button"
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </button>
                            <button
                                type="submit"
                                className="react-recrud-modal-control-button"
                                disabled={!(index < pageData.length - 1)}
                            >
                                Save
                            </button>
                            <button
                                onClick={handleSaveAndContinue}
                                className="react-recrud-modal-control-button"
                            >
                                Save and continue
                            </button>
                            <button
                                onClick={closeModal}
                                className="react-recrud-modal-control-button"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </BaseModal>
            )}
        </>
    )
}

export default EditModal
