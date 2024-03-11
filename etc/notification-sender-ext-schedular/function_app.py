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

import azure.functions as func
import logging
from configuration_manager import *
from email_notification_manager import *
from is_server_utils import *

app = func.FunctionApp()
config_manager = configuration_manager("config.json")
is_utils =  is_server_utils(config_manager.get_is_server_config())
notification_manager = email_notification_manager(config_manager.get_email_notification_manager_config())

@app.schedule(schedule="0 0 */2 * * *", arg_name="myTimer", run_on_startup=True,
              use_monitor=False) 
def timer_trigger(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.info('The timer is past due!')

    logging.info("***************** Starting the schedular task *****************")
    is_utils.get_access_token()
    passowrd_expired_users = is_utils.get_password_expired_user_list()

    # Send email to each user whose password has been expired.
    for user in passowrd_expired_users:
            user_id = user["userId"]
            reciever_email = is_utils.get_email_address(user_id)
            notification_manager.send_email(reciever_email)

    logging.info("***************** Completed the schedular task *****************")

