---
layout: default
title:  "Integrating with your API"
url: "integrating-with-your-api"
---
Now `react-recrud` package doesn't provide customization for retrieving list of items from your backend.

Your API should return data corresponding this schema
```ts
interface PaginatedResponse<T> {
    results: T[]  // List of items
    params: {     // Pagination params
        pages: number
        // You may return more pagination params, but now they won't be used
    }
}
```

Also your server should process 
* `POST <your-collection-url>/` for creating new items
* `PATCH <your-collection-url>/:id` for updating new items
* `DELETE <your-collection-url>/:id` for deleting items

## When customiztion will be added?
There is a [github issue](https://github.com/qpep3b/react-recrud/issues/17) with this feature. Now I am working on functionality, so I haven't started resolving this issue yet.

If you have a solution, you may create a pull request
