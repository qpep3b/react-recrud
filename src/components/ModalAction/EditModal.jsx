import React, {useState} from 'react'
import Modal from 'react-modal'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'

import style from './modal.module.css'

const EditModal = function({columns=[], data={}, url=''}) {
    const [modalOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function handleEdit(event) {
        event.preventDefault()
        let formData = {}
        columns.map(column => {
            if (!column.hidden) {
                formData[column.accessor] = event.target[column.accessor].value
            }
        })
        // here can write PATCH or PUT request
        console.log("EDIT " + data.id)
        console.log(formData)
    }

    return (
        <>
            <button className={Object.keys(data).length ? "btn-flat" : "btn-flat disabled"} onClick={e => {
                e.preventDefault()
                setIsOpen(true)
            }}>
                <FontAwesomeIcon icon={faEdit}/>
            </button>
        <Modal
            className={style.modal}
            isOpen={modalOpen}
            onRequestClose={closeModal}
        >
            <form onSubmit={handleEdit}>
           {
                columns.map((column, i) => {
                    if (!column.hidden) {
                        return (
                            <ModalField key={i} column={column} value={data[column.accessor]} />
                        )
                    }
                    else {
                        return <input key={i} type="hidden" name={column.accessor} id={column.accessor}/>
                    }
                })
            }
            <div>
                <button type="submit" className="btn">Submit</button>
                <button onClick={closeModal} className="btn">close</button>
            </div>
            </form>
        </Modal>
        </>
    )
}

export default EditModal