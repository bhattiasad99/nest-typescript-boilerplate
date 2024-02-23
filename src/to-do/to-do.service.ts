import { CreateToDoDTO } from "@/dto.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ToDoService {
    private readonly todos: CreateToDoDTO[];

    constructor() {
        this.todos = []; // Initialize todos array
    }

    createToDo(toDoAction: string, createdBy: string): void {
        this.todos.push({
            action: toDoAction,
            complete: false,
            createdBy: createdBy
        })
    }

    findAll(): CreateToDoDTO[] {
        return this.todos;
    }

    findByUser(userId: string): CreateToDoDTO | undefined {
        const todo = this.todos.find(eachItem => eachItem.createdBy === userId);
        return todo
    }
}