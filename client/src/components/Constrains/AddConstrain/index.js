import React, { useState, useEffect } from 'react';
import { chain, includes } from 'lodash';
import { connect } from 'react-redux';
import { Modal, Button, AutoComplete , Form, Input } from 'antd';
import { constrainsActions } from '../../../actions'

import './style.scss';

const AddConstrain = ({constrain, constrains, onSubmit, createConstrain, updateConstrain, readOnly}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        constrain && form.setFieldsValue(constrain);
    }, [constrain])

    const scoops = chain(constrains.items)
        .uniqBy('scoop')
        .map(({scoop}) => ({value: scoop}))
        .value();

    const filterOption = (inputValue, option) => 
        includes(option.value.toUpperCase(), inputValue.toUpperCase())

    const submit = async (values) => {
        const promise = constrain ? 
            updateConstrain({...constrain, ...values}) : 
            createConstrain(values);
            
        setIsLoading(true);
        await promise;
        setIsLoading(false);
    } 

    const onFinish = async(values) => {
        await submit(values);
        onSubmit(values);
        form.resetFields();
    }

    return (
        <Form form={form} onFinish={onFinish} className="add-constrain-form">
            <Form.Item label="description" 
                rules={[{ required: true, message: 'Please enter description!' }]} 
                name="description">
                <Input type="text" readOnly={readOnly}/>
            </Form.Item>
            <Form.Item name="scoop" 
                rules={[{ required: true, message: 'Please enter description!' }]} 
                label="scoop">
                <AutoComplete options={scoops} filterOption={filterOption} disabled={readOnly}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading} disabled={readOnly}
                     className="submit-btn">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
}

const mapStateToProps = ({ constrains }) => ({
    constrains
})

const ConnectedAddConstrain = connect(mapStateToProps,{
    createConstrain: constrainsActions.createConstrain,
    updateConstrain: constrainsActions.updateConstrain
})(AddConstrain);

const AddConstrainModal = ({ setTrigger, constrain }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [readOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        setTrigger({open});
    }, []);

    const title = constrain ? `Update ${constrain.description}` : 'Add Constrain';

    const onSubmit = () => {
        setIsVisible(false);
    }

    const open = ({readOnly}) => {
        setIsReadOnly(!!readOnly);
        setIsVisible(true);
    };

    return (
        <>
            <Modal title={title}
                visible={isVisible}
                onCancel={() => setIsVisible(false)}
                footer={null}>
                <ConnectedAddConstrain onSubmit={onSubmit} constrain={constrain} readOnly={readOnly} />
            </Modal>
        </>
    )
}

export default AddConstrainModal;