import React, {Component} from "react";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./CalendarSlot.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as BigCalendar from "react-big-calendar";
import {Calendar, Views} from "react-big-calendar";
import axios from "axios";
import Button from "react-bootstrap/lib/Button";
import Modal from "react-modal";
import Col from "react-bootstrap/lib/Col";
import TextField from "@material-ui/core/TextField";

moment.locale('ro', {
    week: {
        dow: 1,
        doy: 1,
    },
});

const localizer = BigCalendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const addNewEventModalStyle = {
    content: {
        height: "17em",
        width: "35em",
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class MyCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAddNewEvent: false,
            title: "",
            event: null,
            events: []
        };
    }

    async componentDidMount() {
        const params = {
            playingFieldId: this.props.playingFieldId
        };
        return await axios.get('http://localhost:4996/getAvailableSlots', {params: params})
            .then(
                (res) => {
                    for (let i = 0; i < res.data.length; i++) {
                        let result = {
                            id: res.data[i]["id"],
                            start: new Date(res.data[i]["start"]),
                            end: new Date(res.data[i]["end"]),
                            title: res.data[i]["title"]
                        };
                        this.setState({
                            events: this.state.events.concat([result])
                        })
                    }
                });
    }

    onEventResize = (event, start, end) => {
        /*
        if (sessionStorage.getItem("isAuthenticated") === "true") {

            if (event.start !== undefined)
                this.setState(prevState => ({
                    events: {
                        ...prevState.events,
                        [prevState.events[0].start]: event.start,
                    },
                }));

            if (event.end !== undefined)
                this.setState(prevState => ({
                    events: {
                        ...prevState.events,
                        [prevState.events[0].end]: event.end,
                    },
                }));

        }*/
    };

    async handleSelect() {
        let event = this.state.event;
        let title = this.state.title;
        if (sessionStorage.getItem("userId") === this.props.userId) {
            if (title) {
                const params = {
                    playingFieldId: this.props.playingFieldId,
                    start: event.start,
                    end: event.end,
                    title: title

                };
                let token = sessionStorage.getItem("token");
                await axios.post('http://localhost:4996/addAvailableSlot?token=' + token, params)
                    .then(res => {
                        if (res.status === 200) {
                            let result = {
                                id: res.data["id"],
                                start: new Date(res.data["start"]),
                                end: new Date(res.data["end"]),
                                title: res.data["title"]
                            };
                            this.setState({
                                events: this.state.events.concat([result])
                            })
                        }
                    });
            }
        }
        this.setState({title: ""});
        this.setState({modalAddNewEvent: false});
    };

    async deleteEvent(event) {
        if (sessionStorage.getItem("userId") === this.props.userId) {
            const r = window.confirm("Would you like to remove this event?");
            if (r === true) {
                let token = sessionStorage.getItem("token");
                await axios.delete('http://localhost:4996/deleteAvailableSlot?token=' + token, {params: {id: event.id}});
                this.setState((prevState, props) => {
                    const events = [...prevState.events];
                    const id = events.indexOf(event);
                    events.splice(id, 1);
                    return {events};
                });
            }
        }
    }

    closeModal() {
        this.setState({modalAddNewEvent: false});
    }

    onEventDrop({event, start, end, allDay}) {

    };

    openModal(event) {
        this.setState({modalAddNewEvent: true});
        this.setState({event: event});
    }

    render() {
        return (
            <div className="App">
                <DnDCalendar
                    selectable
                    defaultDate={new Date()}
                    defaultView={Views.WEEK}
                    events={this.state.events}
                    localizer={localizer}
                    onSelectSlot={this.openModal.bind(this)}
                    onSelectEvent={event => this.deleteEvent(event)}
                    onEventDrop={this.onEventDrop}
                    onEventResize={this.onEventResize.bind(this)}
                    resizable
                    style={{height: "100vh"}}
                />

                <Modal
                    isOpen={this.state.modalAddNewEvent}
                    onRequestClose={this.state.closeModal}
                    style={addNewEventModalStyle}
                    contentLabel="Update Playing Field"
                >
                    <Button className="btn btn-primary closeButtonModal"
                            onClick={this.closeModal.bind(this)}>Close</Button>
                    <div>
                        <form className="{this.state.classes.root}">
                            <div className="addPlayingFieldContainer row">
                                <Col md={8} className="addPlayingFieldClass">
                                    <TextField className="textFieldClass" id="outlined-title" label="Event title"
                                               autoFocus
                                               variant="outlined" value={this.state.title}
                                               onChange={(e) => this.setState({title: e.target.value})}/>
                                </Col>
                                <Col md={4}>
                                    <Button className="btn btn-primary addEventButtonClass"
                                            onClick={this.handleSelect.bind(this)}>Add Event</Button>
                                </Col>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default MyCalendar;
