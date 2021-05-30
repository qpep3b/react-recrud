import React from 'react'
import { Column } from '../types'

const getFieldByColumn = (column: Column, value: any): JSX.Element => {
    switch (column.editType) {
        case 'textarea':
            return (
                <textarea
                    className="react-recrud-textarea-element react-recrud-form-item"
                    name={column.accessor}
                    id={column.accessor}
                    defaultValue={value}
                    rows={5}
                />
            )
        case 'select':
            if (!column.editValues) {
                alert('You have select field with no options!')
            }
            return (
                <select
                    className="react-recrud-select-element react-recrud-form-item"
                    name={column.accessor}
                    id={column.accessor}
                    defaultValue={value}
                >
                    {column.editValues.map((option, i) => {
                        return (
                            <option key={i} value={option.value}>
                                {option.text}
                            </option>
                        )
                    })}
                </select>
            )
        default:
            return (
                <input
                    className="react-recrud-input-element react-recrud-form-item"
                    name={column.accessor}
                    id={column.accessor}
                    defaultValue={value}
                />
            )
    }
}

interface ModalFieldProps {
    column: Column
    value?: any
}

const ModalField: React.FC<ModalFieldProps> = ({ column, value = null }) => {
    return (
        <div>
            <label htmlFor={column.accessor}>{column.Header}</label>
            {getFieldByColumn(column, value)}
        </div>
    )
}

export default ModalField
