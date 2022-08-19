import styles from '../../styles/Settings.module.css';
import Logo from '../logo/logo';

export default function LogoComponent(props) {
    return <div className={styles.logoDiv}>
        <Logo fontSize={28} letterSpacing={-2} wordSpacing={`normal`} />
        <p className={styles.nameTag}>A relationship for life </p>
        <hr />
        <h5 className={styles.nameTag}>{props.name}</h5>
        <hr />
    </div>;
}