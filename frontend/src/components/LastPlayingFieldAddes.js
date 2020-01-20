import React, {Component} from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import {Link} from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";
import "./LastPlayingFieldAdded.css"


class LastPlayingFieldAdded extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageURL: "",
            url: "",
            modalShow: false,
            classes: makeStyles({
                card: {
                    maxWidth: 345,
                },
                media: {
                    height: 140,
                },
            })
        };
    }

    async componentDidMount() {
        const imagesParams = {
            "playingFieldId": this.props.field.id
        };
        await axios.get('http://localhost:4996/uploadImage', {params: imagesParams})
            .then(playingFieldsImageResult =>{ this.setState({
                imageURL: 'http://localhost:4996' + playingFieldsImageResult.data[0]
            });
                this.setState({
                    url: "/playingField/" + this.props.field.id
                });
            });
    }

    render() {
        return (
            {/*<div key={this.props.field.type}>
                <div className="jumbotron sidePlayingFields">
                    <div className="display-3 type">
                        {this.props.field.type}
                    </div>
                    <div className="card-body">
                        <h5 className="lead">Playing Field type: {this.props.field.type}</h5>
                        <p className="my-4 description" >Description: {this.props.field.description}</p>
                        <p className="card-text">Number of players: {this.props.field.numberOfPlayers}</p>
                        <p className="card-text">Address: {this.props.field.address.city}</p>
                    </div>
                </div>
            </div>*/
            } &&

            <Card className="this.state.classes.card cardFieldContainerLastAdded">
                <CardActionArea component={Link} style={{textDecoration: 'none', color: 'white'}}  to={this.state.url}>
                    <CardMedia
                        style={{"height": "13rem"}}
                        image={this.state.imageURL}
                        title={this.props.field.type}>
                        <span className="typeCornerLastAdded">
                            {this.props.field.title}
                        </span>
                        <div className="addressCorner">
                            <span>
                                {this.props.field.address.city}, str. {this.props.field.address.street}&nbsp;
                                {this.props.field.address.streetNr}&nbsp;
                            </span>
                        </div>
                    </CardMedia>
                </CardActionArea>

            </Card>
        );
    }
}

export default LastPlayingFieldAdded;