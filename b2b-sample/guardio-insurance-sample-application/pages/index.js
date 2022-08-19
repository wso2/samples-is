import Image from 'next/image'
import { Button } from 'rsuite'
import Logo from '../components/logo/logo'
import homeImage from '../public/home.jpeg'
import styles from '../styles/Home.module.css'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import "rsuite/dist/rsuite.min.css"

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
          <Logo fontSize={72} letterSpacing={-3} wordSpacing={`normal`} />
          <p className={styles.nameTag}>A relationship for life </p>
          <hr />
          <p className={styles.buttonTag}>Let&apos;s get your journey started. </p>
          <Button className={styles.signInDivButton} size="lg" appearance='primary' onClick={signinOnClick}>Sign In</Button>
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
