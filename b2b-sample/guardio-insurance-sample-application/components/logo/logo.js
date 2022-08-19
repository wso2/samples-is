import React from 'react'

export default function Logo(props) {
    return (
        <div>
            <h1 style={{
                fontSize: props.fontSize,
                letterSpacing: props.letterSpacing,
                wordSpacing: props.wordSpacing,
                fontFamily: `'Times New Roman', Times, serif`,
                color: `black`
            }}>
                <span style={{
                    color: `#0070f3`
                }}>
                    Guardio
                </span>
                <span style={{
                    color: `#a5a9b2`
                }}>
                    Insurance
                </span>

            </h1>
        </div>
    )
}
