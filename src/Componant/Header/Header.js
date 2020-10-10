import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import './Header.css'

const Header = () => {

   const [isCollapsed , setCollapsed] = useState(null);
   const [isSticky, setSticky] = useState(false);

   useEffect(() => {
      window.addEventListener("scroll", () => {
         if(window.scrollY > 10){
         setSticky(true)
         }else{
         setSticky(false)
         }
      })
   }, []);

   // Make Logical Navigation var
   const [state, dispatch] = useContext(UserContext)
   const logicalNav = () => {
      if (state) {
         return [
            <li className="nav-item active">
               <Link className="nav-link" to="/">Home</Link>
            </li>,
            <li className="nav-item">
               <Link className="nav-link"  to="/profile">Profile</Link>
            </li>,
            <li className="nav-item">
               <Link className="nav-link"  to="/create-post">Create Post</Link>
            </li>,
            <li className="nav-item">
               <Link className="nav-link"  to="/following-user-post">Following Post</Link>
            </li>
         ]
      }else{
         return [
            <li className="nav-item">
               <Link className="nav-link"  to="/sign-in">Sign In</Link>
            </li>,
            <li className="nav-item">
               <Link className="nav-link"  to="/signup">Signup</Link>
            </li>
         ]
      }
   }

   return (
      <div className="header">
         <nav className={ (isSticky || isCollapsed) ? "shadow-sm navbar navbar-expand-sm bg-white navbar-light py-2  fixed-top slide" : "navbar navbar-expand-sm bg-light navbar-light py-3 fixed-top slide"}>
            
         <div className="container">
            <Link to={state ? '/' : '/sign-in'} className="navbar-brand"><strong className="logo">Instagram</strong></Link>
            <button onClick={
               () => setCollapsed(!isCollapsed ? 'show' : null )} className="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId" aria-controls="collapsibleNavId"
               aria-expanded="false" aria-label="Toggle navigation">
               <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isCollapsed}`} id="collapsibleNavId">
               <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                  {logicalNav()}
               </ul>
            </div>
         </div>
         </nav>
      </div>
   );
};

export default Header;