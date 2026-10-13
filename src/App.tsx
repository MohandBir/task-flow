import { useEffect, useState } from "react";
import TodoItem from "./todoItem";
import { Construction } from "lucide-react";

type Priority = "Urgente" | "Moyenne" | "Basse";
type Todo = {
  id: number;
  text: string;
  priority: Priority
}
function App() {

  const [input, setInput] = useState(""); //la champ de input est string par defaut , pas obligatoire de rajouter <string>
  const [priority, setPriority] = useState<Priority>("Moyenne"); 

  const savedTodos = localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  const [todos , setTodos] = useState<Todo[]>(initialTodos); 
  const [filter, setFiter] = useState<Priority | "Tous">("Tous")

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    if (input.trim() == "") {
      return;
    } 

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority
    }

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
  }

  let filteredTodos: Todo[] = []
 
  if (filter === "Tous"){
    filteredTodos = todos
  }else {
    filteredTodos = todos.filter((todo) => todo.priority === filter)
  }

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length;
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length;
  const lowCount = todos.filter((t) => t.priority === "Basse").length;
  const totalCount = todos.length;

  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
  }

  return (
   <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input 
            type="text" 
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <select
            className="selct w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          > 
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
          <button
            className="btn btn-primary"
            onClick={addTodo} >
            Ajouter
          </button>
        </div>
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex flex-wrap gap-4">
            <button
              className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
              onClick={() => setFiter("Tous")} >
            Tous ({totalCount})
            </button>
            <button
              className={`btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}`}
              onClick={() => setFiter("Urgente")} >
            Urgente ({urgentCount})
            </button>
            <button
              className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`}
              onClick={() => setFiter("Moyenne")} >
            Moyenne ({mediumCount})
            </button>
            <button
              className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`}
              onClick={() => setFiter("Basse")} >
            Basse ({lowCount})
            </button>
          </div>
          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              { filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem 
                  todo={todo}
                  onDelete={() => {deleteTodo(todo.id)}}
                  />
                </li>
                ))}
            </ul>
        
          ) : (
            <div>
              <div className="flex justify-center items-center flex-col p-5">
                <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
              </div>
              <p className="text-small"> Aucun tâche pour ce filtre </p>
            </div>
          )
        }
        </div>
      </div>
   </div>
  )
}

export default App
