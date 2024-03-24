/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

export interface Doctor {
    address: string;
    availability: Availability[];
    dateOfBirth: string;
    emailAddress: string;
    gender: string;
    name: string;
    registrationNumber: string;
    specialty: string;
    createdAt: string;
    id: string;
    org: string;
}

export interface DoctorInfo {
    address?: string;
    availability?: Availability[];
    dateOfBirth?: string;
    emailAddress: string;
    gender?: string;
    name: string;
    registrationNumber: string;
    specialty?: string;
}

export interface Availability {
    date: string;
    timeSlots: TimeSlot[];

}

export interface TimeSlot {
    availableBookingCount: number;
    endTime: string;
    startTime: string;
}

export interface OrgInfo {
    address: string;
    name: string;
    registrationNumber: string;
    telephoneNumber: string;
    orgName: string;
}

export interface UpdateOrgInfo {
    address: string;
    name: string;
    registrationNumber: string;
    telephoneNumber: string;
}
