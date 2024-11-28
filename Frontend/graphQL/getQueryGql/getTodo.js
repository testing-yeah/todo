import { gql } from "apollo-boost";

export const GET_TODO_QUERY = `
query getTodo {
  getTodoByUser {
    id
    title
    description
    completed
  }
}`

export const TODO_MUTATION = `
mutation createTodo($title: String!, $description: String!) {
createTodo(title: $title, description: $description) {
 id
 title
 description
}}`;

export const DELETE_TODO_MUTATION = `
mutation DeleteTodo($id: ID!) {
   deleteTodo(id: $id)
}`;

export const GET_TODO_BYID = `
  mutation gettodobyid($id: ID!) {
   getTodoById(id: $id){
    id
    title
    description
    completed
   }
}`;

export const UPDATE_TODO = `
  mutation updatetodo($id: ID!,$title:String!,$description:String!,$completed:Boolean!) {
   updateTodo(id: $id,title:$title,description:$description,completed:$completed){
    id
    title
    description
    completed
   }
}`;

export const COMPLETE_TODO = ` 
  mutation completeTodo($id:ID!,$completed:Boolean!) {
    completedTodo(id:$id,completed:$completed){
         id
      title
      description
      completed
    }
  }
`