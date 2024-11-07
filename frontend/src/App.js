import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './api/AuthContext'; // Make sure this path is correct
import Login from './components/Login';
import Signup from './components/Signup';
import TodoLists from './components/TodoLists';
import TodoList from './components/TodoList';
import Header from './menu';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
                <TodoLists/>
            }
          />
          <Route
            path="/lists"
            element={
                <TodoLists/>
            }
          />
          <Route
            path="/lists/:listId"
            element={
                <TodoList/>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;




