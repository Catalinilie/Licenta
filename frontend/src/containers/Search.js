import React, {Component} from "react";
import {FormGroup, FormControl} from "react-bootstrap";
import "./Search.css";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import Async from "react-async";
import PlayingFieldCard from "../components/PlayingFieldCard";

export default class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            type: "",
            numberOfPlayers: ""
        }
    }

    validateForm() {
        return this.state.type.length > 0 && this.state.numberOfPlayers.length > 0;
    }

    async getResults(event) {
        if (event) event.preventDefault();
        const params = {
            "type": this.state.type,
            "numberOfPlayers": this.state.numberOfPlayers
        };
        try {
            const res = await axios.get('http://localhost:4996/search', {params: params});
            console.log(res.data);
            return res;
        } catch (e) {
            alert(e.message);
        }
    }



    search() {
        return (
            <Async promiseFn={this.getResults()}>
                {({data, err, isLoading}) => {
                    if (isLoading) return "Loading...";
                    if (err) return `Something went wrong: ${err.message}`;

                    if (data)
                        return (
                            <div>
                                {data.data.map(playingField => (
                                    <PlayingFieldCard field={playingField} key={playingField.id}/>
                                ))}
                            </div>
                        );
                }}
            </Async>
        )
    }

    render() {
        return (
            <div className="container searchContainer">
                <div className="Search col-sm-3">
                    <form onSubmit={this.display}>
                        <FormGroup controlId="type">
                            <ControlLabel>Type</ControlLabel>
                            <FormControl
                                autoFocus
                                type="type"
                                value={this.state.type}
                                onChange={e => this.setState({type: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup controlId="numberOfPlayers">
                            <ControlLabel>Number of players</ControlLabel>
                            <FormControl
                                type="numberOfPlayers"
                                value={this.state.numberOfPlayers}
                                onChange={e => this.setState({numberOfPlayers: e.target.value})}
                            />
                        </FormGroup>
                        <LoaderButton
                            block
                            type="submit"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            className="btn btn-primary"
                            onClick={this.search()}
                        >
                            Search
                        </LoaderButton>
                    </form>
                </div>
            </div>
        );
    }
}