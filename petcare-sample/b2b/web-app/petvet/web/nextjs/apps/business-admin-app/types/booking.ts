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

export interface Booking {
    appointmentNumber: number;
    date: string;
    doctorId: string;
    mobileNumber: string;
    petDoB: string;
    petId: string;
    petName: string;
    petOwnerName: string;
    petType: string;
    sessionEndTime: string;
    sessionStartTime: string;
    status: string;
    createdAt: string;
    emailAddress: string;
    id: string;
    org: string;
  }

export interface BookingResult {
    appointmentNumber: number;
    date: string;
    doctorId: string;
    mobileNumber: string;
    petDoB: string;
    petId: string;
    petName: string;
    petOwnerName: string;
    petType: string;
    sessionEndTime: string;
    sessionStartTime: string;
    status: string;
    createdAt: string;
    emailAddress: string;
    id: string;
    org: string;
    referenceNumber: string;
  }

export interface BookingInfo {
    date: string;
    doctorId: string;
    mobileNumber: string;
    petDoB: string;
    petId: string;
    petName: string;
    petOwnerName: string;
    petType: string;
    sessionEndTime: string;
    sessionStartTime: string;
  }  

export interface CompleteBooking{
    date: string;
    doctorId: string;
    email: string;
    mobileNumber: string;
    petDoB: string;
    petId: string;
    petName: string;
    petOwnerName: string;
    petType: string;
    sessionEndTime: string;
    sessionStartTime: string;
    status: string;
  }    
  
export interface AppointmentNoInfo {
  activeBookingCount: number;
  date: string;
  doctorId: string;
  nextAppointmentNumber: 0;
  sessionEndTime: string;
  sessionStartTime: string;
}
