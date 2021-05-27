import React, { useState } from "react"
import Modal from "react-modal"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ModalField from "./ModalField"

import style from "./modal.module.css"

Modal.setAppElement("#root")

function AddModal({ columns = [], url = "" }) {
    const [modalOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false)
    }

    function handleAdd(event) {
        event.preventDefault()
        var formData = columns.reduce(function (map, column) {
            if (!column.hidden) {
                map[column.accessor] = event.target[column.accessor].value
                return map
            }
            return {}
        }, {})
        // columns.forEach(column => {
        //     if (!column.hidden) {
        //         formData[column.accessor] = event.target[column.accessor].value
        //     }
        // })
        // here can write POST request to url
        console.log("ADD")
        console.log(formData)
    }

    return (
        <>
            <button
                className="btn-flat"
                onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(true)
                }}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
            <Modal className={style.modal} isOpen={modalOpen} onRequestClose={closeModal}>
                <form onSubmit={handleAdd}>
                    {columns.map((column, i) => {
                        if (!column.hidden) {
                            return <ModalField key={i} column={column} />
                        } else {
                            return ""
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
