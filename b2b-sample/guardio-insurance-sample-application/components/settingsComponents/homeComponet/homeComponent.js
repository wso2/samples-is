import { Panel } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import styles from '../../../styles/Settings.module.css';
import Logo from '../../logo/logo';

import React, { useEffect, useState } from 'react';
import { meDetails } from '../../../util/apiDecode';

import LatestNewsComponent from './latestNewsComponent';
import UserDetails from './userDetails';

export default function HomeComponent(props) {

    const [me, setMe] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const res = await meDetails(props.session);
            setMe(res);
        }
        fetchData();
    }, [props]);

    return (
        <div className={styles.homeMainPanelDiv}>
            <Panel bordered>
                <div className={styles.homePanel}>
                    <Logo fontSize={48} letterSpacing={-3} wordSpacing={`normal`} />
                    <p className={styles.nameTag}>A relationship for life </p>
                    <hr />
                    <h4 className={styles.nameTag}>{props.orgName}</h4>
                </div>
            </Panel>
            {
                me == null ?
                    <Panel bordered>
                        <div>Add the user attributes in created the application to display user details</div>
                    </Panel>
                    :
                    <Panel header="User Details" bordered>
                        <div id="userDetails" className={styles.homePanel}>
                            <UserDetails me={me} session={props.session} />
                        </div>
                    </Panel>
            }

            <LatestNewsComponent />
        </div>
    );
}
