import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TodoItem {
  id: number;
  task: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgFor, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todo-list-app';

  /*todoList : TodoItem[] = [];
  newTask: string = '';

  addTask() : void {
    if (this.newTask.trim() !== ''){
      const newTodoItem: TodoItem = {
        id : Date.now(),
        task : this.newTask,
        completed : false
      }

      this.todoList.push(newTodoItem);
      this.newTask = '';
    }
  }

  deleteTask(id: number): void {
    this.todoList = this.todoList.filter(item => item.id !== id)
  }

  toggleCompleted(id : number): void {
    console.log(id);

    const todoItem = this.todoList.find(item => item.id === id);
    console.log(id);
    if (todoItem) {
      todoItem.completed = !todoItem.completed;
    }
  }*/

    todoList: TodoItem[] = [];
  newTask: string = '';
  private apiUrl = 'http://localhost:3000/api/todos';  // Cambia la URL si es necesario

  constructor(private http: HttpClient) {
    this.loadTodos();  // Cargar las tareas al inicio
  }

  // Método para manejar errores
  handleError(error: any) {
    console.error('Error:', error);
  }

  // Cargar todas las tareas (GET) usando async/await y firstValueFrom
  async loadTodos() {
    try {
      const todos = await firstValueFrom(this.http.get<TodoItem[]>(this.apiUrl));
      this.todoList = todos || [];  // Manejar el caso donde `todos` sea undefined
    } catch (error) {
      this.handleError(error);
    }
  }

  // Agregar una nueva tarea (POST) usando async/await y firstValueFrom
  async addTask() {
    if (this.newTask.trim()) {
      try {
        const newTodo = await firstValueFrom(this.http.post<TodoItem>(this.apiUrl, { task: this.newTask }));
        if (newTodo) {
          this.todoList.push(newTodo);
          this.newTask = '';  // Limpiar el campo de entrada
        } else {
          console.error('Error: No se pudo agregar la tarea. El resultado es undefined.');
        }
      } catch (error) {
        this.handleError(error);
      }
    }
  }

  // Alternar el estado de completado de una tarea (PUT) usando async/await y firstValueFrom
  async toggleCompleted(todo: TodoItem) {
    try {
      await firstValueFrom(this.http.put<void>(`${this.apiUrl}/${todo.id}`, { completed: !todo.completed }));
      todo.completed = !todo.completed;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Eliminar una tarea (DELETE) usando async/await y firstValueFrom
  async deleteTask(id: number) {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      this.todoList = this.todoList.filter(todo => todo.id !== id);
    } catch (error) {
      this.handleError(error);
    }
  }

}