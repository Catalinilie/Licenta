import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Register from "./containers/Register";
import AddPlayingField from "./containers/AddPlayingField";
import MyPlayingField from "./containers/MyPlayingField";
import AppliedRoute from "./components/AppliedRoute";

export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
            <AppliedRoute path="/home" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/signup" exact component={Register} appProps={appProps} />
            <AppliedRoute path="/addPlayingField" exact component={AddPlayingField} appProps={appProps} />
            <AppliedRoute path="/myPlayingFields" exact component={MyPlayingField} appProps={appProps} />
            { /* Finally, catch all unmatched routes */ }
            <Route component={NotFound} />
        </Switch>
    );
}