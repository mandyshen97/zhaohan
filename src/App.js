import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Admin from "./pages/admin/admin";
/**
 * 应用根组件
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
