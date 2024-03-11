#
# Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
#
# WSO2 LLC. licenses this file to you under the Apache License,
# Version 2.0 (the "License"); you may not use this file except
# in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.
#

import json
import logging
import requests
import sys
from datetime import datetime, timedelta

# This is the class which contains the utils for the WOS2 IS Server.
class is_server_utils:
    def __init__(self, is_server_config):

        self.access_token = None

        # IS Server related configurations.
        self.client_key = is_server_config["client_id"]
        self.client_password = is_server_config["client_secret"]
        self.organization = is_server_config["organization"]
        self.hostname = is_server_config["hostname"]
        self.alert_before_in_days = is_server_config["alert_before_in_days"]

        # IS server APIs.
        self.inactive_user_retrieval_endpoint_url = f"https://{self.hostname}/t/{self.organization}/api/server/v1/password-expired-users"
        self.user_scim2_endpoint = f"https://{self.hostname}/t/{self.organization}/scim2/Users/"
        self.token_endpoint = f"https://{self.hostname}/t/{self.organization}/oauth2/token"
        self.required_scope_list = "SYSTEM"

    # This method is to retrieve the access token with client credentials.
    def get_access_token(self):

        data = {
            "grant_type": "client_credentials",
            "scope": self.required_scope_list
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        response = requests.post(self.token_endpoint, data=data, headers=headers, auth=(self.client_key, self.client_password))

        if response.status_code != 200:
            logging.error("Error occured while obtaining an access token. Response: " + json.dumps(response.json()))
            sys.exit()

        self.access_token = response.json()["access_token"]
    
    # This method is to retrieve the list of user Ids whose password has been expired.
    def get_password_expired_user_list(self):

        expired_after = datetime.now() + timedelta(days=self.alert_before_in_days)
        exclude_after = expired_after + timedelta(days=1)

        params = {'expiredAfter': expired_after.strftime("%Y-%m-%d"), 'excludeAfter': exclude_after.strftime("%Y-%m-%d")}
        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = requests.get(self.inactive_user_retrieval_endpoint_url, params=params, headers=headers)
        
        if response.status_code != 200:
            logging.error("Error occured while obtaining an password expired users. Response: " + json.dumps(response.json()))
            sys.exit()

        return response.json()

    # This method is to retrieve the email address for the given user Id.
    def get_email_address(self, user_id):

        headers = {'Authorization': f'Bearer {self.access_token}'}
        response = requests.get(self.user_scim2_endpoint + user_id, headers=headers)

        if response.status_code != 200:
            logging.error("Error occured while obtaining an password expired users. Response: " + json.dumps(response.json()))
            sys.exit()
        
        return response.json()["emails"][0] 
