import React, {Component} from "react";
import "./Search.css";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import PlayingFieldCard from "../components/PlayingFieldCard";
import TextField from "@material-ui/core/TextField";
import Col from "react-bootstrap/lib/Col";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";

export default class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            typeList: [],
            cityList: [],
            numberOfPlayersList: [],
            type: "",
            search: false,
            numberOfPlayers: "",
            city: "",
            playingFieldResult: null
        };
        sessionStorage.setItem("search", "true");

    }

    onTypeChange = (event, values) => {
        if (values)
            this.setState({
                type: values
            });
    };

    onCityChange = (event, values) => {
        if (values)
            this.setState({
                city: values
            });
    };

    onNumberOfPlayersChange = (event, values) => {
        if (values)
            this.setState({
                numberOfPlayers: values
            });
    };

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

    async componentDidMount() {
        await axios.get('http://localhost:4996/getPlayingFieldInfo')
            .then(
                (res) => {
                    for (let j = 0; j < res.data.length; j++)
                        for (let i = 0; i < res.data[j].length; i++) {
                            let type = res.data[j][i];
                            let city = res.data[j][i];
                            let numberOfPlayers = res.data[j][i];
                            if (j === 0)
                                this.setState({
                                    typeList: this.state.typeList.concat([type])
                                });
                            if (j === 1)
                            this.setState({
                                cityList: this.state.cityList.concat([city])
                            });
                            if (j === 2)
                            this.setState({
                                numberOfPlayersList: this.state.numberOfPlayersList.concat([String(numberOfPlayers)])
                            });
                        }
                }
            );
        console.log(this.state.typeList);
        console.log(this.state.cityList);
        console.log(this.state.numberOfPlayersList);
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
                                    <Autocomplete
                                        id="autoCompleteType"
                                        options={this.state.typeList}
                                        getOptionLabel={option => option}
                                        onChange={this.onTypeChange}
                                        renderInput={params => (
                                            <TextField {...params} className="textFieldClassSearch" id="outlined-type"
                                                       label="Type"
                                                       variant="outlined" value={this.state.type}
                                            />
                                        )}
                                    />
                                    <Autocomplete
                                        id="autoCompleteCity"
                                        options={this.state.cityList}
                                        getOptionLabel={option => option}
                                        onChange={this.onCityChange}
                                        renderInput={params => (
                                            <TextField {...params} className="textFieldClassSearch" id="outlined-city"
                                                       label="City"
                                                       variant="outlined" value={this.state.city}
                                            />
                                        )}
                                    />
                                    <Autocomplete
                                        id="autoCompleteNumberOfPlayers"
                                        options={this.state.numberOfPlayersList}
                                        getOptionLabel={option => option}
                                        onChange={this.onNumberOfPlayersChange}
                                        renderInput={params => (
                                            <TextField {...params} className="textFieldClassSearch" id="outlined-number-of-players"
                                                       label="Number of Players"
                                                       variant="outlined" value={this.state.numberOfPlayers}
                                            />
                                        )}
                                    />
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