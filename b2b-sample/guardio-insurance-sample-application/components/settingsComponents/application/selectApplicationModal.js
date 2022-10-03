/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Col, Grid, Modal, Panel, Row } from 'rsuite';
import styles from '../../../styles/application.module.css';
import decodeListAllApplications from '../../../util/apiDecode/settings/application/decodeListAllApplications';
import { checkIfJSONisEmpty } from '../../../util/util/common/common';

export default function SelectApplicationModal(props) {

    const [allApplications, setAllApplications] = useState({});

    const fetchData = useCallback(async () => {
        const res = await decodeListAllApplications(props.session);
        await setAllApplications(res);
    }, [props]);

    useEffect(() => {
        console.log(allApplications);
        fetchData();
    }, [fetchData]);

    return (
        <Modal
            open={props.openModal}
            onClose={props.onModalClose}>
            <Modal.Header>
                <Modal.Title><b>Select Application</b></Modal.Title>
                <p>Add authentication to one of the application</p>
            </Modal.Header>
            <Modal.Body>

                {
                    checkIfJSONisEmpty(allApplications) || allApplications.totalResults == 0
                        ? <EmptySelectApplicationBody />
                        : <ApplicationListAvailable allApplications={allApplications} />
                }
            </Modal.Body>
        </Modal>
    )
}

function EmptySelectApplicationBody() {
    return (
        <div className={styles.select__app__empty__card}>
            <h6>No Applications Available</h6>
            <div style={{ marginLeft: "5px" }}>
                <div>Create an application from the WSO2 IS or Asgardeo console to add authentication.</div>
                <p>For more details check out the following links</p>
                <ul>
                    <li>
                        <a href='https://wso2.com/asgardeo/docs/guides/applications/' target="_blank">
                            Add application from Asgardeo console
                        </a>
                    </li>
                </ul>
            </div>


        </div>
    )
}

function ApplicationListAvailable(props) {
    return (
        <div className={styles.select__app__list}>
            {props.allApplications.applications.map((app) =>
                <ApplicationListItem application={app} />
            )}
        </div>
    );

}


function ApplicationListItem(props) {
    return (
        <div className={styles.select__app__list_item__card}>
            <Grid fluid>
                <Row>
                    <Col>
                        <Avatar>{props.application.name[0]}</Avatar>
                    </Col>

                    <Col>
                        <h6>{props.application.name}</h6>
                        <p>{props.application.description}</p>
                    </Col>
                </Row>
            </Grid>
        </div>

    )
}
