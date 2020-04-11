import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { groupBy, find, reject, get } from 'lodash';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Button, Select, InputNumber, Form, notification  } from 'antd';

import './style.scss';

const Option = Select.Option;

const AddInstitution = ({ institutions, constrains, onChange, setTrigger }) => {
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedInstitutions, setSelectedInstitutions] = useState(institutions);
    const [form] = Form.useForm();

    const constrainsByScoop = groupBy(constrains.items, 'scoop');

    const getAvailable = () => reject(institutions, ({ _id }) => selectedInstitutions.includes(_id))

    useEffect(() => {
        setTrigger({open});
    }, []);

    const open = ({ institution = {}, selected }) => {
        const editing = !!institution.institutionId;

        setSelectedInstitutions(reject(selected, (id) => id === institution.institutionId));
        
        if(editing){
            form.setFieldsValue(institution)
        }

        setIsEditing(editing);
        setVisible(true);
    };

    const onFinish = (values) => {
        console.log(values);
        onChange(values);
        form.resetFields();
        setVisible(false);
        setIsEditing(false);
    }

    const renderInstitution = () => (
        <Form.Item label="Institution" name="institutionId"
            rules={[{ required: true, message: 'Please select institution' }]}>
            <Select placeholder="Select institute" >
                {getAvailable().map((institution) => (
                    <Option key={institution._id} value={institution._id}>{institution.name}</Option>
                ))}
            </Select>
        </Form.Item>
    );

    const renderRequierments = ({scoop, constrains}) => {
        const fieldName = ['requirements', scoop];
        let selectedConstrain = get(constrains, '[0]._id');

        const addConstrain = (add) => {
            const requirements = form.getFieldValue(fieldName);
            const requierment = find(requirements, { _id: selectedConstrain });

            if(requierment){
                notification.error({
                    message: `requierment ${requierment.description} is already selected`,
                    description: 'you cant select same requierment more than once'
                });

                return;
            }

            add(find(constrains, { _id: selectedConstrain }));
        }

        const renderRequiermentField = ({name, key}, remove) => {

            const fieldProps = form.getFieldValue([...fieldName,name]);
            fieldProps.value = fieldProps.value || 0;
            
            return (            
                <Form.Item key={key} label={fieldProps.description}>
                    <InputNumber type="number" onChange={(value)=> fieldProps.value = value} 
                        defaultValue={fieldProps.value } required/>
                    <Button type="link" onClick={() => remove(name)}><MinusCircleOutlined/> remove</Button>
                </Form.Item>
            )
        }

        return (
            <Form.List name={fieldName}>
                {(fields, { add, remove }) => (
                    <div className='requirements'>
                        <Form.Item label={scoop} className="selector">
                            <Select onChange={(value) => selectedConstrain = value} defaultValue={selectedConstrain}>
                                {constrains.map(({description, _id: id}) => (
                                    <Option key={id} value={id}>{description}</Option>
                                ))}
                            </Select>
                            <Button type="link" onClick={() => addConstrain(add)}> <PlusOutlined /> add </Button>
                        </Form.Item>
                        {fields.map(field => renderRequiermentField(field, remove))}
                    </div>
                )}
            </Form.List>
        );
    }

    const onCancel = () => {
        setVisible(false);
        setIsEditing(false);
        isEditing && form.resetFields();
    }
    
    return (
        <Modal title="Institution" visible={visible} onCancel={onCancel} footer={null}>
            <Form form={form} name="constrains" onFinish={onFinish} className="field-add-institution" >
                {renderInstitution()}
                {renderRequierments({scoop: 'bagrut', constrains: constrainsByScoop['bagrut']})}
                {renderRequierments({scoop: 'psychometry', constrains: constrainsByScoop['psychometry']})}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="submit-btn">
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const mapStateToProps = ({ institutions, constrains}) => ({
    institutions,
    constrains
})

export default connect(mapStateToProps)(AddInstitution);