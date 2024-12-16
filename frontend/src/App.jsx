
import './App.css'
import {BrowserRouter,Routes,Route, Outlet} from "react-router-dom"
import Update from './pages/UpdateTask'
import Login from './pages/Login'
import AdminDisplay from './pages/AdminDisplay'
import InsertUser from './pages/InsertUser'
import Test from './pages/test'
import UserDisplay from './pages/UserDisplay'
import CreateTask from './pages/CreateTask'
import TaskDetails from './pages/TaskDetails'
import Dashboard from './pages/Dashboard'
import ShowAllUser from './pages/ShowAllUser'
import UserTask from './pages/UserTask'
import ShowAllTasks from './pages/ShowAllTasks'
import UpdateTask from './pages/UpdateTask'
import PriorityManagement from './pages/PriorityManagement'


function App() {

  return (
    <>
      <BrowserRouter>
  <Routes>
    <Route path="/" >
      <Route index element={<Login />} />
      <Route path="AdminDisplay" element={<AdminDisplay />} />
      <Route path="Update" element={<Update />} />
      <Route path="Test" element={<Test />} />
      <Route path="Login" element={<Login />} />
      <Route path="/UserDisplay" element={<UserDisplay />} />
      <Route path="CreateTask" element={<CreateTask />} />
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="ShowAllUser" element={<ShowAllUser />} />
      <Route path="UserTask/:username" element={<UserTask />} />
      <Route path="ShowAllTasks" element={<ShowAllTasks/>} />
      <Route path="UpdateTask/:id" element={<UpdateTask/>} />
      <Route path="PriorityManagement" element={<PriorityManagement />} />
      <Route path="Dashboard" element={<Dashboard />} />

      <Route path="/taskDetails/:taskId" element={<TaskDetails />} />
      <Route path="InsertUser" element={<InsertUser />} />
    </Route>
  </Routes>
</BrowserRouter>


       <Outlet/>
    </>
  )
}

export default App
