import React, {Component} from "react";
import "./LoaderButton.css";
import Button from "react-bootstrap/lib/Button";
import axios from 'axios';


class PlayingFieldCard extends Component {


    async deletePlayingField(id, e) {
        await axios.delete('http://localhost:4996/deletePlayingField', {params: {playingFieldId: id}})
            .then(res => console.log(res.statusText));
        window.location.reload();
    }

    render() {
        return (
            <div key={this.props.field.type}>
                <div className="jumbotron">
                    <div className="display-3">
                        {this.props.field.type}
                    </div>
                    <div className="card-body">
                        <h5 className="lead">{this.props.field.type}</h5>
                        <p className="my-4">{this.props.field.description}</p>
                        <p className="card-text">{this.props.field.numberOfPlayers}</p>
                    </div>
                    <Button variant="primary" className="btn btn-primary"
                            onClick={e => this.deletePlayingField(this.props.field.id, e)}>
                        Delete Playing Field</Button>
                </div>
            </div>
        );
    }
}

export default PlayingFieldCard;