import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import defaultProfile from '../computer-icons-user-profile-png-favpng-0UAKKCpRRsMj5NaiELzw1pV7L.jpg'
import './Profile.css'


const UserProfile = () => {
   const [state, dispatch] = useContext(UserContext)
   console.log(state)

   // Get Specific user data from database
   const [userData, setUserData] = useState()
   console.log(userData)
   const {userId} = useParams()

   useEffect(() => {
      fetch(`http://localhost:3005/user-profile/${userId}`, {
      method:"GET",
      headers: {
         'Content-Type': 'application/json',
         'Authorization': localStorage.getItem('jwt')
      }
      })
      .then(response => response.json())
      .then(result => {
         setUserData(result)
      })
      .catch((error) => {
      console.error('Error:', error.message);
      });
   }, [userId])

   // Follow
   const following = () => {
      fetch('http://localhost:3005/follow', {
         method:"PUT",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         },
         body:JSON.stringify({
            followUserId:userId
         })
      })
      .then(res => res.json())
      .then(result => {
         console.log(result)
         dispatch({type:"UPDATE", payload:{followers:result.followers, following:result.following}})
         localStorage.setItem('user', JSON.stringify(result))
         setUserData(previousData => {
            return{
               ...previousData,
               user:{
                  ...previousData.user,
                  followers:[...previousData.user.followers, previousData._id]
               }
            }
         })
      })
   }

    // UnFollow
    const unFollowing = () => {
      fetch('http://localhost:3005/un-follow', {
         method:"PUT",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         },
         body:JSON.stringify({
            followUserId:userId
         })
      })
      .then(res => res.json())
      .then(result => {
         console.log(result)
         dispatch({type:"UPDATE", payload:{followers:result.followers, following:result.following}})
         localStorage.setItem('user', JSON.stringify(result))
         setUserData(unFollowData => {
            let unFollowers = unFollowData.user.followers.filter(item => item._id !== unFollowData._id)
            return{
               ...unFollowData,
               user:{
                  ...unFollowData.user,
                  followers:unFollowers
               }
            }
         })
      })
   }

   //  // Get Profile
   //  const [newUserProfile, setNewUserProfile] = useState()
   //  console.log(newUserProfile)
   //  useEffect(() => {
   //     fetch("http://localhost:3005/user-profile", {
   //        method:"GET",
   //        headers:{
   //           'Content-Type':'application/json',
   //           'Authorization':localStorage.getItem('jwt')
   //        }
   //     })
   //     .then(res => res.json())
   //     .then(result => {
   //       setNewUserProfile(result)
   //     })
   //  }, [])


   return (
      <>
      {
         userData ? <div className="container">
         <div className="row fullProfile">
            <div className="col-sm-0 col-md-1 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-8">
               <div className="row">
                  <div className="profile img-fluid rounded-circle col-4 col-sm-4  col-md-4 col-lg-5">
                     <div className="user-profile-pic" style={{backgroundImage: `url(${userData ? userData.user.profile : defaultProfile})`}}>
                        <span className="update">Change Image</span>
                     </div>
                  </div>
                  <div className="col-sm-8 col-8 col-md-8 col-lg-7 box">
                     <div className="justify-content-between">
                        <h2> {userData.user.name} </h2>
                        <p> {userData.user.email} </p>
                     </div>
                     <div className="d-flex">
                        <h6 className="mr-4"> Post</h6>
                        <h6 className="mr-4"> {state.followers === undefined ? userData.user.followers.length : state.followers.length} Follower</h6>
                        <h6 className="mr-4"> {state.following === undefined ? userData.user.following.length : state.following.length} Following</h6>
                     </div>
                     {/* <button className="btn btn-success" onClick={()=>{following()}}>Follow</button> */}
                     {  
                        state.following === undefined  ? <div>
                           {
                              userData.user.following.includes(userId) ?
                              <button className="btn btn-success" onClick={()=>{unFollowing()}}>Un Follow</button> : <button className="btn btn-success" onClick={()=>{following()}}>Follow</button>
                           }
                        </div> : <div>
                           {
                              state.following.includes(userId) ?
                              <button className="btn btn-success" onClick={()=>{unFollowing()}}>Un Follow</button> : <button className="btn btn-success" onClick={()=>{following()}}>Follow</button>
                           }
                        </div>
                     }
                  </div>
               </div>
            </div>
            <div className="col-sm-0 col-md-1 col-lg-2"></div>
         </div>
         <div>
         {
            userData.post.map(post => {
               return(
                  <div className="row">
                     <div className="col-1 col-sm-2 col-md-2 col-lg-3"></div>
                     <div className="card col-10 col-sm-8 col-md-8 col-lg-6" key={post._id}>
                        <img className="img-fluid" src={post.image} alt=""/>
                        <h4>{post.title}</h4>
                     </div>
                     <div className="col-1 col-sm-2 col-md-2 col-lg-3"></div>
                  </div>
               )             
            })
         }
         </div>
      </div> : <h1>Loading</h1>
      }
      </> 
   );
};

export default UserProfile;