import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "../components/Login";
import Redirect from "../components/Redirect";
import Dashboard from "../components/Dashboard";
import NotFound from "../components/NotFound";

class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="main app-container">
          <Switch>
            <Route path="/" component={Login} exact={true} />
            <Route path="/redirect" component={Redirect} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
