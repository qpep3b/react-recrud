import React, { useState, useRef, useEffect } from 'react'
import { Row } from 'react-table'
import Modal from 'react-modal'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'
import { useCrudApiClient } from '../../apiClientProvider'

import style from './styles'
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

    // Refs for simulating triggering jsx elements
    const formElement = useRef<HTMLFormElement>(null)
    const submitButton = useRef<HTMLButtonElement>(null)
    const saveAndContinueButton = useRef<HTMLButtonElement>(null)
    const cancelButton = useRef<HTMLButtonElement>(null)

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

    function handleEdit(event) {
        event.preventDefault()

        const editUrl = `${url}${editableData[pkField]}/`
        const requestData = sendJson
            ? getJsonData(formElement.current, columns)
            : getFormData(formElement.current, columns)

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
            ? getJsonData(formElement.current, columns)
            : getFormData(formElement.current, columns)

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
            <button
                disabled={index == null}
                onClick={e => {
                    e.preventDefault()
                    setIsOpen(true)
                }}
            >
                <FontAwesomeIcon icon={faEdit} />
            </button>
            {index == null ? null : (
                <Modal style={style.modal} isOpen={modalOpen} onRequestClose={closeModal}>
                    <form onSubmit={handleEdit} ref={formElement}>
                        {error ? <div style={style.error}>{error}</div> : null}
                        {columns.map((column, i) => {
                            const fieldKey = `edit:${editableData[pkField]}:${i}`
                            if (!column.hidden) {
                                return (
                                    <ModalField
                                        key={fieldKey}
                                        column={column}
                                        value={editableData[column.accessor]}
                                    />
                                )
                            } else {
                                return (
                                    <input
                                        key={fieldKey}
                                        type="hidden"
                                        name={column.accessor}
                                        id={column.accessor}
                                    />
                                )
                            }
                        })}
                        <div style={style.submitBlock}>
                            <button
                                disabled={!(index > 0)}
                                onClick={handlePreviousRow}
                                style={style.submitBlockButton}
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </button>
                            <button
                                disabled={!(index < pageData.length - 1)}
                                onClick={handleNextRow}
                                style={style.submitBlockButton}
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </button>
                            <button
                                type="submit"
                                style={style.submitBlockButton}
                                disabled={!(index < pageData.length - 1)}
                                ref={submitButton}
                            >
                                Save
                            </button>
                            <button ref={saveAndContinueButton} onClick={handleSaveAndContinue}>
                                Save and continue
                            </button>
                            <button
                                onClick={closeModal}
                                style={style.submitBlockButton}
                                ref={cancelButton}
                            >
                                close
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    )
}

export default EditModal
