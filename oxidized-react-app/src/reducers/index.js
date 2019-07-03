import {POPULATE_NODES} from "../constants/action-types";

const initialState = {
    nodes: []
};

function rootReducer(state = initialState, action) {
    if(action.type === POPULATE_NODES) {
        return {
            ...state,
            nodes: action.payload
        };
    }
    return state;
};

export default rootReducer;