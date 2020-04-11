import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { map, filter, includes } from 'lodash';
import { institutionsActions } from '../../actions'
import Institution from './institution';
import SegmentHeader from '../SegmentHeader';
import { AddInstitutionModal } from './AddInstitution';

import './style.scss';

const Institutions = ({ institutions, fetchInstitutions}) => {
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const institutionNames = map(institutions, 'name');

    const getInstitutions = async () => {
        setLoading(true);
        await fetchInstitutions();
        setLoading(false);
    }

    useEffect( () => {
        getInstitutions();
    }, [])

    const filtered = filter(institutions, ({name}) => 
        includes(name.toLowerCase(), query.toLocaleLowerCase()));

    return (
        <div className="institutions">
            <SegmentHeader title="Institutions" onClick={openModal} icon="university"
                searchOptions={institutionNames} onSearch={setQuery}
                AddModalComponent={AddInstitutionModal} setOpen={setOpenModal} />
            <div className={`ui segment ${loading ? 'is-loading' : ''}`}>
                <div className={`ui active inverted ${loading ? 'dimmer' : ''}`}>
                    {loading && <div className="ui massive text loader">Loading</div>}
                    {!loading && (
                        <div className="ui cards">
                            {filtered.map((institution) => (
                                <Institution {...institution} key={institution._id}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ institutions }) => {
    return {institutions}
};

export default connect(mapStateToProps, {
    fetchInstitutions: institutionsActions.fetchInstitutions
})(Institutions);