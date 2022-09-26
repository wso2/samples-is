import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, Button, ButtonGroup, Panel, Placeholder, Stack, useToaster } from 'rsuite';
import decodeGetDetailedIdentityProvider from
  '../../../util/apiDecode/settings/identityProvider/decodeGetDetailedIdentityProvider';
import styles from "../../../styles/idp.module.css";

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
      <pre className={styles.idp__item__json__pre}> {JSON.stringify(idpDetails, null, 2)}</pre>
    </Panel>
  )
}

function IdentityProviderDetailsHeader(props) {
  return (
    <Stack justifyContent="space-between">
      <Stack justifyContent="space-between">
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
      <Button>Add to Login Flow</Button>
    </Stack>
  )
}

