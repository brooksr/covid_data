import React, {useState, useEffect} from 'react';
import './App.css';
import { AreaChart, ComposedChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import states from './states'
import {Info} from './Info';
const axios = require("axios");

function App() {
  let [data, setData] = useState([]);
  let [form, setForm] = useState({
    state: "CA",
    // property: "positive",
    properties: []
  });

  useEffect(() => {
    axios.get("https://covidtracking.com/api/states/daily").then(function (response) {
      setData(response.data.sort((a, b) => a.date < b.date ? -1 : 1));
      let properties = Object.keys(response.data[0]).filter(prop => {
        return response.data[0][prop] !== null && ["date", "state"].indexOf(prop) === -1;
      });
      setForm({ ...form, properties: properties}); 
    })
    .catch(function (error) {
      console.log(error);
    })
  }, []);


  let filteredData = !data ? [] : data.filter(i => i.state == form.state);
  return (
    <div className="App">
      <h1>COVID 19 Data</h1>
      <form>
        <div>
          <label>State</label>
          <select value={form.state} onChange={e => setForm({ ...form, state:e.target.value})}>
            {Object.keys(states).map(state => <option key={state} value={state}>{state}</option>)}
          </select>
        </div>
        {/* <div>
          <label>Property</label>
          <select value={form.property} onChange={e => {
            setForm({ ...form, property: e.target.value}); 
          }}>
            {form.properties.map(prop => <option key={prop} value={prop}>{prop}</option>)}
          </select>
        </div> */}
      </form>
      <div>
        <Info form={form} />
      </div>
      <div className="">
        <div className="graph">
          <h2>Totals</h2>
          <ComposedChart width={600} height={600} data={filteredData}>
            {/* <Line type="monotone" dataKey={form.property} stroke="#8884d8" /> */}
            <Line type="monotone" dataKey="negative" stroke="green" />
            <Line type="monotone" dataKey="positive" stroke="red" />
            <Line type="monotone" dataKey="pending" stroke="gray" />
            <Line type="monotone" dataKey="hospitalizedCurrently" stroke="red" />
            <Line type="monotone" dataKey="inIcuCurrently" stroke="red" />
            <Line type="monotone" dataKey="death" stroke="black" />
            <Area type="monotone" dataKey="totalTestResults" stroke="gray" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis dataKey="totalTestResults" />
            <Tooltip></Tooltip>
          </ComposedChart>
        </div>
        <div className="graph">
          <h2>Increases</h2>
          <AreaChart width={600} height={600} data={filteredData}>
            <Area type="monotone" dataKey="positiveIncrease" stroke="gray" />
            <Area type="monotone" dataKey="negativeIncrease" stroke="gray" />
            <Area type="monotone" dataKey="totalTestResultsIncrease" stroke="gray" />
            <Area type="monotone" dataKey="deathIncrease" stroke="gray" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis dataKey="totalTestResultsIncrease" />
            <Tooltip></Tooltip>
          </AreaChart>
        </div>
      </div>
    </div>
  );
}

export default App;
