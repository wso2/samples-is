import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Modal, ButtonToolbar, Button } from 'rsuite';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';

import styles from '../../styles/util.module.css';

export default function SuccessDialog(props) {

    return (
        <Modal backdrop="static" role="alertdialog" open={props.open} onClose={props.onClose} size="xs">
            <Modal.Body>
                <div className={styles.successDialogDiv}>
                    <CheckOutlineIcon style={{ color: '#0070f3', fontSize: 36 }} />
                    <h6>User added Successfully.</h6>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className={styles.successDialogFooterDiv}>
                    <Button onClick={props.onClose} appearance="primary" style={{
                        width:"25%"
                    }}>
                        Okay
                    </Button>
                </div>

            </Modal.Footer>
        </Modal>
    )
}
