import React, { useState } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-modal'
import { useCrudApiClient } from '../../apiClientProvider'

import style from './styles'

const DeleteModal = ({ pageData = [], url = '', pkField = 'id', index, callback }) => {
    const apiClient = useCrudApiClient()
    const [modalOpen, setIsOpen] = useState<boolean>(false)
    const [error, setErrorText] = useState<string>()

    function closeModal() {
        setIsOpen(false)
    }

    function handleDelete(event) {
        event.preventDefault()

        const deleteUrl = index == null ? url : `${url}${pageData[index].original[pkField]}/`

        apiClient
            .delete(deleteUrl)
            .then(() => {
                closeModal()
            })
            .catch(e => setErrorText(e.response.data.detail))

        callback()
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
                <FontAwesomeIcon icon={faTrashAlt} />
            </button>
            {index == null ? null : (
                <Modal isOpen={modalOpen} onRequestClose={closeModal} style={style.modal}>
                    {error ? <div style={style.error}>{error}</div> : null}
                    <form id="formDelete" onSubmit={handleDelete}>
                        <div>Delete selected entry?</div>
                        <div style={style.submitBlock}>
                            <button type="submit" style={style.submitBlockButton}>
                                Submit
                            </button>
                            <button onClick={closeModal} style={style.submitBlockButton}>
                                close
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    )
}

export default DeleteModal
