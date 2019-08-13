import { createStore } from 'redux';

function reducer(state = 0, action) {
    switch(action.type) {
        case 'INCREMENT':
            return state + action.payload;

        case 'DECREMENT':
            return state - action.payload;
    }
    return state;
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(onStoreUpdate)

console.log('redux part1');

const html = `
<input type="number" id="txt">
<button id="inc">Increment</button>
<button id="dec">Decrement</button>
<pre id="state"></pre>
`;

document.getElementById('app').innerHTML = html;


document.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        console.log('click: ', event.target.id);

        const inpElem = document.getElementById('txt');
        const val = inpElem.value;
        console.log(val);

        switch (event.target.id) {
            case 'inc':
                store.dispatch({ type: 'INCREMENT', payload: Number(val) });
                break;

            case 'dec':
                store.dispatch({ type: 'DECREMENT', payload: Number(val) });
                break;
        }

        // inpElem.value = '';
        inpElem.focus();
    }
});

function onStoreUpdate() {
    const state = store.getState();
    document.getElementById('state').innerText = JSON.stringify(state, null, 2);
}

onStoreUpdate();
