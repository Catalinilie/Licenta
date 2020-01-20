import React from "react";
import "./Login.css";
import axios from 'axios';
import Async from 'react-async';
import "./MyPlayingField.css"
import PlayingFieldCard from "../components/PlayingFieldCard";
import {Link} from "react-router-dom";
import LastPlayingFieldAdded from "../components/LastPlayingFieldAddes";
import Col from "react-bootstrap/lib/Col";

export default function GetMyPlayingFields(props) {
    let playingFieldsResult;
    sessionStorage.setItem("search","false");

    async function getPlayingFields() {
        const playingFieldsParams = {
            "userId": sessionStorage.getItem("userId"),
            "token": sessionStorage.getItem("token")
        };
        playingFieldsResult = await axios.get('http://localhost:4996/playingFields', {params: playingFieldsParams});
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

    if (sessionStorage.getItem("isAuthenticated") === "false")
        return (
            <div className="container-fluid">
                <div className="col-sm-12">
                    <div className="as">
                        <div className="card text-white bg-danger mb-3"
                             style={{"text-align": "center", "margin-top": "3rem"}}>
                            <div className="card-header">You don't have access here!</div>
                            <div className="card-body">
                                <h4 className="card-title">Access restricted</h4>
                                <p className="card-text">Please go to login page. </p>
                                <Link className="btn btn-primary" to="/login">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    else
        return (
            <div>
                <div className="container-fluid myPlayingFieldClass" >
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
                            <h3 id="lastPlayingFieldAdded">The latest 5 playing field added</h3>
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