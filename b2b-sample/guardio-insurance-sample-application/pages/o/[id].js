import React from 'react';

import { getSession } from 'next-auth/react';
import Settings from '../../components/settingsComponents/settings';
import { emptySession, parseCookies, redirect } from '../../util/util';
import { getOrg, getRouterQuery } from '../../util/util/orgUtil/orgUtil';

export async function getServerSideProps(context) {

  const session = await getSession(context);
  let setOrg = {};

  if(session == null || session == undefined){
    return emptySession(session);
  }

  if(session.expires){
    return redirect('/500');
  }

  const cookies = parseCookies(context.req);
  const subOrgId = cookies.orgId;

  if (subOrgId == undefined) {
    return redirect('/signin');
  } else {
    const routerQuery = context.query.id;
    if (routerQuery != getRouterQuery(subOrgId)) {
      return redirect('/404');
    } else if(session.error){
      return redirect('/500');
    } 
    else {
      setOrg = getOrg(subOrgId);
    }
  }

  return {
    props: { session, setOrg },
  }

}
export default function Org(props) {

  return (
    <Settings orgId={props.setOrg.id} routerQuery={props.setOrg.routerQuery} name={props.setOrg.name} colorTheme={props.setOrg.colorTheme} />
  )
}
