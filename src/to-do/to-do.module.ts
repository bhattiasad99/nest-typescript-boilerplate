import { Module } from "@nestjs/common";
import { ToDoController } from "./to-do.controller";
import { ToDoService } from "./to-do.service";

@Module({
    imports: [],
    providers: [ToDoService],
    controllers: [ToDoController]
})

export class ToDoModule { }