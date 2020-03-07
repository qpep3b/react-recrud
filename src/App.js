import React from "react";
import "./App.css";
import Table from "./components/Table";

function getColumns() {
  return [
    {
      Header: "ID",
      accessor: "id",
      hidden: "true",
    },
    {
      Header: "Domain",
      accessor: "url",
    },
    {
      Header: "Comment",
      accessor: "comment",
      editType: "textarea",
    },
    {
      Header: "type",
      accessor: "type",
      editType: "select",
      editOptions: {
        options: [
          ['type1', 'type1'],
          ['type2', 'type2'],
        ]
      }
    }
  ];
}

const data = [
  {
    id: 1,
    url: "123.com",
    comment: "fsd"
  },
  {
    id: 2,
    url: "mail.ru",
    comment: "lorem"
  },
  {
    id: 3,
    url: "vk.com",
    comment: "ipsum"
  }
];

function App() {
  return (
    <div className="App">
      <Table columns={getColumns()} data={data} />{" "}
    </div>
  );
}

export default App;
