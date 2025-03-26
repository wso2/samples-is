FROM node:18-alpine

# Build arguments for user/group configurations
ARG USER=asgusr
ARG USER_ID=10001
ARG USER_GROUP=asggrp
ARG USER_GROUP_ID=10001
ARG USER_HOME=/home/app

# Create a user group and a user
RUN addgroup -S -g ${USER_GROUP_ID} ${USER_GROUP} \
    && adduser -S -D -h ${USER_HOME} -G ${USER_GROUP} -u ${USER_ID} ${USER}

# Create app directory
WORKDIR ${USER_HOME}

# Set a non-root user
USER ${USER_ID}

# Copy the rest of the application code to the container
COPY --chown=${USER}:${USER_GROUP} . .

# Set environment variables
ENV HOST="0.0.0.0"
ENV DISABLE_DEV_SERVER_HOST_CHECK=true
ENV HTTPS=false

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
