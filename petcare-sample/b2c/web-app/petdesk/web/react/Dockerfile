FROM node:16-alpine3.17 as builder

# Build arguments for user/group configurations
ARG USER_ID=10001
ARG USER_GROUP_ID=10001
ARG USER_HOME=/home/app

# Create app directory
WORKDIR ${USER_HOME}

# Copy the rest of the application code to the container
COPY --chown=${USER_ID}:${USER_GROUP_ID} . .

# Set environment variables
ENV HOST="0.0.0.0"
ENV DISABLE_DEV_SERVER_HOST_CHECK=true
ENV HTTPS=false

# Install dependencies
# RUN npm install --save --legacy-peer-deps 
RUN npm install

USER 10001

EXPOSE 3000

# Start the application
CMD ["npm", "start", "--cache", "/tmp"]
