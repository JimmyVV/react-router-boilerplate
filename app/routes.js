import React from 'react';
import { Route, Switch} from 'react-router';

import Container from './component/Container';

import LatestBills from './containers/LatestBills';
import DetailedBill from './containers/DetailedBill';
import NotFound from './containers/404';


export const routes = [
    {
        path: '/',
        exact: true,
        component: LatestBills,
    },
    {
        path: '/bill/:billId',
        component: DetailedBill
    },
    {
        Path: '*',
        component: NotFound
    }
];


export default(
        <Container>
            {routes.map(route => (
                <Route {...route}/>
            ))}
        </Container>
);



