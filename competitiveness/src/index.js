import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//async actions
import thunkMiddleware from 'redux-thunk';
//so we can actually use thunk
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import App from './App.jsx';
import About from './About.jsx';
import NYCETAppReducers from './reducers/index';
import registerServiceWorker from './registerServiceWorker'

const finalCreateStore = compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

let store = finalCreateStore(NYCETAppReducers)

// debugging helper
const announce = () => console.log(store.getState())
setInterval(announce, 7000)

ReactDOM.render(
<Provider store={store}>
  <BrowserRouter>
    <Switch>
      <Route exact path='/about' component={About} />
      <Route path='/:parentDistrictType?/:selectedDistrict?' component={App} />
    </Switch>
  </BrowserRouter>
</Provider>,
  document.getElementById('root')
);

registerServiceWorker();
