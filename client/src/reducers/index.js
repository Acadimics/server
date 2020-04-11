import { combineReducers } from "redux";
import institutions from './institutions';
import constrains from './constrains';
import fields from './fields';

export default combineReducers({
    institutions,
    constrains,
    fields
});