import { pick, reject } from 'lodash';
import { FETCH_FIELDS, CREATE_FIELD, UPDATE_FIELD, REMOVE_FIELD } from "../actions/fields/types";
import { DELETE_INSTITUTION } from '../actions/institutions/types';

const initialState = {
    count: 0,
    items: []
}

export default (state = initialState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case CREATE_FIELD:
            return {
                count: state.count + 1,
                items: [...state.items, payload]
            }
        case UPDATE_FIELD:
            return {
                ...state,
                items: state.items.map((item) => item._id === payload._id ? payload : item)
            }
        case FETCH_FIELDS:
            return pick(payload, ['count', 'items']);
        case REMOVE_FIELD:
            return {
                count: state.count - 1,
                items: reject(state.items, {_id: payload._id})
            }
        case DELETE_INSTITUTION:
            return {
                ...state,
                items: state.items.map((item) => ({
                    ...item,
                    institutions: reject(item.institutions, {institutionId: payload.id})
                }))
            }
        default:
            return state;
    }
}