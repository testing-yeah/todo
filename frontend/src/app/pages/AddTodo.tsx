"use client";

import { useMutation, useQuery } from "@apollo/client";
import React, { useState, FormEvent, useEffect } from "react";
import {
  AddTodoResponse,
  AddTodoVariables,
  DELETE_TODO,
  DeleteTodoResponse,
  DeleteTodoVariables,
  EDIT_TODO,
  GET_USER_TODOS,
  GetUserTodosResponse,
  GetUserTodosVariables,
  addTodoMut,
} from "../lib/graphql";
import TodoList from "./TodoList";

const AddTodo: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const sessionid = localStorage.getItem("token");

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const [userTodos, setUserTodos] = useState<
    GetUserTodosResponse["getUserTodos"]
  >([]);

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery<GetUserTodosResponse, GetUserTodosVariables>(GET_USER_TODOS, {
    variables: { userId: sessionid },
  });

  // Set the userTodos when data is fetched
  useEffect(() => {
    if (data && data?.getUserTodos) {
      setUserTodos(data.getUserTodos);
    }
  }, [data]);

  // Mutation for adding a todo
  const [addTodo, { loading }] = useMutation<AddTodoResponse, AddTodoVariables>(
    addTodoMut
  );

  // Mutation for deleting a todo
  const [deleteTodo] = useMutation<DeleteTodoResponse, DeleteTodoVariables>(
    DELETE_TODO
  );

  // Mutation for editing a todo
  const [editTodo] = useMutation(EDIT_TODO);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (editingTodoId) {
        // Editing an existing todo
        const { data } = await editTodo({
          variables: {
            id: editingTodoId,
            token: sessionid,
            title,
            description,
          },
        });

        if (data?.editTodo) {
          alert("Todo updated successfully!");
          setUserTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === editingTodoId ? { ...todo, title, description } : todo
            )
          );
          setEditingTodoId(null);
          setTitle("");
          setDescription("");
        }
      } else {
        // Adding a new todo
        const { data } = await addTodo({
          variables: { title, description, token: sessionid, completed: false },
        });

        if (data?.addTodo) {
          alert("Todo added successfully!");
          // Append the new todo to the state
          setUserTodos([...userTodos, data.addTodo]);
          setTitle("");
          setDescription("");
        }
      }
    } catch (error) {
      console.log("Error handling todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Call delete mutation
      const { data } = await deleteTodo({
        variables: { id, token: sessionid },
      });

      if (data?.deleteTodo) {
        // Remove deleted todo from the userTodos state
        setUserTodos(userTodos.filter((todo) => todo.id !== id));
        alert("Todo deleted successfully!");
      }
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const handleEdit = (id: number) => {
    const todoToEdit = userTodos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setEditingTodoId(id);
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 my-10">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            {editingTodoId ? "Edit Todo" : "Add Todo"}
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="title" className="sr-only">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Title"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="sr-only">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Description"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading
                  ? "Saving..."
                  : editingTodoId
                  ? "Update Todo"
                  : "Add Todo"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {queryLoading ? (
        <div className="text-center">Loading todos...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error loading todos</div>
      ) : (
        <div className="mx-20 border-2 border-black mb-10">
          <TodoList
            userTodos={userTodos}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      )}
    </>
  );
};

export default AddTodo;
