import React from 'react';
import classNames from 'classnames';
import { includes, uniq } from 'lodash';
import { PlusOutlined } from '@ant-design/icons';
import { Button, AutoComplete } from 'antd';

import './style.scss';

const SegmentHeader = ({ title, onClick, icon, AddModalComponent,
        setOpen, searchOptions = [], onSearch }) => {

    const setModalTrigger = ({open}) => {
        setOpen(() => open);
    }

    const options = uniq(searchOptions).map(option => ({value: option}));
    const filterOption = (inputValue, option) => 
        includes(option.value.toLowerCase(), inputValue.toLowerCase())

    return (
        <h2 className="ui segment-header header">
            <i className={classNames(icon, "icon")}></i>
            <div className="content">
                {title}
            </div>
            <div className="sub header">
                <AddModalComponent setTrigger={setModalTrigger}/>
                <Button type="primary" icon={<PlusOutlined />} onClick={onClick}>
                        Add Item
                </Button>
                <AutoComplete className='search' onSearch={onSearch} 
                    placeholder={`search for ${title}`} onSelect={onSearch}
                    filterOption={filterOption} options={options}/>
            </div>
        </h2>
    )
}

export default SegmentHeader;