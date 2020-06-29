import React, {useState, useEffect} from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import ReactMarkdown from 'react-markdown'
const axios = require("axios");

export const Info = props => {
    let [info, setInfo] = useState([]);

    useEffect(() => {
        axios.get(`https://covidtracking.com/api/states/info`).then(function (response) {
            setInfo(response.data); 
        })
        .catch(function (error) {
            console.log(error);
        })
    }, []);

    let stateData = info.find(i => i.state === props.form.state)
    if (!stateData) return "";
    return (
        <div>
            <h2>{stateData.name}</h2>
            <div className="buttons">
                <a href={stateData.covid19Site} target="_blank" rel="noopener noreferrer">link1</a>
                <a href={stateData.covid19SiteSecondary} target="_blank" rel="noopener noreferrer">link2</a>
                <a href={stateData.covid19SiteTertiary} target="_blank" rel="noopener noreferrer">link3</a>
            </div>
            <ReactMarkdown source={stateData.notes} />
            <p>{stateData.twitter}</p>
            <TwitterTimelineEmbed
                sourceType="profile"
                screenName={stateData.twitter.replace("@", "")}
                options={{height: 400}}
            />
        </div>
    )
}