import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { matchPath,StaticRouter as Router} from 'react-router';
import APP,{routes} from '../routes';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from '../redux/rootReducer';

export default {
	home: function *() {

        let url = this.request.url;
		let components = routes.map(route=>{
			var match = matchPath(url,route);
            if(match) return [route.component,match];
		}).filter(val=>{
            return !!val;
        });
        console.log("line1"+ components);
		const store = applyMiddleware(
			thunkMiddleware
		)(createStore)(rootReducer, {});

        components = components.filter(
			component => typeof component[0].fetchData === 'function'
		);

        console.log("line2"+ components);
		const promises = components.map(component =>
			component[0].fetchData({
				dispatch: store.dispatch, params: component[1].params
			})
		)

		yield Promise.all(promises);

		yield new Promise((resolve, reject) =>
			setTimeout(() => {
				resolve();
			}, 0)
		)
		const html = ReactDOMServer.renderToString(
			<Provider store={store}>
                <Router location={url}>
                    <APP />
                </Router>
			</Provider>
		);

		yield this.render('index', {
			content: html,
			state  : JSON.stringify(store.getState())
		});

	}
}
