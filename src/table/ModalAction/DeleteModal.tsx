import React, { useState } from 'react'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BaseModal from './BaseModal'
import ActionButton from './ActionButton'
import { useCrudApiClient } from '../../apiClientProvider'

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
            <ActionButton disabled={index == null} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faTrashAlt} />
            </ActionButton>
            {index == null ? null : (
                <BaseModal isOpen={modalOpen} onRequestClose={closeModal} title="Delete Row">
                    {error ? <div className="react-recrud-modal-error-message">{error}</div> : null}
                    <form id="formDelete" onSubmit={handleDelete}>
                        <div>Delete selected entry?</div>
                        <div className="react-recrud-modal-controls-block">
                            <button type="submit" className="react-recrud-modal-control-button">
                                Yes
                            </button>
                            <button
                                onClick={closeModal}
                                className="react-recrud-modal-control-button"
                            >
                                No
                            </button>
                        </div>
                    </form>
                </BaseModal>
            )}
        </>
    )
}

export default DeleteModal
