import React, { createContext, useContext, useEffect, useReducer } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import Header from './Componant/Header/Header';
import Home from './Componant/Home/Home';
import Profile from './Componant/Profile/Profile';
import CreatePost from './Componant/CreatePost/CreatePost';
import FollowingUser from './Componant/FollowingUser/FollowingUser';
import Signin from './Componant/Signin/Signin';
import Signup from './Componant/Signup/Signup';
import { customReducer, initialState } from './Componant/Reducer/UserReducer';
import UserProfile from './Componant/Profile/UserProfile';


export const UserContext = createContext()

const CustomRouting = () => {
  const history = useHistory()
  const [state, dispatch] = useContext(UserContext)
  useEffect( () => {
    const getUserFromLocalStorage = JSON.parse(localStorage.getItem('user'))
    if (getUserFromLocalStorage) {
      dispatch({type:"USER", payload:getUserFromLocalStorage})
      // history.push('/')
    }else{
      history.push('/sign-in')
    }
  }, [])

  return(
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route path="/profile">
        <Profile></Profile>
      </Route>
      <Route path="/create-post">
        <CreatePost></CreatePost>
      </Route>
      <Route path="/following-user-post">
        <FollowingUser></FollowingUser>
      </Route>
      <Route path="/sign-in">
        <Signin></Signin>
      </Route>
      <Route path="/signup">
        <Signup></Signup>
      </Route>
      <Route path="/user-profile/:userId">
        <UserProfile></UserProfile>
      </Route>
    </Switch>
  )
}


function App() {

  // dispatch === action
  const [state, dispatch] = useReducer(customReducer, initialState)

  return (
    <div>
      <UserContext.Provider value={[state, dispatch]}>
        <Router>
          <Header></Header>
          <CustomRouting/>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
