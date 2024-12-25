import { Priority, PrismaClient, Status } from "@prisma/client";
import { DELETE_TODO_MUTATION, GET_TODO_BYID, GET_TODO_QUERY, TODO_MUTATION,UPDATE_TODO } from '../GraphQL/GetToDoGQL/getToDo';
import { log } from "util";
const prisma = new PrismaClient();

interface TaskInput {
    userId: string;
    title: string;
    task_description: string;
    dueDate?: Date;
    status?: Status;
    priority?: Priority;
}

interface UpdateTaskInput {
    title: string;
    task_description: string;
    dueDate: string;
    status: Status;
    priority: Priority;
    task_id: string;
}
export const getAllTasks = async (userId: string) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_TODO_QUERY,
                variables: { userId },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in adding data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.getTodos;
    } catch (error) {
        console.error(error)
    }
}

export const getTaskById = async (task_id: string) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_TODO_BYID,
                variables: { task_id },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in adding data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.getTodoById;
    } catch (error) {
        console.error(error)
    }
}

export const createTask = async (userId: string, data: TaskInput) => {
    const final_data = { ...data, userId }
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: TODO_MUTATION,
                variables: { ...final_data },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in adding data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        
        return result.data.createTodo;
    } catch (error) {
        console.error(error)
    }
}

export const updateTask = async (task_id: string, data: UpdateTaskInput) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: UPDATE_TODO,
                variables: {
                    task_id,
                    data
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in update data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.createUser;
    } catch (error) {
        console.error(error)
    }
};


export const deleteTask = async (task_id: string) => {
    try {
        const response = await fetch(`http://localhost:5000/graphql`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: DELETE_TODO_MUTATION,
                variables: { task_id },
            }),
        });
        if (!response.ok) {
            throw new Error(`Error in delete data: ${response.statusText}`);
        }
        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0]?.message || 'GraphQL errors occurred');
        }
        return result.data.createUser;
    } catch (error) {
        console.error(error)
    }
}

export const completeTask = async (task_id: string) => {
    const task = await prisma.task.findUnique({ where: { task_id } });
    if (!task) throw { status: 404, message: 'Task not found' };
    return prisma.task.update({ where: { task_id }, data: { status: 'COMPLETED' } });
}
