import React from "react";
import Institutions from "../Institutions";
import { Tabs } from 'antd';
import Fiedls from "../Fields";
import Constrains from "../Constrains";

import './style.scss';

const { TabPane } = Tabs;

const App = () => {
    return (
        <div className="data-update-app">
            <Tabs defaultActiveKey="2">
                <TabPane tab="Institutions" key="1" forceRender={true}>
                    <Institutions/>
                </TabPane>
                <TabPane tab="Fields" key="2" forceRender={true}>
                    <Fiedls/>
                </TabPane>
                <TabPane tab="Constrains" key="3" forceRender={true}>
                    <Constrains/>
                </TabPane>
            </Tabs>
        </div>
    )
};

export default App;