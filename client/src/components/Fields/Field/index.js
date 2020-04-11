import React, {useState} from 'react';
import { keyBy } from 'lodash';
import { connect } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card, Button, List, Avatar, Modal } from 'antd';
import { fieldsActions } from '../../../actions';
import { AddFieldModal } from '../AddField';

import './style.scss';

const { confirm } = Modal;

function showDeleteConfirm(FieldName, deleteField) {
    confirm({
      title: 'Are you sure you want to delete this field?',
      icon: <ExclamationCircleOutlined />,
      content: `When clicked the OK button, ${FieldName} will be deleted`,
      onOk() {
        return deleteField();
      },
      onCancel() {},
    });
  }

const Field = ({institutionsData, removeField, ...field}) => {
    const { name } = field;
    const [addField, setAddField] = useState(null);

    const institutionsById = keyBy(institutionsData, '_id');

    const edit = () => {
        addField({currentField: field})
    }

    const remove = () => {
        showDeleteConfirm(name, () => removeField({...field, fieldKey: field._id}));
    }

    const setModalTrigger = ({open}) => {
        setAddField(() => open);
    }

    const onDoubleClick = () => {
        addField({currentField: field, readOnly: true})
    }
    
    const renderTitle = () => (
        <>
            {name}
            <div className="buttons">
                <Button size="small" onClick={edit}> Edit </Button>
                <Button size="small" onClick={remove}> remove </Button>
            </div>
        </>
    )

    return (
        <Card title={renderTitle()} size="small" className="field" onDoubleClick={onDoubleClick}>
            <AddFieldModal setTrigger={setModalTrigger}/>
            <List size="small" dataSource={field.institutions} itemLayout="horizontal" 
                renderItem={({institutionId}) => 
                        (<List.Item>
                            {institutionsById[institutionId] ? 
                                <List.Item.Meta 
                                    avatar={<Avatar 
                                        size="small"
                                        src={institutionsById[institutionId].logo || ""}
                                        />}
                                    description={institutionsById[institutionId].name}/> :
                                <span>can't find institution with id - {institutionId}</span>
                            }
                        </List.Item>)
                }/>
        </Card>
    )
}

const mapStateToProps = ({ institutions }) => ({
    institutionsData: institutions
});

export default connect(mapStateToProps, {
    removeField: fieldsActions.removeField
})(Field);