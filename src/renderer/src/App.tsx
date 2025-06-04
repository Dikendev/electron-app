import { Tabs } from "antd";

import Automata from "./components/Automata";
import Analytics from "./components/Analytics";
import { ConfigProvider, theme } from 'antd'
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';

import styles from './styles/App.module.css'

const App = (): JSX.Element => {
    const pages = [
        { id: '1', title: 'Automação', Icon: <AndroidOutlined color="white" />, children: <Automata /> },
        { id: '2', title: 'Analytics', Icon: <AppleOutlined color="white" />, children: <Analytics /> }
    ]

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
            <Tabs
                style={{
                    width: '100%',
                    height: '100%',
                }}
                defaultActiveKey='1'
                centered
                className={styles.override}
                type="card"
                items={pages.map((page) => {
                    return {
                        label: page.title,
                        key: page.id,
                        icon: page.Icon,
                        children: page.children,
                    };
                })}
            />
        </ConfigProvider>
    )
}

export default App
