import React from 'react';
import styles from "../../../../styles/idp.module.css";

export default function Raw(props) {
  return (
    <pre className={styles.idp__item__json__pre}> {JSON.stringify(props.idpDetails, null, 2)}</pre>
  )
}
