import React from "react";
import "./Login.css";
import axios from 'axios';

export default function GetMyPlayingFields(userId) {

    async function getMyPlayingFields(event) {
        event.preventDefault();
        const params = {
            "userId": userId
        };
        try {
            const res = await axios.get('http://localhost:4996/login', params);

            console.log(res.data);
        } catch (e) {
            alert(e.message);
        }
    }

    return (
        <div className="MyPlayingFields">

        </div>
    );
}