import api from '../../api';
import { FETCH_INSTITUTIONS, DELETE_INSTITUTION, CREATE_INSTITUTION, UPDATE_INSTITUTION } from './types';

export const fetchInstitutions = () => async dispatch => {
    const institutions = await api.getInstitutions();

    dispatch({
        type: FETCH_INSTITUTIONS,
        payload:  institutions
    });

    return true;
};

export const deleteInstitutions = (id) => async dispatch => {
    await api.deleteInstitutions({id});

    dispatch({
        type: DELETE_INSTITUTION,
        payload:  {id}
    });

    return true;
};

export const createInstitution = (data) => async dispatch => {
    const {id} = await api.createInstitution(data);

    dispatch({
        type: CREATE_INSTITUTION,
        payload:  {...data, _id: id}
    });

    return true;
};

export const updateInstitution = (data) => async dispatch => {
    await api.updateInstitution(data);

    dispatch({
        type: UPDATE_INSTITUTION,
        payload:  data
    });

    return true;
};

