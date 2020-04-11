import React, { useState, useEffect } from 'react';
import { groupBy, keyBy, map, reject } from 'lodash';
import { connect } from 'react-redux';
import { Modal, Button, Select, Layout, Form, Input, Collapse, List } from 'antd';
import { fieldsActions } from '../../../actions/index'
import AddInstitution from './AddInstitution';

import './style.scss'

const { Header, Footer, Sider, Content } = Layout;
const { Panel } = Collapse;

const buildSubmitConstrains = ({ bagrut = [], psychometry = [] }) =>
    [...bagrut, ...psychometry].map(({ _id, value }) => ({
        constraintId: _id,
        value
    }))

const deserialize = (field, constrainsData) => {
    const { name, _id, institutions } = field;

    const constrainsById = keyBy(constrainsData.items, '_id');

    const getConstraintsByScoop = (constrains) => groupBy(
        constrains.map(({ constraintId, value }) => ({
            ...constrainsById[constraintId],
            value
        })), 'scoop');

    return {
        _id,
        name,
        institutions: institutions.map(({ institutionId, requirements: { constraints = [] } = {} }) => ({
            institutionId,
            requirements: getConstraintsByScoop(constraints)
        }))
    }
}

const AddField = ({ institutions = [], constrains, field, createField, 
        onSubmit, updateField, readOnly = false }) => {
    const [selectedInstitutions, setAa] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const institutionsById = keyBy(institutions, '_id');

    useEffect(() => {
        if (field) {
            const deserialized = deserialize(field, constrains);
            setAa(deserialized.institutions);
            form.setFieldsValue({ name: field.name })
        }
    }, [field])

    const onFinish = async (values) => {
        const submitData = {
            ...values,
            institutions: selectedInstitutions.map(({ institutionId, requirements }) => ({
                institutionId,
                requirements: {
                    constraints: buildSubmitConstrains(requirements)
                }
            }))
        };

        const promise = field ?
            updateField({ ...field, ...submitData, fieldKey: field._id }) :
            createField(submitData);

        setIsLoading(true);
        await promise;
        setIsLoading(false);
        onSubmit({ ...field || {}, ...submitData });
        setAa([]);
        form.resetFields();
    }

    const onChange = (data) => {
        if (data) {
            let selected = [...selectedInstitutions];

            if (editing) {
                setIsEditing(false);
                selected = reject(selectedInstitutions, { institutionId: data.institutionId })
            }

            setAa([...selected, data]);
        }
    }

    const addInstitution = () => {
        open({ selected: map(selectedInstitutions, 'institutionId') });
    }

    const renderExtra = (institution) => {

        const onEdit = (event) => {
            event && event.stopPropagation();
            setIsEditing(true);
            open({
                institution,
                selected: map(selectedInstitutions, 'institutionId')
            })
        }

        const onRemove = (event) => {
            event && event.stopPropagation();
            setAa(reject(selectedInstitutions, institution));
        }

        return (
            <div>
                <Button type="primary" disabled={readOnly} onClick={onEdit}>Edit</Button>
                <Button type="primary" disabled={readOnly} onClick={onRemove}>Remove</Button>
            </div>
        )
    }

    const renderInstitution = (institution) => {
        const { institutionId, requirements } = institution;

        return (
            <Panel header={institutionsById[institutionId].name} key={institutionId} extra={renderExtra(institution)}>
                {map(requirements, (values, header) => values && values.length ? (
                    <List header={<b>{header}</b>} key={header} dataSource={values} size="small"
                        renderItem={({ description, value }) => (
                            <List.Item>
                                {description}:{value}
                            </List.Item>
                        )} />
                ) : null)}
            </Panel>
        )
    }

    return (
        <Form form={form} onFinish={onFinish}>
            <Layout>
                <Header>
                    <Form.Item label="Name" name="name"
                        rules={[{ required: true, message: 'Please enter field name' }]}>
                        <Input defaultValue={field ? field.name : ''} readOnly={readOnly} />
                    </Form.Item>
                </Header>
                <Layout className="institutions">
                    <Content>
                        <Collapse bordered={false} defaultActiveKey={['1']}>
                            {selectedInstitutions.map(renderInstitution)}
                        </Collapse>
                        <AddInstitution setTrigger={({ open }) => setOpen(() => open)} onChange={onChange} />
                        <Button onClick={addInstitution} disabled={readOnly}> Add institution </Button>
                    </Content>
                </Layout>
                <Footer>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={readOnly}>
                            Submit
                        </Button>
                    </Form.Item>
                </Footer>
            </Layout>
        </Form>
    )
}

const mapStateToProps = ({ institutions, constrains }) => ({
    institutions,
    constrains
});

const ConnectedAddField = connect(mapStateToProps, {
    createField: fieldsActions.createField,
    updateField: fieldsActions.updateField
})(AddField);

const AddFieldModal = ({ setTrigger }) => {
    const [visible, setVisible] = useState(false);
    const [field, setField] = useState(null);
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        setTrigger({ open });
    }, []);

    const open = ({ currentField, readOnly = false }) => {
        currentField && setField(currentField);
        setReadOnly(readOnly);
        setVisible(true);
    };

    const title = field ? `Update ${field.name}` : 'Create new field';

    return (
        <>
            <Modal title={title}
                visible={visible}
                onCancel={() => setVisible(false)}
                width="85%"
                footer={null}>
                <ConnectedAddField field={field} onSubmit={() => setVisible(false)} readOnly={readOnly} />
            </Modal>
        </>
    )
}

export { AddField, AddFieldModal };