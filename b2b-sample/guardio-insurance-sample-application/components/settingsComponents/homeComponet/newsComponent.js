import Image from 'next/image';
import React from 'react';
import { Panel } from 'rsuite';
import image1 from '../../../public/news1.jpeg';
import image2 from '../../../public/news2.jpeg';
import image3 from '../../../public/news3.jpeg';
import image4 from '../../../public/news4.jpeg';
import { getCurrentDate } from '../../../util/util';

export default function NewsComponent(props) {
    return (
        <div>
            <Panel>
                <Image src={selectImage()} height={800} width={1000}/>
                <p><br /></p>
                <p>{getCurrentDate()}</p>
                <br />
                <h4>{props.header}</h4>
                <p>{props.body}</p>
            </Panel>
        </div>
    )
}

function selectImage(){
    var imageList = [image1,image2,image3,image4];
    return imageList[imageList.length * Math.random() | 0];
}
