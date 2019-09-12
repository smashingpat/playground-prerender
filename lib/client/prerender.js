const noop = () => {
    return Promise.resolve();
};

const DATA_KEY = '@@prerender-dataKey';

export class PreRenderHook {
    constructor() {
        this.dataCount = 0;
        this.data = window[DATA_KEY] || {};
        this.hooks = {
            doneRendering: window['@@prerender-doneRendering'] || noop,
            isPrerenderServer: window['@@prerender-isPrerenderServer'] || noop,
        };
    }
    async done() {
        const condition = await this.hooks.isPrerenderServer();
        if (condition) {
            const stringifiedData = JSON.stringify(this.data);
            const scriptEl = document.createElement('script');
            scriptEl.textContent = `window["${DATA_KEY}"] = ${stringifiedData}`;
            document.head.appendChild(scriptEl);
        }
        this.hooks.doneRendering(document.documentElement.innerHTML);
    }
    createStore() {
        this.dataCount += 1;
        const key = this.dataCount.toString();

        return {
            setValue: value => {
                this.data[key] = value;
            },
            getValue: () => {
                const value = this.data[key] || null;
                console.log(value);
                return value;
            },
        };
    }
}
