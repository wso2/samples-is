# Guardio Insurance Sample Application

Guardio Insurance Sample Application repository contains an application that demonstrate capabilities of the organisation management feature in the WSO2 Identity Sever.

## Prerequesites
You need to install ```nodejs``` >14.

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Additionally
* If the federated organization id is returned in the idToken (in user_organization variable) when a user is logging into an organization, remove the `ApplicationConfig.SampleOrganization` section from the <i>config.json</i> file.

#### If you are using the app with [Asgardeo](https://wso2.com/asgardeo/)
* When creating or editing a user, make sure to append `DEFAULT/` to the username of the user.
