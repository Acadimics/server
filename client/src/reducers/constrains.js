import { pick, reject } from 'lodash';
import { FETCH_CONSTRAINS, CREATE_CONSTRAIN, UPDATE_CONSTRAIN, REMOVE_CONSTRAIN } from "../actions/constrains/types";

const initialState = {
    count: 0,
    items: []
}

export default (state = initialState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CONSTRAINS:
            return pick(payload, ['count', 'items']);
        case CREATE_CONSTRAIN:
            return {
                count: state.count + 1,
                items: [...state.items, payload]
            }
        case UPDATE_CONSTRAIN:
            return {
                ...state,
                items: state.items.map((item) => item._id === payload._id ? payload : item)
            }
        case REMOVE_CONSTRAIN:
            return {
                count: state.count - 1,
                items: reject(state.items, {_id: payload._id})
            }
        default:
            return state;
    }
}