import React, {Component} from "react";
import "./PlayingField.css"
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";
import Col from "react-bootstrap/lib/Col";
import Button from "react-bootstrap/lib/Button";
import UpdatePlayingField from "../components/UpdatePlayingField";
import Modal from 'react-modal';
import MyCalendar from "../components/CalendarSlot";
import {ReactComponent as Logo} from "../icons/6dd9e91b5f916e049aea8d4a381c14f8.svg";
import AvailableTime from "../components/AvailableTime";
import Facilities from "../components/Facilities";


const updateModalStyle = {
    content: {
        height: "40em",
        width: "50em",
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const addAvailableTimeModalStyle = {
    content: {
        height: "25em",
        width: "45em",
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const addFacilitiesModalStyle = {
    content: {
        height: "23em",
        width: "45em",
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement(document.getElementById('root'));

class PlayingField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageURL: "",
            facilities: [],
            modalUpdatePlayingField: false,
            modalAddAvailableTime: false,
            modalAddFacilities: false,
            playingField: "",
            classes: makeStyles({
                card: {
                    maxWidth: 345,
                },
                media: {
                    height: 140,
                },
            })
        };
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openUpdateModal() {
        this.setState({modalUpdatePlayingField: true});
    }

    openAddAvailableTimeModal() {
        this.setState({modalAddAvailableTime: true});
    }

    openAddFacilitiesModal() {
        this.setState({modalAddFacilities: true});
    }

    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalUpdatePlayingField: false});
        this.setState({modalAddAvailableTime: false});
        this.setState({modalAddFacilities: false});
    }

    async deletePlayingField(id, e) {
        try {
            await axios.delete('http://localhost:4996/deletePlayingField', {params: {playingFieldId: id}})
                .then(() => this.props.history.push("/myPlayingFields"));
        } catch (e) {
            if (e.response.status === 404)
                this.props.history.push("/myPlayingFields");
        }
    }

    async componentDidMount() {
        const imagesParams = {
            "playingFieldId": this.props.match.params.id
        };
        await axios.get('http://localhost:4996/uploadImage', {params: imagesParams})
            .then(playingFieldsImageResult => this.setState({
                imageURL: 'http://localhost:4996' + playingFieldsImageResult.data[0]
            }));
        const playingFieldParam = {
            "playingFieldId": this.props.match.params.id
        };
        await axios.get('http://localhost:4996/playingField', {params: playingFieldParam})
            .then(playingFieldResult => this.setState({
                playingField: playingFieldResult.data
            }));
        await axios.get('http://localhost:4996/getFacilities', {params: playingFieldParam})
            .then(playingFieldResult => this.setState({facilities: this.state.facilities.concat(playingFieldResult.data)}));

    }

    render() {
        return (
            <>  {this.state.playingField &&
            <div className="container-fluid">
                <div className="row" style={{"margin": "2rem 0 2rem 0"}}>
                    <Col md={9}>
                        <div className="jumbotron titleContainerClass">
                            <h1 className="display-3">{this.state.playingField.title}</h1>
                            <div className="row">
                                <Logo id="logoId" fill="gray"/>
                                <p className="lead addressTextPlayingFieldClass">{this.state.playingField.address.city},
                                    str. {this.state.playingField.address.street}
                                    &nbsp;nr. {this.state.playingField.address.streetNr},&nbsp; {this.state.playingField.address.country}&nbsp;
                                    {this.state.playingField.address.postalCode}&nbsp;</p>
                            </div>
                        </div>

                        <div className="calendarClass">
                            <span className="spanTitleClass">Calendar</span>
                            <MyCalendar playingFieldId={this.props.match.params.id}
                                        userId={this.state.playingField.userId}/>
                        </div>


                        <div className="jumbotron titleContainerClass">
                            <h1 className="display-6">Description</h1>
                            <p className="playingFieldDescriptionClass">{this.state.playingField.description}</p>
                        </div>

                        {this.state.playingField.userId === sessionStorage.getItem("userId") &&

                        <div className="playingFieldButtons">
                            <button className="btn btn-primary playingFieldButton" color="primary"
                                    onClick={e => this.deletePlayingField(this.props.match.params.id, e)}
                            >
                                Delete
                            </button>

                            <button className="btn btn-primary playingFieldButton"
                                    onClick={this.openUpdateModal.bind(this)}>Update
                            </button>
                            <Modal
                                isOpen={this.state.modalUpdatePlayingField}
                                onRequestClose={this.closeModal}
                                style={updateModalStyle}
                                contentLabel="Update Playing Field"
                            >
                                <Button className="btn btn-primary closeButtonModal"
                                        onClick={this.closeModal}>Close</Button>
                                <UpdatePlayingField playingFieldId={this.props.match.params.id}/>

                            </Modal>

                            <button className="btn btn-primary playingFieldButton"
                                    onClick={this.openAddAvailableTimeModal.bind(this)}>Add Available Time
                            </button>
                            <Modal
                                isOpen={this.state.modalAddAvailableTime}
                                onRequestClose={this.closeModal}
                                style={addAvailableTimeModalStyle}
                                contentLabel="Add Available Time"
                            >
                                <Button className="btn btn-primary closeButtonModal"
                                        onClick={this.closeModal}>Close</Button>
                                <AvailableTime playingFieldId={this.props.match.params.id}/>

                            </Modal>

                            <button className="btn btn-primary playingFieldButton"
                                    onClick={this.openAddFacilitiesModal.bind(this)}>Add or Update Facilities
                            </button>
                            <Modal
                                isOpen={this.state.modalAddFacilities}
                                enforceFocus={true}
                                onRequestClose={this.closeModal}
                                style={addFacilitiesModalStyle}
                                contentLabel="Add Facilities"
                            >
                                <Button className="btn btn-primary closeButtonModal"
                                        onClick={this.closeModal}>Close</Button>
                                <Facilities facilities={this.state.facilities.map(facility => (facility.facility))}
                                            playingFieldId={this.props.match.params.id}/>

                            </Modal>
                        </div>
                        }
                        <div className="imageContainer">
                            <img
                                className="imageBox"
                                src={this.state.imageURL}
                                alt="new"
                            />
                        </div>
                    </Col>
                    <Col md={3}>
                        <div className="list-group leftSideInformation">
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start leftSideListGroup">
                                <p className="mb-1">Contact data </p>
                            </div>
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start leftSideContentClass">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">You can contact the owner at:</h5>
                                </div>
                                <p className="mb-1">
                                    Phone Number: {this.state.playingField.address.contactPhone}
                                </p>
                                <p className="mb-1">
                                    Email: {this.state.playingField.address.contactEmail}
                                </p>
                            </div>
                        </div>
                        <div className="list-group leftSideInformation">
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start leftSideListGroup">
                                <p className="mb-1">Playing Field details </p>
                            </div>
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start leftSideContentClass">
                                <p className="mb-1">
                                    Type: {this.state.playingField.type}&nbsp;
                                </p>
                                <p className="mb-1">
                                    Address: {this.state.playingField.address.city},
                                    str. {this.state.playingField.address.street}
                                    &nbsp;nr. {this.state.playingField.address.streetNr},&nbsp; {this.state.playingField.address.country}&nbsp;
                                    {this.state.playingField.address.region}&nbsp;
                                </p>
                                <p className="mb-1">
                                    Postal code: {this.state.playingField.address.addressCode}&nbsp;
                                </p>
                                <p className="mb-1">
                                    Number of players: {this.state.playingField.numberOfPlayers}
                                </p>
                                <p className="mb-1">
                                    Price: {this.state.playingField.price} / hour
                                </p>
                            </div>
                        </div>
                        <div className="list-group leftSideInformation">
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start leftSideListGroup">
                                <p className="mb-1">Playing Field facilities</p>
                            </div>
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start">
                                <p className="mb-1">
                                    {this.state.facilities.map(item => (
                                        <span key={item.facility}
                                              className="badge badge-primary badge-pill facilityRemoveButtonClass">{item.facility}
                                        </span>
                                    ))}
                                    {/*{this.state.facilities}*/}
                                </p>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            }
            </>
        );
    }
}

export default PlayingField;