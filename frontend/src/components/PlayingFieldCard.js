import React, {Component} from "react";
import "./LoaderButton.css";

// class Card extends Component {
//     render() {
//         return (
//             <div className="cardComponent" style={{margin: '1rem'}}>
//                 Card
//             </div>
//         );
//     }
// }
//
// const CardList = (props) => {
//     <div>
//         <Card />
//     </div>
// }

class PlayingFieldCard extends Component {


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
                </div>
            </div>
        );
    }
}

export default PlayingFieldCard;