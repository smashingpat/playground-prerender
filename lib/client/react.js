import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PreRenderHook } from './prerender';

export function render(element, container) {
    if (container.children.length > 0) {
        ReactDOM.hydrate(element, container);
    } else {
        ReactDOM.render(element, container);
    }
}

export const usePrerender = () => {
    const prerender = React.useMemo(() => new PreRenderHook(), []);

    return prerender;
};

export const usePrerenderState = (prerender, initialValue) => {
    const store = React.useMemo(() => prerender.createStore(), [prerender]);
    const [value, _setValue] = React.useState(store.getValue() || initialValue);
    const setValue = React.useCallback(
        update => {
            _setValue(update);
            store.setValue(update);
        },
        [prerender]
    );

    return [value, setValue];
};

export const usePrerenderDone = (prerender, condition) => {
    React.useEffect(() => {
        if (condition) {
            prerender.done();
        }
    }, [prerender, condition]);
};
