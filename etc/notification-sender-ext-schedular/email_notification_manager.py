import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

email_subject = "Your Password Has Expired"
email_body = "Hi there,\n\nYour password has been expired. Please reset your password."

# This is the class which reposibe for sending email notifications.
class email_notification_manager:
    def __init__(self, email_config):
        self.smtp_server = email_config["smtp_server"]
        self.smtp_port = email_config["smtp_port"]
        self.sender_email = email_config["sender_email"]
        self.sender_password = email_config["sender_password"]

    # This method is to send the email to the given email address.
    def send_email(self, reciever_email):

        message = MIMEMultipart()
        message['From'] = self.sender_email
        message['To'] = reciever_email
        message['Subject'] = email_subject
        message.attach(MIMEText(email_body, 'plain'))

        # Connect to SMTP server and send email
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.sender_email, self.sender_password)

            server.sendmail(self.sender_email, reciever_email, message.as_string())
            logging.info("Passowrd expired notification is send to the email address:" + reciever_email)
