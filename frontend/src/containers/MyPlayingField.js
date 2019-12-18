import React, {useState} from "react";
import "./Login.css";
import axios from 'axios';
import PlayingFieldCard from "../components/PlayingFieldCard";

export default function GetMyPlayingFields(props) {
    const [imageRoute, setImageRoute] = useState(null);
    const [playingFieldType, setPlayingFieldType] = useState(null);
    const [playingFieldDescription, setPlayingFieldDescription] = useState(null);
    const [address, setAddress] = useState(null);

    async function getMyPlayingFields(event) {
        event.preventDefault();
        const params = {
            "userId": props.userId,
            "token": props.token
        };
        try {
            const res = await axios.get('http://localhost:4996/playingField', params);

            setImageRoute(res.data["imageRoute"]);
            setPlayingFieldType(res.data["type"]);
            setPlayingFieldDescription(res.data["description"]);
            setAddress(res.data["street"] + " " + res.data["streetNr"]
                + ", " + res.data["city"] + ", " + res.data["addressCode"]);
            console.log(res.data);
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <PlayingFieldCard
            imageRoute={imageRoute}
            playingFieldType={playingFieldType}
            playingFieldDescription={playingFieldDescription}
            address={address}
            block
            bsSize="large"
            className="LoginButton">
            {getMyPlayingFields()}
        </PlayingFieldCard>
    );
}