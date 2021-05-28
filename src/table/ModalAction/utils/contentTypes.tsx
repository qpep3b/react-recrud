import { Column } from '../../types'

export const getContentType = (isJsonType: boolean): string => {
    return isJsonType ? 'application/json' : 'multipart/form-data'
}

export const getFormData = (eventForm: HTMLFormElement, columns: Column[]): FormData => {
    const formData = new FormData()
    const multipleValuesCounter = {}
    columns.forEach(column => {
        if (!column.hidden) {
            if (column.editFormFields && column.editWidget) {
                column.editFormFields.forEach(accessor => {
                    if (eventForm[accessor] instanceof NodeList) {
                        if (!Object.keys(multipleValuesCounter).includes(accessor)) {
                            multipleValuesCounter[accessor] = 0
                        }
                        formData.append(
                            accessor,
                            eventForm[accessor][multipleValuesCounter[accessor]].value,
                        )
                        multipleValuesCounter[accessor] += 1
                    } else {
                        formData.append(accessor, eventForm[accessor].value)
                    }
                })
            } else if (column.getFormData) {
                column.getFormData(formData, eventForm)
            } else {
                formData.append(
                    column.accessor,
                    column.editType == 'checkbox'
                        ? eventForm[column.accessor].checked
                        : eventForm[column.accessor].value,
                )
                if (column.editType == 'file') {
                    formData.append(
                        `${column.accessor}_file`,
                        eventForm[`${column.accessor}_file`].files[0],
                    )
                }
            }
        }
    })

    return formData
}

export const getJsonData = (eventForm: HTMLFormElement, columns: Column[]): Object => {
    const jsonData = {}

    const multipleValuesCounter = {}
    columns.forEach(column => {
        if (!column.hidden) {
            if (column.editFormFields && column.editWidget) {
                column.editFormFields.forEach(accessor => {
                    if (eventForm[accessor] instanceof NodeList) {
                        if (!Object.keys(jsonData).includes(accessor)) {
                            jsonData[accessor] = []
                        }
                        if (!Object.keys(multipleValuesCounter).includes(accessor)) {
                            multipleValuesCounter[accessor] = 0
                        }
                        jsonData[accessor].push(
                            eventForm[accessor][multipleValuesCounter[accessor]].value,
                        )
                        multipleValuesCounter[accessor] += 1
                    } else {
                        jsonData[accessor] = eventForm[accessor].value
                    }
                })
            } else if (column.getJsonData) {
                column.getJsonData(jsonData, eventForm)
            } else {
                jsonData[column.accessor] =
                    column.editType == 'checkbox'
                        ? eventForm[column.accessor].checked
                        : eventForm[column.accessor].value
            }
        }
    })

    return jsonData
}
