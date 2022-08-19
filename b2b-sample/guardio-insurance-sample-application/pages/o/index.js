import { getSession } from 'next-auth/react';
import React from 'react'
import { redirect } from '../../util/util';
import config from '../../config.json';


export async function getServerSideProps(context) {
    
    const session = await getSession(context);
    const setVar = 1;

    if (!session) {
        return redirect('/signin');
    } 

    if (setVar==1) {
        return redirect(`/o/${config.SAMPLE_ORGS[0].routerQuery}`);
    } else {
        return redirect(`/o/${config.SAMPLE_ORGS[1].routerQuery}`);
    }

}

export default function OIndex() {
  return (
    <div>index</div>
  )
}
