import React, { useState, useEffect } from 'react';
import { omit } from 'lodash';
import { connect } from 'react-redux';
import { Modal, Button, Select } from 'antd';
import { institutionsActions } from '../../../actions'
import { DEFAULT_LOCATIONS } from '../constants';

const AddInstitution = ({ onSubmit, institution = {}, createInstitution, 
        updateInstitution, readOnly = false }) => {
    const [name, setName] = useState(institution.name || "");
    const [logo, setLogo] = useState(institution.logo || "");
    const [locations, setLocations] = useState(institution.locations || [DEFAULT_LOCATIONS[0]]);
    const [isLoading, setLoading] = useState(false);

    const { Option } = Select;

    const children = DEFAULT_LOCATIONS.map(location => <Option key={location}>{location}</Option>);

    const submit = async (data) => {
        setLoading(true);
        const institutionId = institution._id;
        institutionId ? 
            await updateInstitution({
                ...omit(institution, '_id'),
                id: institutionId,
                ...data
            }) : 
            await createInstitution(data);
        setLoading(false);

        onSubmit && onSubmit();
    }

    const onFormSubmit = (event) => {
        event.preventDefault();
        const data = {
            name,
            locations,
            logo
        };

        submit(data);
        
    }

    return (
        <form className="ui form">
            <div className="field">
                <label>Institiution Name</label>
                <input type="text" name="name" value={name} readOnly={readOnly}
                    onChange={(event => setName(event.target.value))}
                    placeholder="Institution Name"/>
            </div>
            <div className="field">
                <label>Location</label>
                <Select disabled={readOnly}
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Locations"
                    defaultValue={locations}
                    onChange={(value) => {setLocations(value)}}>
                    {children}
                </Select>
            </div>
            <div className="field">
                <label>Logo</label>
                <input type="text" name="logo" value={logo} readOnly={readOnly}
                    onChange={(event => setLogo(event.target.value))}
                    placeholder="Institution Logo"/>
            </div>
            <Button type="primary" disabled={readOnly} 
                loading={isLoading} onClick={onFormSubmit}>Submit</Button>
        </form>
    );
}

const ConnectedAddInstitution = connect(null, {
    createInstitution: institutionsActions.createInstitution,
    updateInstitution: institutionsActions.updateInstitution
})(AddInstitution);

const AddInstitutionModal = ({ setTrigger }) => {
    const [isAddInstitutionVisible, setAddInstitutionVisible] = useState(false);
    const [institution, setInstitution] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        setTrigger({open});
    }, []);

    const title = institution ? `Update ${institution.name}` : 'Add Institiution';

    const onSubmit = () => {
        setAddInstitutionVisible(false);
    }

    const open = ({institution, readOnly = false}) => {
        setReadOnly(readOnly);
        institution && setInstitution(institution);
        setAddInstitutionVisible(true);
    };

    return (
        <>
            <Modal title={title}
                visible={isAddInstitutionVisible}
                onCancel={() => setAddInstitutionVisible(false)}
                footer={null}>
                <ConnectedAddInstitution onSubmit={onSubmit} institution={institution} readOnly={readOnly}/>
            </Modal>
        </>
    )
}

export {AddInstitution, AddInstitutionModal};