---
layout: default
title:  "Table properties"
url: table-propeerties
order: 3
---
| Name | Type | Default | Description |
| -- | ---- | --- | ------ |
| columns | `Column[]` | required option | List of columns |
| url | `string `| required option | Root url to your data collection |
| add | `boolean` | `true` | Ability to add rows in table |
| edit | `boolean` | `true` | Ability to edit rows in table |
| remove | `boolean` | `true` | Ability to remove rows in table |
| defaultSortField | `string` | `'id'` | docs coming soon...|
| defaultSortOrder | `string` | `'desc'` | docs coming soon...|
| pkField | `string` | `'id'` | Field which value will be attached to your root url for update and delete operations|
| sendJsonData | `boolean` | `false` | If set `true` then sends `POST` and `PATCH` requests with `content-type: application/json`. By default sends `multipart/form-data`|
