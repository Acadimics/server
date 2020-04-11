import api from '../../api';
import { FETCH_FIELDS, CREATE_FIELD, UPDATE_FIELD, REMOVE_FIELD } from './types';

export const fetchFields = () => async dispatch => {
    const fields = await api.getFields();

    dispatch({
        type: FETCH_FIELDS,
        payload: fields
    });

    return true;
};

export const createField = (data) => async dispatch => {
    const { fieldKey } = await api.createFields(data);

    dispatch({
        type: CREATE_FIELD,
        payload: { ...data, _id: fieldKey }
    });

    return true;
};

export const updateField = (data) => async dispatch => {
    await api.updateFields(data);

    dispatch({
        type: UPDATE_FIELD,
        payload: data
    });

    return true;
};

export const removeField = (data) => async dispatch => {
    await api.removeField(data);

    dispatch({
        type: REMOVE_FIELD,
        payload: data
    });

    return true;
};