import React from 'react'
import { Stack } from 'rsuite'

export default function SettingsTitle(props) {
    return (
        <Stack direction="column" alignItems="flex-start">
            <h2>{props.title}</h2>
            <p>{props.subtitle}</p>
        </Stack>
    )
}
