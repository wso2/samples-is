import json

# This is the class which read and hold configurations from the configuration file.
class configuration_manager:
    def __init__(self, config_file):
        try:
            with open(config_file, 'r') as file:
                self.config_data = json.load(file)
        except FileNotFoundError:
            raise FileNotFoundError(f"Config file '{config_file}' not found.")
        except json.JSONDecodeError:
            raise ValueError(f"Error decoding JSON in '{config_file}'.")
        
    # This method is to retrieve the configurations of the email sender.
    def get_email_notification_manager_config(self):

        return self.config_data["email_configurations"]
    
    # This method is to retrieve the configurations of the WSO2 IS Server.
    def get_is_server_config(self):

        return self.config_data["is_server_config"]
        