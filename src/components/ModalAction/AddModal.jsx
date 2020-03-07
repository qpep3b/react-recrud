import React, {useState} from 'react'
import Modal from 'react-modal'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'

import style from './modal.module.css'

Modal.setAppElement('#root')

function AddModal({columns=[]}) {
    const [modalOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <>
            <button className="btn-flat" onClick={e => {
                e.preventDefault()
                setIsOpen(true)
            }}>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        <Modal
            className={style.modal}
            isOpen={modalOpen}
            onRequestClose={closeModal}
        >   
            {
                columns.map((column, i) => {
                    if (!column.hidden) {
                        return (
                            <ModalField key={i} column={column} />
                        )
                    }
                    else {
                        return ''
                    }
                })
            }
            <div>
                <button type="submit" className="btn">Submit</button>
                <button onClick={closeModal} className="btn">close</button>
            </div>
        </Modal>
        </>
    )
}

export default AddModal