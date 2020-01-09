import React, {Component} from "react";
import "./LastPlayingFieldAdded.css"


class LastPlayingFieldAdded extends Component {

    render() {
        return (
            <div key={this.props.field.type}>
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
            </div>
        );
    }
}

export default LastPlayingFieldAdded;