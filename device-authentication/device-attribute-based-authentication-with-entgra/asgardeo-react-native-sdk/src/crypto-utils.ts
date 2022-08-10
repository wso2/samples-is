/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com).
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { CryptoUtils, DecodedIDTokenPayload, JWKInterface, SUPPORTED_SIGNATURE_ALGORITHMS } from "@asgardeo/auth-js";
import { AsgardeoAuthException } from "@asgardeo/auth-js/src/exception";
import { decode as atob } from "base-64";
import Base64 from "crypto-js/enc-base64";
import utf8 from "crypto-js/enc-utf8";
import WordArray from "crypto-js/lib-typedarrays";
import sha256 from "crypto-js/sha256";
import { KEYUTIL, KJUR } from "jsrsasign";

export class ReactNativeCryptoUtils implements CryptoUtils {
    /**
     * Get URL encoded string.
     *
     * @param {CryptoJS.WordArray} value.
     * @returns {string} base 64 url encoded value.
     */
    public base64URLEncode(value: WordArray): string {
        return Base64.stringify(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    }

    public base64URLDecode(data: string): string {
        return Base64.parse(data).toString(utf8);
    }

    public hashSha256(data: string): WordArray {
        return sha256(data);
    }

    public generateRandomBytes(length: number): WordArray {
        return WordArray.random(length);
    }

    public parseJwk(key: Partial<JWKInterface>): Promise<any> {
        return KEYUTIL.getKey({
            alg: key.alg,
            e: key.e,
            kty: key.kty,
            n: key.n
        });
    }

    public verifyJwt(
        idToken: string,
        jwk: any,
        algorithms: string[],
        clientID: string,
        issuer: string,
        subject: string,
        clockTolerance?: number
    ): Promise<boolean> {
        const verification = KJUR.jws.JWS.verifyJWT(idToken, jwk, {
            alg: SUPPORTED_SIGNATURE_ALGORITHMS,
            aud: clientID,
            gracePeriod: clockTolerance,
            iss: [issuer],
            sub: subject
        });

        return Promise.resolve(verification);
    }
}
