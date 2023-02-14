import {
    BrowserRouter as Router,
    Routes, 
    Route,
} from 'react-router-dom'
import Homepage from './pages/Home/Home'
import Login from './pages/Login/Login'


function AppRoutes() {
    return(
        <Router>
            <Routes>
                <Route path='/home' element={<Homepage />}/>
                <Route path='/login' element={<Login />}/>
            </Routes>            
        </Router>
    )
}

export default AppRoutes