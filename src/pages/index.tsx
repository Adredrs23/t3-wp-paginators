import React, { type FC } from 'react'
import { type NextPage } from 'next'

// import { client } from '../apollo'
import { graphql } from '../gql/gql'
import { type RootQueryToPostConnectionEdge } from '../gql/graphql'
import { useQuery } from '@apollo/client'

interface PostProps {
  title: string
}

const Post: FC<PostProps> = ({ title }) => {
  return <p>{title}</p>
}

interface HomeProps {
  posts: Array<RootQueryToPostConnectionEdge>
}

const query = graphql(`
  query GetPosts($cursor: String) {
    posts(
      first: 3
      after: $cursor
      where: { orderby: { order: ASC, field: MENU_ORDER } }
    ) {
      edges {
        node {
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`)

const Home: NextPage<HomeProps> = () => {
  const { data, loading, fetchMore } = useQuery(query)

  if (loading) return <p>Loading...</p>

  if (!data) return <p>Nothing found!</p>

  const nodes = data.posts?.edges.map((edge) => edge.node)
  const pageInfo = data.posts?.pageInfo

  return (
    <>
      {nodes?.map((nodeItem, index) => (
        <Post title={nodeItem.title ?? ''} key={index} />
      ))}
      <button
        onClick={() => {
          if (pageInfo && pageInfo.hasNextPage) {
            fetchMore({
              variables: {
                cursor: pageInfo.endCursor,
              },
            })
          }
        }}
      >
        Load more
      </button>
    </>
  )
}

export default Home

// export async function getStaticProps() {
//   // const { data } = await client.query({ query })

//   return {
//     props: {
//       // posts: data.posts?.edges,
//     },
//   }
// }
