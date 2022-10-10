/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
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

import Image from 'next/image';
import React from 'react';
import style from '../styles/Error.module.css';

import { useRouter } from 'next/router';
import { Button, Col, Grid, Row } from 'rsuite';
import errorImage from '../public/internal/error.svg';

export default function Custom404() {

  const router = useRouter()
  const goBack = () => router.back();

  return (
    <div className={style.errorMainContent}>
      <Grid>
        <Row>
          <Col sm={24} md={6} lg={3} />

          <Col sm={12} md={12} lg={18}>

            <div className={style.errorMainDiv}>

              <Image src={errorImage} width={600} alt="404 image" />

              <p style={{
                textAlign: 'center'
              }}><b>The page your searching seems to be missing.</b> <br />
                You can go back, or contact our <a>Customer Service</a> team if you need any help</p>

              <Button size='lg' appearance='ghost' onClick={goBack}>Go Back</Button>

            </div>

          </Col>

          <Col sm={24} md={6} lg={3} />

        </Row>
      </Grid>
    </div>
  )
}
