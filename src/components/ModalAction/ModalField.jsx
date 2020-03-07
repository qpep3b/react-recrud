import React from 'react'

function ModalField({column, value}) {
    var field

    switch (column.editType) {
        case "textarea":
            field = <textarea name={column.accessor} id={column.accessor} defaultValue={value}/>
            break
        case "select":
            field = (
                <select name={column.accessor} id={column.accessor}  defaultValue={value} className="browser-default">
                {column.editOptions.options.map((option, i) => {
                    return (
                        <option key={i}>
                            {option[0]}
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