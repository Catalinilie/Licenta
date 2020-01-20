import React, {Component} from "react";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "./CalendarSlot.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as BigCalendar from "react-big-calendar";
import {Calendar, Views} from "react-big-calendar";
import axios from "axios";

const localizer = BigCalendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class MyCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    async handleSelect(event, title) {
        if (sessionStorage.getItem("userId") === this.props.userId) {
            const title = window.prompt('New Event name');
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
                    return { events };
                });
            }
        }
    }


    onEventDrop({event, start, end, allDay}) {

        console.log(start);
    };

    render() {
        return (
            <div className="App">
                <DnDCalendar
                    selectable
                    defaultDate={new Date()}
                    defaultView={Views.WEEK}
                    events={this.state.events}
                    localizer={localizer}
                    onSelectSlot={this.handleSelect.bind(this)}
                    onSelectEvent={event => this.deleteEvent(event)}
                    onEventDrop={this.onEventDrop}
                    onEventResize={this.onEventResize.bind(this)}
                    resizable
                    style={{height: "100vh"}}
                />

            </div>
        );
    }
}

export default MyCalendar;
