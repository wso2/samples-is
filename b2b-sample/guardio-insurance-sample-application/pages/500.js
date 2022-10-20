/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Image from "next/image";

import { useRouter } from "next/router";
import React from "react";
import { Button, Col, Grid, Row } from "rsuite";
import error500Image from "../public/internal/500.svg";
import style from "../styles/Error.module.css";
import { orgSignout } from "../util/util/routerUtil/routerUtil";

export default function Custom500() {
  
    const router = useRouter();
    const goBack = () => orgSignout();

    return (
        <div className={ style.errorMainContent }>
	  <Grid>
                <Row>
		  <Col sm={ 24 } md={ 6 } lg={ 3 } />

		  <Col sm={ 12 } md={ 12 } lg={ 18 }>

                        <div className={ style.errorMainDiv }>

			  <Image src={ error500Image } width={ 500 } alt="404 image" />

			  <p
                                style={ {
                                    textAlign: "center",
                                    position: "relative",
                                    top: -100
			  } }><b>It looks like you have been inactive for a long time.</b> <br />
				When you click on <i>Go back</i>, we will try to recover the session if it exists. <br />
				If you don&apos;t have an active session, you will be redirected to the login page.</p>
			  <Button
                                style={ {
                                    textAlign: "center",
                                    position: "relative",
                                    top: -100
			  } }
                                size="lg"
                                appearance="ghost"
                                onClick={ goBack }>Go Back</Button>

                        </div>

		  </Col>

		  <Col sm={ 24 } md={ 6 } lg={ 3 } />

                </Row>
	  </Grid>
        </div>
    );
}
