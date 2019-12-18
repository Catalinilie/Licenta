import React from "react";
import "./LoaderButton.css";
import CardGroup from "reactstrap/es/CardGroup";
import Card from "reactstrap/es/Card";


export default function PlayingFieldCard({
                                             className = "",
                                             disabled = false,
                                             ...props
                                         }) {
    return (
        <CardGroup>
            <Card>
                <Card.Img variant="top" src={this.props.imageRoute}/>
                <Card.Body>
                    <Card.Title>{props.playingFieldType}</Card.Title>
                    <Card.Text>
                        {props.playingFieldDescription}
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">{props.address}</small>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}