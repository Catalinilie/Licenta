import React from "react";
import "./Login.css";
import axios from 'axios';
import Async from 'react-async';
import "./MyPlayingField.css"
import PlayingFieldCard from "../components/PlayingFieldCard";

export default function GetMyPlayingFields(props) {
    let playingFieldsResult;

    async function getPlayingFieldImage(){
        let playingFieldsImageResult;
        const imagesParams = {
            "playingFieldId":props.playingFieldId
        };
        playingFieldsImageResult = await axios.get('http://localhost:4996/uploadImage', {params: playingFieldsImageResult});
    }

    async function getPlayingFields() {
        const playingFieldsParams = {
            "userId": props.userId,
            "token": props.token
        };
        playingFieldsResult = await axios.get('http://localhost:4996/playingField', {params: playingFieldsParams});
        console.log(playingFieldsResult);
        return playingFieldsResult;
    }

        return (
            <div>
                <Async promiseFn={getPlayingFields}>
                    {({data, err, isLoading}) => {
                        if (isLoading) return "Loading...";
                        if (err) return `Something went wrong: ${err.message}`;

                        if (data)
                            return (<div>
                                {data.data.map(playingField => (

                                    <PlayingFieldCard field={playingField}/>
                                ))}
                            </div>);
                    }}
                </Async>
            </div>
        );
}