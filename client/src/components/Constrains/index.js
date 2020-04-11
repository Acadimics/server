import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { filter, includes, map } from 'lodash'; 
import { constrainsActions } from '../../actions'
import SegmentHeader from '../SegmentHeader';
import AddConstrainModal from './AddConstrain';
import Constrain from './Constrain';

import './style.scss';

const Constrains = ({ constrains, fetchConstraints }) => {
    const [addConstrain, setAddConstrain] = useState(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const constrainDescription = map(constrains.items, 'description');

    const getConstraints = async () => {
        setLoading(true);
        await fetchConstraints();
        setLoading(false);
    }

    useEffect( () => {
        getConstraints();
    }, []);

    const filtered = filter(constrains.items, ({description}) => 
        includes(description.toLowerCase(), query.toLocaleLowerCase()));

    return (
        <div className="constrains">
            <SegmentHeader title="Constrains" onClick={addConstrain} icon="tasks"
                searchOptions={constrainDescription} onSearch={setQuery}
                AddModalComponent={AddConstrainModal} setOpen={setAddConstrain} />
            <div className={classNames('ui segment', {'is-loading': loading})}>
                <div className={classNames('cards-wrapper ui active inverted', {dimmer: loading})}>
                    {loading && <div className="ui massive text loader">Loading</div>}
                    {!loading && filtered.map((constrain) => (
                        <Constrain key={constrain._id} {...constrain}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ constrains }) => ({
    constrains
});

export default connect(mapStateToProps, {
    fetchConstraints: constrainsActions.fetchConstraints
})(Constrains);