import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../containers/Home";
import NotFound from "../containers/NotFound";
import Login from "../containers/Login";
import Register from "../containers/Register";
import AddPlayingField from "../containers/AddPlayingField";
import MyPlayingField from "../containers/MyPlayingField";
import Search from "../containers/Search";
import AppliedRoute from "../components/AppliedRoute";
import MyProfile from "../containers/MyProfile";
import PlayingField from "../containers/PlayingField";

export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
            <AppliedRoute path="/myProfile" exact component={MyProfile} appProps={appProps} />
            <AppliedRoute path="/home" exact component={Home} appProps={appProps} />
            <AppliedRoute path="/signup" exact component={Register} appProps={appProps} />
            <AppliedRoute path="/search" exact component={Search} appProps={appProps} />
            <AppliedRoute path="/addPlayingField" exact component={AddPlayingField} appProps={appProps} />
            <AppliedRoute path="/myPlayingFields" exact component={MyPlayingField} appProps={appProps} />
            <AppliedRoute path="/playingField/:id" exact component={PlayingField} appProps={appProps} />
            <Route component={NotFound} />
        </Switch>
    );
}