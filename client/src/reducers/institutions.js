import { FETCH_INSTITUTIONS, CREATE_INSTITUTION, UPDATE_INSTITUTION, DELETE_INSTITUTION } from "../actions/institutions/types";

export default (institutions = [], action) => {
    var institutionId;
    switch (action.type) {
        case FETCH_INSTITUTIONS:
            return action.payload.items;
        case CREATE_INSTITUTION:
            return [
                ...institutions,
                action.payload
            ];
        case DELETE_INSTITUTION:
            institutionId = action.payload.id;
            return institutions.filter(({_id}) => _id !== institutionId);
        case UPDATE_INSTITUTION:
            institutionId = action.payload.id;
            action.payload._id = institutionId;
            return institutions.map((institution) => institution._id === institutionId ? action.payload : institution);
        default:
            return institutions;
    }
}