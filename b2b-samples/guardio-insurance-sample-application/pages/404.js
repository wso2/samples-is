import Image from 'next/image';
import React from 'react';
import style from '../styles/Error.module.css'

import { Button, Col, Content, FlexboxGrid, Grid, Panel, Row } from 'rsuite';
import errorImage from '../public/error.svg';
import { useRouter } from 'next/router';


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

              <Image src={errorImage} width={600} alt="404 image"/>

              <p style={{
                textAlign: 'center'
              }}><b>The page your searching seems to be missing.</b> <br />You can go back, or contact our <a>Customer Service</a> team if you need any help</p>

              <Button size='lg' appearance='ghost' onClick={goBack}>Go Back</Button>

            </div>

          </Col>

          <Col sm={24} md={6} lg={3} />

        </Row>
      </Grid>
    </div>
  )
}