// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

package proxy

import (
	"bytes"
	"net/http"
)

type simpleResponseWriter struct {
	header            http.Header
	buffer            *bytes.Buffer
	code              int
	sessionID         string
	initialRequestURL string
}

func NewSimpleResponseWriter(sessionID string, initialRequestURL string) *simpleResponseWriter {
	return &simpleResponseWriter{
		header:            http.Header{},
		buffer:            bytes.NewBuffer([]byte{}),
		code:              http.StatusOK,
		sessionID:         sessionID,
		initialRequestURL: initialRequestURL,
	}
}

func (r *simpleResponseWriter) Header() http.Header {
	return r.header
}

func (r *simpleResponseWriter) Write(b []byte) (int, error) {
	return r.buffer.Write(b)
}

func (r *simpleResponseWriter) WriteHeader(statusCode int) {
	r.code = statusCode
	if r.sessionID != "" {
		SessionCookie := http.Cookie{
			Name:     "IG_SESSION_ID",
			Value:    r.sessionID,
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			MaxAge:   3600, // 1 hour in seconds
			SameSite: http.SameSiteLaxMode,
		}
		r.header.Add("Set-Cookie", SessionCookie.String())
	}
	if r.initialRequestURL != "" {
		RequestURLCookie := http.Cookie{
			Name:     "request_url",
			Value:    r.initialRequestURL,
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			MaxAge:   3600, // 1 hour in seconds
			SameSite: http.SameSiteLaxMode,
		}
		r.header.Add("Set-Cookie", RequestURLCookie.String())
	}
}
