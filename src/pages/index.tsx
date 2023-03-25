import React, { type FC } from 'react'
import { type NextPage } from 'next'

import { client } from '../apollo'
import { graphql } from '../gql/gql'
import { type RootQueryToPostConnection } from '../gql/graphql'
import useSWRInfinite, {
  unstable_serialize,
  type SWRInfiniteKeyLoader,
} from 'swr/infinite'

interface PostProps {
  title: string
}

const Post: FC<PostProps> = ({ title }) => {
  return <p>{title}</p>
}

interface HomeProps {
  posts: RootQueryToPostConnection
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

const fetcher = async (cursor: string | null) => {
  const { data, error } = await client.query({
    query,
    variables: { cursor },
  })

  // throw error here don't return like a Noob XD
  if (error) throw error

  return data
}

const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.posts) {
    return null
  }

  if (pageIndex === 0) {
    return [null]
  }

  return [previousPageData.posts.pageInfo.endCursor]
}

const Home: NextPage<HomeProps> = ({ posts }) => {
  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    fallback: {
      [unstable_serialize(getKey)]: [posts],
    },
  })

  // depicting how both of them match
  console.log('data from fetcher', data)
  console.log('default data', [posts])

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>

  return (
    <>
      {data.map((postPages) => {
        return postPages.posts?.edges.map((edge) => (
          <Post title={edge.node.title ?? ''} key={edge.node.title} />
        ))
      })}
      <button
        onClick={() => {
          setSize(size + 1)
        }}
      >
        Load more
      </button>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const { data } = await client.query({ query })

  return {
    props: {
      posts: data,
    },
  }
}
