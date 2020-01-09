import React, {useState} from "react";
import Alert from "react-bootstrap/lib/Alert";
import Button from "react-bootstrap/lib/Button";


function AlertDismissible() {
    const [show, setShow] = useState(true);

    return (
        <>
            <Alert show={show} variant="success">
                <Alert.Heading>Continue</Alert.Heading>
                <p>
                    Playing Field created with success.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShow(false)} variant="outline-success">
                        Close!
                    </Button>
                </div>
            </Alert>

            {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>}
        </>
    );
}

export default AlertDismissible;