// @ts-check
import '@babel/polyfill';
import * as React from 'react';
import { render, usePrerender, usePrerenderDone, usePrerenderState } from '../lib/client/react';

const fetchPeople = async () => {
    const response = await fetch('https://swapi.co/api/people/1');
    const data = await response.json();
    return data;
};

const App = () => {
    const prerender = usePrerender();
    const [people, setPeople] = usePrerenderState(prerender, null);

    React.useEffect(() => {
        if (people === null) {
            fetchPeople().then(setPeople);
        }
    }, []);

    usePrerenderDone(prerender, !!people);

    return <pre>{JSON.stringify(people, null, 2)}</pre>;
};

render(<App />, document.getElementById('app'));
