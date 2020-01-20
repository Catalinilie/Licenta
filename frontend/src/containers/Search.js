import React, {Component} from "react";
import "./Search.css";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import PlayingFieldCard from "../components/PlayingFieldCard";
import TextField from "@material-ui/core/TextField";
import Col from "react-bootstrap/lib/Col";

export default class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            type: "",
            search: false,
            numberOfPlayers: "",
            city: "",
            playingFieldResult: null
        };
        sessionStorage.setItem("search", "true");

    }

    validateForm() {
        return this.state.type.length > 0
            || this.state.city.length > 0
            || this.state.numberOfPlayers.length > 0;
    }

    async getResults(e) {
        e.preventDefault();
        const playingFieldsParams = {
            "type": this.state.type,
            "city": this.state.city,
            "numberOfPlayers": this.state.numberOfPlayers
        };
        this.setState({
            playingFieldResult: await axios.get('http://localhost:4996/search', {params: playingFieldsParams})
        });
        console.log(this.state.playingFieldResult);
        this.setState({
            search: true
        });
    }

    showData() {
        if (this.state.playingFieldResult)
            return (
                <div className="container-fluid">
                    <div className="row cardField">
                        {this.state.playingFieldResult.data.map(playingField => (
                            <Col md={4} key={playingField.id}>
                                <PlayingFieldCard field={playingField} key={playingField.id}/>
                            </Col>
                        ))}
                    </div>
                </div>
            );
    }


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Col md={3}>
                        <div>
                            <div className="searchContainer">
                                <form className="col-sm-12" onSubmit={(e) => this.getResults(e)}>
                                    <TextField className="textFieldClassSearch" id="outlined-type" label="Type"
                                               variant="outlined" value={this.state.type}
                                               onChange={e => this.setState({type: e.target.value})}/>
                                    <TextField className="textFieldClassSearch" id="outlined-city" label="City"
                                               variant="outlined" value={this.state.city}
                                               onChange={e => this.setState({city: e.target.value})}/>
                                    <TextField className="textFieldClassSearch" id="outlined-number-of-players"
                                               label="Number of players"
                                               variant="outlined" value={this.state.numberOfPlayers}
                                               onChange={e => this.setState({numberOfPlayers: e.target.value})}/>
                                    <LoaderButton
                                        block
                                        type="submit"
                                        bsSize="large"
                                        disabled={!this.validateForm()}
                                        className="btn btn-primary searchButton"
                                        onClick={(e) => this.getResults(e)}
                                    >
                                        Search
                                    </LoaderButton>
                                </form>
                            </div>
                        </div>
                    </Col>
                    <Col md={9}>
                        {this.state.search &&
                        <div className="col-sm-12 searchResults">
                            {this.showData()}

                        </div>
                        }
                    </Col>
                </div>
            </div>
        );
    }
}