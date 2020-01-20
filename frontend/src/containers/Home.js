import React from "react";
import "./Home.css";
import axios from "axios";
import Async from "react-async";
import Col from "react-bootstrap/lib/Col";
import PlayingFieldCard from "../components/PlayingFieldCard";
import LastPlayingFieldAdded from "../components/LastPlayingFieldAddes";

export default function Home() {
    let playingFieldsResult;
    sessionStorage.setItem("search", "true");

    async function getPlayingFields() {
        const playingFieldsParams = {
            "index": 0,
            "count": 9
        };
        playingFieldsResult = await axios.get('http://localhost:4996/playingField', {params: playingFieldsParams});
        console.log(playingFieldsResult);
        return playingFieldsResult;
    }


    async function getLastPlayingFieldsAdded() {
        const params = {
            "numberOfFields": 5
        };
        playingFieldsResult = await axios.get('http://localhost:4996/lastAdded', {params: params});
        console.log(playingFieldsResult);
        return playingFieldsResult;
    }

    return (
        <div>
            <div className="container-fluid homeClass">
                <div className="row">
                    <div className="col-sm-9">
                        <Async promiseFn={getPlayingFields}>
                            {({data, err, isLoading}) => {
                                if (isLoading) return "Loading...";
                                if (err) return `Something went wrong: ${err.message}`;

                                if (data)
                                    return (
                                        <div className="container-fluid">
                                            <div className="row cardField">
                                                {data.data.map(playingField => (
                                                    <Col md={4} key={playingField.id}>
                                                        <PlayingFieldCard field={playingField} key={playingField.id}/>
                                                    </Col>
                                                ))}
                                            </div>
                                        </div>
                                    );
                            }}
                        </Async>
                    </div>
                    <div className="col-sm-3 leftSide">
                        <h3 id="lastPlayingFieldAdded">The last playing fields added</h3>
                        <Async promiseFn={getLastPlayingFieldsAdded}>
                            {({data, err, isLoading}) => {
                                if (isLoading) return "Loading...";
                                if (err) return `Something went wrong: ${err.message}`;

                                if (data)
                                    return (
                                        <div>
                                            {data.data.map(playingField => (
                                                <LastPlayingFieldAdded field={playingField} key={playingField.id}/>
                                            ))}
                                        </div>
                                    );
                            }}
                        </Async>
                    </div>
                </div>
            </div>
        </div>
    );
}