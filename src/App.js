import React, {useState, useEffect} from 'react';
import './App.css';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import states from './states'
const axios = require("axios");

function App() {
  let [data, setData] = useState([]);
  let [form, setForm] = useState({
    state: "CA",
    property: "positive",
    properties: []
  });

  useEffect(() => {
    if (false && sessionStorage.getItem("cache")) {
      setData(JSON.parse(sessionStorage.getItem("cache")));
    } else {
      axios.get("https://covidtracking.com/api/states/daily").then(function (response) {
        // handle success
        //debugger;
        // let filteredData = response.data.filter(i => i.state == "AZ" || i.state == "CA").reverse();
        // setData(filteredData)
        // sessionStorage.setItem("cache", JSON.stringify(filteredData));
        // console.log(filteredData);
        setData(response.data.sort((a, b) => a.date < b.date ? -1 : 1));
        let properties = Object.keys(response.data[0]);
        setForm({ ...form, properties: properties}); 
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    }
  }, [])


  let filteredData = !data ? [] : data.filter(i => i.state == form.state);
  return (
    <div className="App">
      <h1>COVID 19 Data</h1>
      <form>
        <div>
          <label>State</label>
          <select value={form.state} onChange={e => {
            setForm({ ...form, state:e.target.value}); 
          }}>
            {Object.keys(states).map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        <div>
          <label>Property</label>
          <select value={form.property} onChange={e => {
            setForm({ ...form, property: e.target.value}); 
          }}>
            {form.properties.map(prop => <option key={prop} value={prop}>{prop}</option>)}
          </select>
        </div>
      </form>
      <div className="flex">
        <div className="graph">
          <LineChart width={800} height={400} data={filteredData}>
            <Line type="monotone" dataKey={form.property} stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis dataKey={form.property} />
            <Tooltip></Tooltip>
          </LineChart>
        </div>
        <textarea readOnly value={JSON.stringify(data, null, "\t")} className="raw-data hidden" />
      </div>
    </div>
  );
}

export default App;
