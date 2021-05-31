---
layout: default
title:  "Column properties"
url: column-properties
order: 4
---
`react-recrud` package is based on [react-table](https://react-table.tanstack.com) so it supports [default column properties](https://react-table.tanstack.com/docs/api/useTable#column-options).

But `react-recrud` has some additional useful properties

## Custom representation in table
It is basic `react-table` functionality, read the [react-table documentation](https://react-table.tanstack.com/docs/api/useTable#column-options)

## Edit widget in modal
There are available some default editTypes such as:
* textarea
* select

To use `textarea` widget you should set `editType: 'textarea'` in your column definitons.

Example:
```js
```
To use `select` widget you should set `editType: 'textarea'` and also provide `editValues` property. `editValues` has schema like that
```ts
interface EditValue {
    value: string | number;
    text: string;
}

export interface Column {
    // ... other column properties
    editValues?: EditValue[];
}
```

Example:
```js
function getColumns() {
    return [
        {
            Header: 'Select value',
            accessor: 'select_value',
            editType: 'select',
            editValues: [
                {
                    text: 'type1',
                    value: 'type1',
                },
                {
                    text: 'type2',
                    value: 'type2',
                },
            ],
        },
    ]
}
```

## Custom editing widget
If you want to customize edit widget in modal window, you may follow next steps:
* define `editWidget` in your column
* define `getFormData` (or `getJsonData` if `sendJsonData` property is set in your table)

`editWidget` property has signature:
```ts
editWidget(value): JSX.Element
```
It takes value by accessor in your row data.

`getFormData` (or `getJsonData`) has signature:
```ts
getFormData(formData: FormData, submitForm: HTMLFormElement);
getJsonData?(jsonData: Object, submitForm: HTMLFormElement);
```
in this function your may collect your data and insert into form

## Big example
Let's create a `boolean` column with representation in cell like `Yes/No` and `checkbox` edit widget

```tsx
const formatBoolean = (value: boolean): string => (
  value ? 'Yes' : 'No'
)

const getColumns = () => [
  {
    Header: 'Boolean Value',
    accessor: 'booleanValue',
    Cell: ({row: {values: {booleanValue}}}) => {
      return <>{booleanValue}</>;
    },
    editWidget: (value: boolean) => (
      <div>
          <label for='booleanValue'>Boolean Value</label>
          <input type="checkbox" defaultChecked={booleanValue} />
      </div>
    ),
    getFormData: (formData, submitForm) => {
      formData.append('booleanValue', submitForm['booleanValue'].checked)
    },
    // or for JSON
    getFormData: (jsonData, submitForm) => {
      jsonData['booleanValue'] = submitForm['booleanValue'].checked
    },
  }
]
```