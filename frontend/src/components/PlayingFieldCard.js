import React, {Component} from "react";
import "./PlayingFieldCard.css";
import Button from "react-bootstrap/lib/Button";
import axios from 'axios';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Link} from "react-router-dom";
import {ReactComponent as Logo} from '../icons/6dd9e91b5f916e049aea8d4a381c14f8.svg';
import Modal from "react-modal";
import UpdatePlayingField from "./UpdatePlayingField";
import Col from "react-bootstrap/lib/Col";


const customStyles = {
    content: {
        height: "85%",
        width: "75%",
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const deleteModalStyle = {
    content: {
        height: "12em",
        width: "30em",
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class PlayingFieldCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageURL: "",
            url: "",
            modalIsOpen: false,
            deleteModal: false,
            search: sessionStorage.getItem("search"),
            classes: makeStyles({
                card: {
                    maxWidth: 345,
                },
                media: {
                    height: 140,
                },
            })
        };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }

    openDeleteModal() {
        this.setState({deleteModal: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        this.setState({deleteModal: false});
    }

    async componentDidMount() {
        const imagesParams = {
            "playingFieldId": this.props.field.id
        };
        await axios.get('http://localhost:4996/uploadImage', {params: imagesParams})
            .then(playingFieldsImageResult => {
                this.setState({
                    imageURL: 'http://localhost:4996' + playingFieldsImageResult.data[0]
                });
                this.setState({
                    url: "/playingField/" + this.props.field.id
                });
            });
    }


    async deletePlayingField(id, e) {
        try {
            await axios.delete('http://localhost:4996/deletePlayingField', {params: {playingFieldId: id}})
                .then(() => window.location.reload());
        } catch (e) {
            if (e.response.status === 404)
                window.location.reload();
        }
    }

    render() {
        return (
            <Card className="this.state.classes.card cardFieldContainer">
                <CardActionArea component={Link} style={{textDecoration: 'none', color: 'white'}} to={this.state.url}>
                    <CardMedia
                        className="imageCard"
                        image={this.state.imageURL}
                        title={this.props.field.type}>

                        <span className="typeCorner">
                            {this.props.field.type}
                        </span>
                        <span className="titleCard">
                            {this.props.field.title}
                        </span>
                        <span className="typeCornerPrice">
                            {this.props.field.price}/h
                        </span>
                    </CardMedia>
                </CardActionArea>
                <CardActionArea className="componentLink" component={Link}
                                style={{textDecoration: 'none', color: 'white'}} to={this.state.url}>
                    <Typography className="addressCard" variant="body2" color="textSecondary" component="div">
                            <span className="addressCardSpanClass">
                                {this.props.field.address.city}, str. {this.props.field.address.street}&nbsp;
                                nr. {this.props.field.address.streetNr}&nbsp;
                            </span>
                        <span>
                            <Logo id="logoIdCard" fill="gray"/>
                        </span>
                    </Typography>
                </CardActionArea>
                <CardActionArea className="cardActionAreaClass" component="div">
                    {this.state.search === "false" &&
                    <CardActions className="cardActionArea">
                        <button className="btn btn-primary playingFieldButtonCard" color="primary"
                                onClick={this.openDeleteModal.bind(this)}
                        >
                            Delete
                        </button>
                        <Modal
                            isOpen={this.state.deleteModal}
                            onRequestClose={this.closeModal}
                            style={deleteModalStyle}
                            contentLabel="Delete"
                        >

                            <Button className="btn btn-primary closeButtonModal"
                                    onClick={this.closeModal}>Close
                            </Button>
                            <div>
                                Delete Playing Field
                            </div>
                            <div className="deleteModalTextClass">
                                Are you sure that you want to delete this Playing Field?
                            </div>
                            <div className="container-fluid">
                                <div className="row">
                                    <Col md={6} className="deleteModalButtonClass">
                                        <button className="btn btn-primary deleteModalButtonClass" color="primary"
                                                onClick={e => this.deletePlayingField(this.props.field.id, e)}
                                        >
                                            Yes
                                        </button>
                                    </Col>
                                    <Col md={6} className="deleteModalButtonClass">
                                        <button className="btn btn-primary deleteModalButtonClass" color="primary"
                                                onClick={this.closeModal}
                                        >
                                            No
                                        </button>
                                    </Col>
                                </div>
                            </div>

                        </Modal>
                        <button className="btn btn-primary playingFieldButtonUpdate" onClick={this.openModal}>Update</button>
                        <Modal
                            isOpen={this.state.modalIsOpen}
                            // onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles}
                            contentLabel="Update Playing Field"
                        >
                            <Button className="btn btn-primary closeButtonModal"
                                    onClick={this.closeModal}>Close</Button>
                            <UpdatePlayingField playingFieldId={this.props.field.id}/>

                        </Modal>
                    </CardActions>
                    }
                </CardActionArea>

            </Card>
        );
    }
}

export default PlayingFieldCard;