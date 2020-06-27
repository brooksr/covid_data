import React, {useState, useEffect} from 'react';
import './App.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const axios = require("axios");

function App() {
  let [data, setData] = useState({}, null);

  useEffect(() => {
    axios.get("https://covidtracking.com/api/states/daily").then(function (response) {
      // handle success
      setData(response)
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  }, [])


  return (
    <div className="App">
      <h1>COVID 19 Data</h1>
      <div className="flex">
        <div className="graph">
        <LineChart width={400} height={400} data={!data.data ? [] : data.data.filter(i => i.state == "CA").reverse()}>
          <Line type="monotone" dataKey="positive" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis dataKey="positive" />
          <Tooltip></Tooltip>
        </LineChart>
        </div>
        <textarea value={JSON.stringify(data, null, "\t")} className="raw-data" />
      </div>
    </div>
  );
}

export default App;
