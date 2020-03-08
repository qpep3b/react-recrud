import React from "react";
import "./App.css";
import Table from "./components/Table";

function getColumns() {
  return [
    {
      Header: "ID",
      accessor: "id",
      hidden: true,
      width: 70,
    },
    {
      Header: "Domain",
      accessor: "url",
      disableSortBy: true,
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
      editValues: [
        {
          "text": 'type1',
          "value": 'type1',
        },
        {
          "text": 'type2',
          "value": 'type2',
        },
      ]
    }
  ];
}

const data = [
  {
    id: 1,
    url: "123.com",
    comment: "comment for 123",
    type: "type2",
  },
  {
    id: 2,
    url: "mail.ru",
    comment: "comment for mail"
  },
  {
    id: 3,
    url: "vk.com",
    comment: "comment for vk"
  }
];

function App() {
  return (
    <div className="App">
      <Table columns={getColumns()} data={data} hiddenColumns={["comment"]}/>{" "}
    </div>
  );
}

export default App;
