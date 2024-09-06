# Pet Management Web App

## Prerequisites:

- Node.js (version 10 or above).

### Build the source

```bash
npm install
```

### Export Environment Variables

Replace the values correctly, then export them to the terminal.
```
export NEXTAUTH_URL=http://localhost:3001
export BASE_ORG_URL=https://api.asgardeo.io/t/<ParentOrg>
export CHANNELLING_SERVICE_URL=<CHANNEL_SERVICE_URL>
export PET_MANAGEMENT_SERVICE_URL=<PET_SERVICE_URL>
export HOSTED_URL=http://localhost:3001
export SHARED_APP_NAME=<APPLICATION_NAME>
export CLIENT_ID=<CLIENT_ID_OF_SHARED_APP>
export CLIENT_SECRET=<CLIENT_SECRET_OF_SHARED_APP>
export MANAGEMENT_APP_CLIENT_ID=<CLIENT_ID_OF_MANAGEMENT_APP>
export MANAGEMENT_APP_CLIENT_SECRET=<CLIENT_ID_OF_MANAGEMENT_APP>
```

### Run the Application

- Run in Developer Mode
  ```bash
  npx nx serve business-admin-app
  ```

- Run in Production Mode
  ```bash
  npx nx serve business-admin-app:build:production
  cp server.js dist/apps/business-admin-app/
  cd dist/apps/business-admin-app/
  export NODE_ENV=production
  export NEXTAUTH_SECRET=V9Ogd83zDs4BtBqZf7rw7fVx/7KrYQfA+8LO2BMuJvo=
  node server.js
  ```

  The app should open at [`http://localhost:3001`](http://localhost:3001)

  