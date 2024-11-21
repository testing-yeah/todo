'use client'
import { useQuery, gql } from '@apollo/client';

export default function Home() {

  const GET_USERS = gql`
  query {
    users {
      id
      username
      email
      todos {
        title
      }
    }
  }
`;
  const { loading, error, data } = useQuery(GET_USERS);
  console.log(data)

  return (
    <div>Hello</div>
  )
}
