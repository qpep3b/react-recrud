import React, { useState } from 'react'
import Modal from 'react-modal'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'
import {useCrudApiClient} from '../../apiClientProvider'

import style from './modal.module.css'

Modal.setAppElement('#root')

function AddModal({ columns = [], url = '', callback = null }) {
    const apiClient = useCrudApiClient()
    const [error, setErrorText] = useState('')
    const [modalOpen, setIsOpen] = useState(false)
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

    function handleAdd(event) {
        event.preventDefault()
        const formData = new FormData()
        const multipleValuesCounter = {}
        columns.forEach(column => {
            if (!column.hidden) {
                if (column.editFormFields && column.editWidget) {
                    column.editFormFields.forEach(accessor => {
                        if (event.target[accessor] instanceof NodeList) {
                            if (!Object.keys(multipleValuesCounter).includes(accessor)) {
                                multipleValuesCounter[accessor] = 0
                            }
                            formData.append(
                                accessor,
                                event.target[accessor][multipleValuesCounter[accessor]].value,
                            )
                            multipleValuesCounter[accessor] += 1
                        } else {
                            formData.append(accessor, event.target[accessor].value)
                        }
                    })
                } else if (column.getFormData) {
                    column.getFormData(formData, event.target)
                } else {
                    formData.append(
                        column.accessor,
                        column.editType == 'checkbox'
                            ? event.target[column.accessor].checked
                            : event.target[column.accessor].value,
                    )
                    if (column.editType == 'file') {
                        formData.append(
                            `${column.accessor}_file`,
                            event.target[`${column.accessor}_file`].files[0],
                        )
                    }
                }
            }
        })

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        }
        apiClient.post(url, formData, config)
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
            <button
                className="btn-flat"
                onClick={e => {
                    e.preventDefault()
                    setIsOpen(true)
                }}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <Modal className={style.modal} isOpen={modalOpen} onRequestClose={closeModal}>
                {error ? <div className={style.error}>{error}</div> : null}
                <form onSubmit={handleAdd}>
                    {columns.map((column, i) => {
                        if (!column.hidden) {
                            return <ModalField key={i} column={column} />
                        } else {
                            return ''
                        }
                    })}
                    <div className={`right ${style.submitBlock}`}>
                        <button type="submit" className="btn">
                            Submit
                        </button>
                        <button onClick={closeModal} className="btn red lighten-2">
                            close
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default AddModal
