import React, { type FC } from 'react'
import { type NextPage } from 'next'

import { client } from '../apollo'
import { graphql } from '../gql/gql'
import { type RootQueryToPostConnectionEdge } from '../gql/graphql'

interface PostProps {
  title: string
}

const Post: FC<PostProps> = ({ title }) => {
  return <p>{title}</p>
}

interface HomeProps {
  posts: Array<RootQueryToPostConnectionEdge>
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  return (
    <>
      {posts.map((nodeItem, index) => (
        <Post title={nodeItem.node.title ?? ''} key={index} />
      ))}
    </>
  )
}

export default Home

const query = graphql(`
  query GetPosts {
    posts(where: { orderby: { order: ASC, field: MENU_ORDER } }) {
      edges {
        node {
          title
        }
      }
    }
  }
`)

export async function getStaticProps() {
  const { data } = await client.query({ query })

  return {
    props: {
      posts: data.posts?.edges,
    },
  }
}
