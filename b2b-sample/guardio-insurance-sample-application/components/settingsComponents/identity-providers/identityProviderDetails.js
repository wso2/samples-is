import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, Nav, Panel, Stack, useToaster } from 'rsuite';
import styles from "../../../styles/idp.module.css";
import decodeGetDetailedIdentityProvider from '../../../util/apiDecode/settings/identityProvider/decodeGetDetailedIdentityProvider';
import ButtonGroupIdentityProviderDetails from './buttonGroupIdentityProviderDetails';

export default function IdentityProviderDetails(props) {

  const toaster = useToaster();
  const [idpDetails, setIdpDetails] = useState({});

  const fetchData = useCallback(async () => {
    const res = await decodeGetDetailedIdentityProvider(props.session, props.id);
    setIdpDetails(res);
  }, [props])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Panel header={
      <IdentityProviderDetailsHeader idpDetails={idpDetails} />
    } eventKey={props.id} id={props.id}>
      <Stack direction='column' alignItems='left'>
        <ButtonGroupIdentityProviderDetails id={props.id} fetchAllIdPs={props.fetchAllIdPs}/>
        <Nav appearance="subtle" activeKey="home" style={{ marginBottom: 10 }}>
          <Nav.Item eventKey="general">General</Nav.Item>
          <Nav.Item eventKey="settings">Settings</Nav.Item>
          <Nav.Item eventKey="raw">Raw</Nav.Item>
        </Nav>
        <pre className={styles.idp__item__json__pre}> {JSON.stringify(idpDetails, null, 2)}</pre>
      </Stack>
    </Panel>
  )
}

function IdentityProviderDetailsHeader(props) {
  return (
    <Stack>
      <Stack>
        <Avatar
          style={{ background: '#000', marginRight: "20px" }}
          size="lg"
          circle
          src={props.idpDetails.image}
          alt="IDP image"
        />
        <Stack direction='column' justifyContent='flex-start' alignItems='left'>
          <h4>{props.idpDetails.name}</h4>
          <p>{props.idpDetails.description}</p>
        </Stack>
      </Stack>

    </Stack>
  )
}

/**
 * {
 *  General : {
 *              Name : "", Desc: ""
 *            },
 *  Settings : {
 *              Client Id, Client Secret, Authorized redirect URI, Additional Query Parameters
 *            }
 *  Raw : Full JSON object
 * }
 * 
 */