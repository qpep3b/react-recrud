import React, { useState, useRef, useEffect } from 'react'
import Modal from 'react-modal'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ModalField from './ModalField'
import {useCrudApiClient} from '../../apiClientProvider'

import style from './modal.module.css'

const EditModal = function ({ 
    columns = [],
    pageData = [],
    url = "",
    pkField = "id",
    callback,
    index,
    setIndex,
 }) {
    const apiClient = useCrudApiClient()
    const [modalOpen, setIsOpen] = useState<boolean>(false);
    const [error, setErrorText] = useState<string>("");
    const [editableData, setEditableData] = useState<Object>(index == null ? {} : pageData[index].original);

    // Refs for simulating triggering jsx elements
    const formElement = useRef(null);
    const submitButton = useRef(null);
    const saveAndContinueButton = useRef(null);
    const cancelButton = useRef(null);

    useEffect(() => {
        if (!(index == null)) {
            setEditableData(pageData[index].original);
        }
    }, [index]);

    function closeModal() {
        setIsOpen(false);
        setErrorText("");
    }

    function buildErrorText(error) {
        let errMsg = "";

        for (const field in error.response.data) {
            errMsg += `${field}: ${error.response.data[field]}\n`;
        }

        return errMsg;
    }

    const getFormData = () => {
        const formData = new FormData();
        const multipleValuesCounter = {};
        columns.forEach((column) => {
            if (!column.hidden && column.editable) {
                if (column.editFormFields && column.editWidget) {
                    column.editFormFields.forEach((accessor) => {
                        if (formElement.current[accessor] instanceof NodeList) {
                            if (!Object.keys(multipleValuesCounter).includes(accessor)) {
                                multipleValuesCounter[accessor] = 0;
                            }
                            formData.append(
                                accessor,
                                formElement.current[accessor][multipleValuesCounter[accessor]].value
                            );
                            multipleValuesCounter[accessor] += 1;
                        } else {
                            formData.append(accessor, formElement.current[accessor].value);
                        }
                    });
                } else if (column.getFormData) {
                    column.getFormData(formData, formElement.current);
                } else {
                    formData.append(
                        column.accessor,
                        column.editType == "checkbox"
                            ? formElement.current[column.accessor].checked
                            : formElement.current[column.accessor].value
                    );
                    if (column.editType == "file") {
                        formData.append(
                            `${column.accessor}_file`,
                            formElement.current[`${column.accessor}_file`].files[0]
                        );
                    }
                }
            }
        });

        return formData;
    };

    function handleEdit(event) {
        event.preventDefault();
        const formData = getFormData();

        const editUrl = `${url}${editableData[pkField]}/`;

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        apiClient.patch(editUrl, formData, config)
            .then(() => {
                closeModal();
            })
            .catch((e) => setErrorText(buildErrorText(e)));

        callback();
    }

    function handleEditNext(event) {
        event.preventDefault();
        const formData = getFormData();

        const editUrl = `${url}${editableData[pkField]}/`;

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        apiClient.patch(editUrl, formData, config)
            .then(() => {
                setIndex(idx => idx + 1);
            })
            .catch((e) => setErrorText(buildErrorText(e)));

        callback();
    }

    const handleCmdEnterPress = (event) => {
        if (modalOpen) {
            if (event.key === "Enter" && event.ctrlKey) {
                event.preventDefault();
                saveAndContinueButton.current.click();
            } else if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitButton.current.click();
            } else if (event.key === "Escape") {
                event.preventDefault();
                cancelButton.current.click();
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleCmdEnterPress);

        return () => {
            document.removeEventListener("keydown", handleCmdEnterPress);
        };
    });

    const handleNextRow = (event) => {
        event.preventDefault();

        setIndex(idx => idx + 1);
    };

    const handlePreviousRow = (event) => {
        event.preventDefault();

        setIndex(idx => idx - 1);
    };

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
            { index == null ? null : (
                <Modal className={style.modal} isOpen={modalOpen} onRequestClose={closeModal}>
                    <form onSubmit={handleEdit}>
                        {error ? <div className={style.error}>{error}</div> : null}
                        {columns.map((column, i) => {
                            if (!column.hidden) {
                                return (
                                    <ModalField key={i} column={column} value={editableData[column.accessor]} />
                                )
                            } else {
                                return (
                                    <input
                                        key={i}
                                        type="hidden"
                                        name={column.accessor}
                                        id={column.accessor}
                                    />
                                )
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
            )}
        </>
    )
}

export default EditModal
