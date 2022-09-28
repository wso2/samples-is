import React from 'react'
import { Form, Stack } from 'rsuite'
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';

export default function HelperText(props) {
    return (
        <Stack style={{ marginTop: "5px" }}>
            <InfoOutlineIcon style={{ marginRight: "10px", marginLeft: "2px" }} />
            <Form.HelpText>{props.text}</Form.HelpText>
        </Stack>
    )
}
