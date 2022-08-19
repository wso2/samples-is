import React from 'react'
import { FlexboxGrid, Panel } from 'rsuite'
import newsList from '../../../util/news/news.json'
import NewsComponent from './newsComponent'

export default function LatestNewsComponent() {
    return (
        <div>
            <br />
            <h3>Latest News</h3>
            <FlexboxGrid justify="start">
                {
                    newsList.news.map(news => {
                        return (
                            <FlexboxGrid.Item key={1} colspan={12}>
                                <Panel>
                                    <NewsComponent imgSrc={news.image} header={news.header} body={news.body}/>
                                </Panel>
                            </FlexboxGrid.Item>
                        )
                    })
                }
                 {
                    newsList.news.map(news => {
                        return (
                            <FlexboxGrid.Item key={2} colspan={12}>
                                <Panel>
                                    <NewsComponent imgSrc={news.image} header={news.header} body={news.body}/>
                                </Panel>
                            </FlexboxGrid.Item>
                        )
                    })
                }
            </FlexboxGrid>
        </div>

    )
}
