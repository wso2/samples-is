import Image from 'next/image';
import React from 'react';
import style from '../styles/Error.module.css';

import { useRouter } from 'next/router';
import { Button, Col, Grid, Row } from 'rsuite';
import error500Image from '../public/500.svg';
import { orgSignout } from '../util/util/routerUtil/routerUtil';


export default function Custom500() {

  const router = useRouter()
  const goBack = () => orgSignout();


  return (
    <div className={style.errorMainContent}>
      <Grid>
        <Row>
          <Col sm={24} md={6} lg={3} />

          <Col sm={12} md={12} lg={18}>

            <div className={style.errorMainDiv}>

              <Image src={error500Image} width={500} alt="404 image" />

              <p style={{
                textAlign: 'center',
                position: 'relative',
                top: -100
              }}><b>It looks like you have been inactive for a long time.</b> <br />When you click on <i>Go back</i>, we will try to recover the session if it exists. <br />If you don&apos;t have an active session, you will be redirected to the login page.</p>
              <Button style={{
                textAlign: 'center',
                position: 'relative',
                top: -100
              }} size='lg' appearance='ghost' onClick={goBack}>Go Back</Button>

            </div>

          </Col>

          <Col sm={24} md={6} lg={3} />

        </Row>
      </Grid>
    </div>
  )
}