import React, {Component} from "react";
import "./PlayingFieldCard.css";
import Button from "react-bootstrap/lib/Button";
import axios from 'axios';
import UpdatePlayingField from "./UpdatePlayingField";
import ButtonToolbar from "react-bootstrap/lib/ButtonToolbar";
import Col from "react-bootstrap/lib/Col";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import makeStyles from "@material-ui/core/styles/makeStyles";


class PlayingFieldCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageURL: "",
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
            .then(playingFieldsImageResult => this.setState({
                imageURL: 'http://localhost:4996' + playingFieldsImageResult.data[0]
            }));
    }

    async deletePlayingField(id, e) {
        try {
            await axios.delete('http://localhost:4996/deletePlayingField', {params: {playingFieldId: id}})
                .then(res => console.log(res.statusText))
                .then(() => window.location.reload());
        } catch (e) {
            if (e.response.status === 404)
                window.location.reload();
        }
    }

    render() {
        return (
            {/*<div key={this.props.field.type}>
                <div className="jumbotron row palyingFieldCard">
                    <Col md={6}>
                        <div className="display-3">
                            {this.props.field.type}
                        </div>
                        <div className="card-body">
                            <h5 className="lead">Playing Field type: {this.props.field.type}</h5>

                            <p className="card-text">Number of players: {this.props.field.numberOfPlayers}</p>
                            <p className="card-text">Address:{this.props.field.address.region},&nbsp;
                                {this.props.field.address.city}, str. {this.props.field.address.street},&nbsp;
                                nr. {this.props.field.address.streetNr}
                            </p>
                            <p className="card-text">Contact:
                                <br/>
                               Phone number: {this.props.field.address.contactPhone}
                                <br/>
                               Email address: {this.props.field.address.contactEmail}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <img src={this.state.imageURL} className="img-thumbnail image" alt=""/>
                    </Col>
                    <br/>
                    <div className="card-body">
                        <p className="my-4">Description: {this.props.field.description}</p>
                    </div>
                    <Col md={12}>
                        <ButtonToolbar style={{"margin-top": "1em"}}>
                            <Button variant="primary" className="btn btn-primary"
                                    onClick={e => this.deletePlayingField(this.props.field.id, e)}>
                                Delete Playing Field
                            </Button>
                            <Button variant="primary" className="btn btn-primary"
                                    style={{"margin-left": "1em"}}
                                    onClick={e => this.setState({modalShow: true})}>
                                Update Playing Field
                            </Button>
                            <UpdatePlayingField
                                show={this.state.modalShow}
                                onHide={() => this.setState({modalShow: false})}
                            />
                        </ButtonToolbar>
                    </Col>
                </div>
            </div>*/
            } &&
            {/*<div className="card cardFieldContainer" style={{"width": "18rem"}}>
                <img className="card-img-top" src={this.state.imageURL} style={{"height":"10rem"}} alt="Card image cap"/>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.field.type}</h5>
                        <p className="card-text description">{this.props.field.description}</p>
                        <p className="card-text">{this.props.field.address.region},&nbsp;
                            {this.props.field.address.city}, str. {this.props.field.address.street},&nbsp;
                            nr. {this.props.field.address.streetNr}</p>
                        <a href="#" className="btn btn-primary">Go somewhere</a>
                    </div>
            </div>*/
            } &&
            <Card className={this.state.classes.card}>
                <CardActionArea to="/login">
                    <CardMedia
                        style={{"height":"10rem"}}
                        image={this.state.imageURL}
                        title={this.props.field.type}/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.field.type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {this.props.field.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={e => this.deletePlayingField(this.props.field.id, e)}>
                       Delete
                    </Button>
                    <Button size="small" color="primary">
                        Update
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default PlayingFieldCard;