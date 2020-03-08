import React from 'react'

function ModalField({column, value}) {
    var field

    switch (column.editType) {
        case "textarea":
            field = <textarea name={column.accessor} id={column.accessor} defaultValue={value}/>
            break
        case "select":
            if (!column.editValues) {
                alert("You have select field with no options!")
            }
            field = (
                <select name={column.accessor} id={column.accessor}  defaultValue={value} className="browser-default">
                {column.editValues.map((option, i) => {
                    return (
                        <option key={i} value={option.value}>
                            {option.text}
                        </option>
                    )
                })}
                </select>
            )
            break
        default:
            field = <input name={column.accessor} id={column.accessor} defaultValue={value}/>
            break
    }

    return (
        <div>
            {field}
            <label htmlFor={column.accessor}>{column.Header}</label>
        </div>
    )
}

export default ModalField