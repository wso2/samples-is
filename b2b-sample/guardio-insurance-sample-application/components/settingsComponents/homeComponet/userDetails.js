import Image from 'next/image';
import React from 'react';
import profileImage from '../../../public/profile.svg';
import styles from '../../../styles/Settings.module.css';

export default function UserDetails(props) {
    return (
        <div className={styles.userDetails}>
            <div className={styles.userDetailsBody}>
                <p><b>First Name : </b>{props.me.name}</p>
                <p><b>ID : </b>{props.me.id}</p>
                <p><b>Username : </b>{props.me.username}</p>
                <p><b>Email : </b>{props.me.email}</p>
            </div>
            <div className={styles.profileImage}>
                <Image src={profileImage} alt="profile image" />
            </div>

        </div>
    )
}
