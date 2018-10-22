import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Home, Login, Register } from '../../components';

import registerServiceWorker from '../../RegisterServiceWorker';

const App = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path='/login' component={Login} />
      <Route path='/Register' component={Register} />

    </Switch>
  )
}

registerServiceWorker();
export default withRouter(App);
