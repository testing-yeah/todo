"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import GetTodo from "@/lib/getTodo";
import { useParams,useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UpdateTodo from "@/lib/updateTodo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  id: string;
  todo: string;
  description: string;
  isPending: boolean;
}


const Todo = () => {
  const [todoTitle, setTodoTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Fetch the specific Todo
  const { data: todo, error, refetch } = useQuery({
    queryKey: ["getTodo", params.id],
    queryFn: () => GetTodo(params.id as string),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (todo?.getTodo) {
      setTodoTitle(todo.getTodo.todo);
      setDescription(todo.getTodo.description);
      setIsPending(todo.getTodo.isPending);
    }
  }, [todo]);

  // Mutation for updating the Todo
  const { mutate: updateTodo } = useMutation({
    mutationFn: ({ id, todo, description, isPending }: Todo) =>
      UpdateTodo(id, todo, description, isPending),
    onSuccess: () => {
      router.push("/"); // Navigate to the desired route
      refetch();
    },
    onError: (err: Error) => {
      console.error("Error updating todo:", err.message);
    },
  });

  if (error) {
    return <p>Error fetching todo: {error.message}</p>;
  }

  if (!todo) {
    return <p>Todo not found</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Todo Details</h1>
      <div className="flex flex-col gap-4 w-full">
        <p className="text-lg">
          <span className="font-semibold">ID:</span> {todo.getTodo.id}
        </p>
        <Input
          placeholder="Enter your Todo"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <Textarea
          placeholder="Enter the description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2 items-center">
          <Checkbox
            id="status"
            checked={!isPending}
            onCheckedChange={(checked) => setIsPending(!checked)}
          />
          <label htmlFor="status" className="text-sm font-medium">
            Completed?
          </label>
        </div>
        <Button
          onClick={() =>
            updateTodo({
              id: params.id,
              todo: todoTitle,
              description,
              isPending,
            })
          }
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

export default Todo;
