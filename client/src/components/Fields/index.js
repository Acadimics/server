import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { filter, includes, map } from 'lodash'; 
import { connect } from 'react-redux';
import { fieldsActions } from '../../actions'
import SegmentHeader from '../SegmentHeader';
import { AddFieldModal } from './AddField';
import Field from './Field';

import './style.scss';

const Fields = ({ fields = { item: [] }, fetchFields }) => {
    const [addField, setAddField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const fieldNames = map(fields.items, 'name');

    const getFields = async () => {
        setLoading(true);
        await fetchFields();
        setLoading(false);
    }

    useEffect( () => {
        getFields();
    }, []);

    const filtered = filter(fields.items, ({name}) => 
        includes(name.toLowerCase(), query.toLocaleLowerCase()));

    return (
        <div className="fields">
            <SegmentHeader title="Fields" onClick={addField} icon="newspaper outline"
                searchOptions={fieldNames} onSearch={setQuery}
                AddModalComponent={AddFieldModal} setOpen={setAddField} />
            <div className={classNames('ui segment', {'is-loading': loading})}>
                <div className={classNames('cards-wrapper ui active inverted', {dimmer: loading})}>
                    {loading && <div className="ui massive text loader">Loading</div>}
                    {!loading && filtered.map((field) => (
                        <Field {...field} key={field._id}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ fields }) => ({
    fields
});

export default connect(mapStateToProps, {
    fetchFields: fieldsActions.fetchFields
})(Fields);