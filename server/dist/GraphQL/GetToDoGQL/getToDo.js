"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPLETE_TODO = exports.DELETE_TODO_MUTATION = exports.UPDATE_TODO = exports.TODO_MUTATION = exports.GET_TODO_BYID = exports.GET_TODO_QUERY = void 0;
exports.GET_TODO_QUERY = `
  query GetTodos($userId: String!) {
    getTodos(userId: $userId) {
      task_id
      title
      task_description
      dueDate
      status
      priority
    }
  }
`;
exports.GET_TODO_BYID = `
  query GetTodoById($task_id: String!) {
    getTodoById(task_id: $task_id ) {
      task_id
      title
      task_description
      dueDate
      status
      priority
    }
  }
`;
exports.TODO_MUTATION = `
  mutation CreateTodo(
    $userId: String!, 
    $title: String!, 
    $task_description: String!, 
    $dueDate: DateTime, 
    $priority: Priority!
  ) {
    createTodo(
      userId: $userId, 
      title: $title, 
      task_description: $task_description, 
      dueDate: $dueDate, 
      priority: $priority
    ) { 
      task_id
      title
      task_description
      dueDate
      status
      priority
    }
  }
`;
exports.UPDATE_TODO = `
  mutation UpdateTask($task_id: String!, $data: UpdateTaskInput!) {
    updateTask(task_id: $task_id, data: $data) {
         task_id
        title
        task_description
        dueDate
        status
        priority
        createdAt
        updatedAt
    }
}

`;
exports.DELETE_TODO_MUTATION = `
  mutation DeleteTodo($task_id: String!) {
    deleteTodo(task_id: $task_id ) {
      task_id
    }
  }
`;
exports.COMPLETE_TODO = `
  mutation CompleteTodo($task_id: String!) {
    updateTask(where: { task_id: $task_id }, data: { status: COMPLETED }) {
      task_id
      title
      status
      updatedAt
    }
  }
`;
