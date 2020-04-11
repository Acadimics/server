import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { institutionsActions } from '../../../actions'
import { AddInstitutionModal } from '../AddInstitution';

import './style.scss'

const { confirm } = Modal;

function showDeleteConfirm(institutionName, deleteInstitute) {
  confirm({
    title: 'Are you sure you want to delete this institution?',
    icon: <ExclamationCircleOutlined />,
    content: `When clicked the OK button, ${institutionName} will be deleted`,
    onOk() {
      return deleteInstitute();
    },
    onCancel() {},
  });
}

const Institution = ({ deletInstitution, updateInstitution, ...institution}) => {
    const { name, locations = [], type , _id, logo } = institution;
    const [openModal, setOpenModal] = useState(false);

    const setOpenModalTrigger = ({open}) => {
        !openModal && setOpenModal(() => open);
    }

    const deleteInstitute = async () => {
        await deletInstitution(_id);
    }

    const onDoubleClick = () => {
        openModal({institution, readOnly: true})
    }

    return (
        <div className="card" onDoubleClick={onDoubleClick}>
            <div className="content description">
                <img className="right floated mini ui image" src="/images/avatar/large/elliot.jpg" alt="" />
                <div className="header">
                    <img className="ui avatar image" src={logo || window.faker.image.avatar()}/>
                    {name}
                </div>
                <div className="meta">
                    {locations.join(', ')}
                </div>
                <div className="description">
                    this is institution description
                </div>
            </div>
            <div className="extra content">
                <div className="ui two buttons">
                    <AddInstitutionModal setTrigger={setOpenModalTrigger}/>
                    <div className="ui basic green button" onClick={() => openModal(institution)}>Update</div>
                    <div className="ui basic red button active" onClick={()=> showDeleteConfirm(name, deleteInstitute)} >
                        Delete
                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect(null, {
    deletInstitution: institutionsActions.deleteInstitutions,
    updateInstitution: institutionsActions.updateInstitution
})(Institution);