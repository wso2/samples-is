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

import Image from 'next/image'
import { Button } from 'rsuite'
import homeImage from '../public/internal/home.jpeg'
import styles from '../styles/Home.module.css'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import "rsuite/dist/rsuite.min.css"
import LogoComponent from '../components/settingsComponents/logoComponent'

export default function Home() {

  const router = useRouter();
  const signinOnClick = () => {
    router.push("/signin");
  }

  useEffect(() => {
    document.body.className = ""
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <div className={styles.homeImageDiv}>
          <Image src={homeImage} className={styles.homeImage} alt="home image" />
        </div>

        <div className={styles.signInDiv}>
          <LogoComponent imageSize='x-large' />

          <hr />
          <p className={styles.buttonTag}>Let&apos;s get your journey started. </p>
          <Button className={styles.signInDivButton} size="lg" appearance='primary'
            onClick={signinOnClick}>Sign In</Button>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://wso2.com/asgardeo/"
          target="_blank"
          rel="noopener noreferrer"
        >
          WSO2 Sample Application
        </a>
      </footer>
    </div>
  )
}
