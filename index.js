import { createStore, combineReducers } from 'redux';

// action types
const ADD_ITEM = 'ADD_TODO';
const DELETE_ITEM = 'DELETE_TODO';
const TOGGLE_SHOW_COMPLETED = 'TOGGLE_SHOW_COMPLETED';
const MARK_COMPLETED = 'MARK_COMPLETED';

// action creators
function addTodoItem(text) {
    return {
        type: ADD_ITEM,
        payload: text
    };
}

function delTodoItem(text) {
    return {
        type: DELETE_ITEM,
        payload: text
    };
}

function markTodoCompleted(todoName) {
    return {
        type: MARK_COMPLETED,
        payload: todoName
    };
}

function todoReducer(state = [], action) {
    switch (action.type) {
        case ADD_ITEM:
            return [...state, { name: action.payload, completed: false }];

        case DELETE_ITEM:
            return state.filter(x => x.name !== action.payload);

        case MARK_COMPLETED:
            return state.map(x => x.name === action.payload ? { ...x, completed: true } : x);
    }
    return state;
}

function flagsReducer(state = { showOnlyCompleted: false }, action) {
    if (action.type === TOGGLE_SHOW_COMPLETED) {
        return {
            ...state,
            showOnlyCompleted: action.payload
        };
    }
    return state;
}

const rootReducer = combineReducers({
    todo: todoReducer,
    flags: flagsReducer
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(onStoreUpdate)

console.log('redux part 2')

document.getElementById('app').innerHTML = `
<input type="text" id="txt">

<button id="add">Add new item</button>
<button id="del">Delete item</button>
<button id="comp">Mark as Complted</button>

<br>
<label for="showOnlyCompleted">Show Only Completed:</label>
<input type="checkbox" id="showOnlyCompleted">

<br>
<div id="list"></div>
<pre id="state"></pre>
`;

document.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {

        const inpElem = document.getElementById('txt');
        const value = inpElem.value;

        switch (event.target.id) {
            case 'add':
                store.dispatch(addTodoItem(value));
                break;

            case 'del':
                store.dispatch(delTodoItem(value));
                break;

            case 'comp':
                store.dispatch(markTodoCompleted(value));
                break;
        }

        inpElem.value = '';
        inpElem.focus();
    }
});

document.getElementById('showOnlyCompleted')
    .addEventListener('change', (event) => {
        console.log('change: ' + event.target.checked)
        store.dispatch({ type: TOGGLE_SHOW_COMPLETED, payload: event.target.checked })
    });

function onStoreUpdate() {
    const state = store.getState();
    document.getElementById('state').innerText = JSON.stringify(state, null, 2);


    let listHtml;
    if (state.flags.showOnlyCompleted) {
        listHtml = `<ul> ${state.todo.filter(x => x.completed).map(x => '<li>' + x.name + ' ' + x.completed + '</li>').join('')}</ul>`;
    } else {
        listHtml = `<ul> ${state.todo.map(x => '<li>' + x.name + ' ' + x.completed + '</li>').join('')}</ul>`;
    }

    document.getElementById('list').innerHTML = listHtml;

}

onStoreUpdate()