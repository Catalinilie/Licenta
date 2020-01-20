import React, {Component} from "react";
import "./PlayingField.css"
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";
import Col from "react-bootstrap/lib/Col";
import Button from "react-bootstrap/lib/Button";
import UpdatePlayingField from "../components/UpdatePlayingField";
import Modal from 'react-modal';
import MyCalendar from "../components/CalendarSlot";


const customStyles = {
    content: {
        height: "85%",
        width: "75%",
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
            facilities: "",
            modalIsOpen: false,
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

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    async deletePlayingField(id, e) {
        try {
            await axios.delete('http://localhost:4996/deletePlayingField', {params: {playingFieldId: id}})
                .then(res => console.log(res.statusText))
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

    }

    render() {
        return (
            <>  {this.state.playingField &&
            <div className="container-fluid">
                <div className="row" style={{"margin": "2rem 0 2rem 0"}}>
                    <Col md={9}>
                        <div className="jumbotron titleContainerClass">
                            <h1 className="display-3">{this.state.playingField.title}</h1>
                            <p className="lead">Address: {this.state.playingField.address.city},
                                str. {this.state.playingField.address.street}&nbsp;
                                {this.state.playingField.address.streetNr},&nbsp; {this.state.playingField.address.country}&nbsp;
                                {this.state.playingField.address.postalCode}&nbsp;</p>
                        </div>

                        <div className="calendarClass">
                            <span className="spanTitleClass" >Calendar</span>
                            <MyCalendar playingFieldId={this.props.match.params.id} userId={this.state.playingField.userId}/>
                        </div>


                        <div className="jumbotron titleContainerClass">
                            <p>{this.state.playingField.description}</p>
                        </div>

                        {this.state.playingField.userId === sessionStorage.getItem("userId") &&

                        <div className="playingFieldButtons">
                            <button className="btn btn-primary playingFieldButton" color="primary"
                                    onClick={e => this.deletePlayingField(this.props.match.params.id, e)}
                            >
                                Delete
                            </button>
                            {/*<button className="btn btn-primary playingFieldButton" color="primary">
                                Update
                            </button>
                            <Popup trigger={<button className="btn btn-primary playingFieldButton"> Trigger</button>}
                                   position="right center"
                            >
                                <div>Popup content here !!
                                    <MyProfile>as</MyProfile></div>
                            </Popup>*/}


                            <button className="btn btn-primary playingFieldButton" onClick={this.openModal}>Update
                            </button>
                            <Modal
                                isOpen={this.state.modalIsOpen}
                                // onAfterOpen={this.afterOpenModal}
                                onRequestClose={this.closeModal}
                                style={customStyles}
                                contentLabel="Update Playing Field"
                            >
                                <Button className="btn btn-primary closeButtonModal"
                                        onClick={this.closeModal}>Close</Button>
                                <UpdatePlayingField playingFieldId={this.props.match.params.id}/>

                            </Modal>

                            <button className="btn btn-primary playingFieldButton" color="primary"
                                    show={this.state.modalShow}
                                    onClick={() => this.setState({
                                        modalShow: true
                                    })}>
                                Add available time
                            </button>

                            <button className="btn btn-primary playingFieldButton" color="primary"
                                    show={this.state.modalShow}
                                    onClick={() => this.setState({
                                        modalShow: true
                                    })}>
                                Add facilities
                            </button>
                        </div>
                        }
                        <div className="imageContainer">
                            <img
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
                                className="list-group-item list-group-item-action flex-column align-items-start">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">You can contact the owner at:</h5>
                                </div>
                                <p className="mb-1">
                                    Phone Number: {this.state.playingField.address.contactPhone}
                                </p>
                                <p className="mb-1">
                                    Email Address: {this.state.playingField.address.contactEmail}
                                </p>
                            </div>
                        </div>
                        <div className="list-group leftSideInformation">
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start leftSideListGroup">
                                <p className="mb-1">Playing Field details </p>
                            </div>
                            <div
                                className="list-group-item list-group-item-action flex-column align-items-start">
                                <p className="mb-1">
                                    Address: {this.state.playingField.address.city},
                                    str. {this.state.playingField.address.street}&nbsp;
                                    {this.state.playingField.address.streetNr},&nbsp; {this.state.playingField.address.country}&nbsp;
                                    {this.state.playingField.address.postalCode}&nbsp;
                                </p>
                                <p className="mb-1">
                                    Number of players: {this.state.playingField.numberOfPlayers}
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
                                    {this.state.facilities}
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