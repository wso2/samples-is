import React from 'react';
import { Notification } from 'rsuite';

function Dialog(props) {
    return (
        <Notification type={props.type} header={props.header} closable>
            {props.body}
        </Notification>
    )
}

function showDialog(toaster,type,header,body) {
    toaster.push(<Dialog type={type} header={header} body={body} />, {
        placement: 'bottomStart'
    });

    setTimeout(() => toaster.remove(),2500);
}

function successTypeDialog(toaster, header, body) {
    showDialog(toaster,'success',header,body);
}

function errorTypeDialog(toaster, header, body) {
    showDialog(toaster,'error',header,body);
}

function infoTypeDialog(toaster, header, body) {
    showDialog(toaster,'info',header,body);
}

module.exports = { successTypeDialog, errorTypeDialog, infoTypeDialog }