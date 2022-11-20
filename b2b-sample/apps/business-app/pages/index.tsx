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

import { LogoComponent } from "@b2bsample/shared/ui-components";
import Image from "next/image";
import { useRouter } from "next/router";
import React ,{ useEffect } from "react";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import homeImage from "../../../libs/shared/ui-assets/src/lib/images/home.jpeg";
import styles from "../styles/Home.module.css";

/**
 * 
 * @returns - First interface of the app
 */
export default function Home() {

    const router = useRouter();
    const signinOnClick = () => {
        router.push("/signin");
    };

    useEffect(() => {
        document.body.className = "";
    }, []);

    return (
        <div className={ styles.container }>
            <main className={ styles.main }>

                <Image src={ homeImage } className={ styles.homeImageDiv } alt="home image" />

                <div className={ styles.signInDiv }>
                    <LogoComponent imageSize="medium" />

                    <hr />
                    <p className={ styles.buttonTag }>Let&apos;s get your journey started. </p>
                    <Button
                        className={ styles.signInDivButton }
                        size="lg"
                        appearance="primary"
                        onClick={ signinOnClick }>Sign In</Button>
                </div>

            </main>

            <footer className={ styles.footer }>
                <a
                    href="https://wso2.com/asgardeo/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    WSO2 Sample Application
                </a>
            </footer>
        </div>
    );
}
