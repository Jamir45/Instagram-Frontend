import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import defaultProfile from '../computer-icons-user-profile-png-favpng-0UAKKCpRRsMj5NaiELzw1pV7L.jpg'
import './Profile.css'

const Profile = () => {
   const history = useHistory()
   const [state, dispatch] = useContext(UserContext)

   // Logout Logic
   const logout = () => {
      localStorage.clear('jwt')
      // dispatch({type:'CLEAR'})
      history.push('/sign-in')
   }

   // Get User Post
   const [myPost, setMyPost] = useState([])
   const [preloader, setPreloader] = useState(false)
   useEffect( () => {
      fetch('http://localhost:3005/my-post', {
         method:"GET",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         }
      })
      .then(res => res.json())
      .then(result => {
         setMyPost(result)
         setPreloader(true)
      })
   }, [])

   // Upload Profile Photo 
   const [photo, setPhoto] = useState()
   const [photoUrl, setPhotoUrl] = useState()
   const [profilePhoto, setProfilePhoto] = useState()

   useEffect( () => {
      if (photo) {
         const profile = new FormData()
         profile.append('file', photo)
         profile.append('upload_preset', 'instagram-file')
         profile.append('cloud_name', 'dj7k9b8ps')
         fetch('https://api.cloudinary.com/v1_1/dj7k9b8ps/image/upload', {
            method:"POST",
            body:profile
         })
         .then(res => res.json())
         .then(result => {
            console.log(result)
            setPhotoUrl(result.url)
         })
      }
   }, [photo])

   useEffect( () => {
      if (photoUrl) {
         fetch('http://localhost:3005/upload-profile-photo', {
            method:"PUT",
            headers:{
               'Content-Type':'application/json',
               'Authorization':localStorage.getItem('jwt')
            },
            body:JSON.stringify({
               profilePhoto:photoUrl
            })
         })
         .then(res => res.json())
         .then(result => {
            console.log(result)
            dispatch({type:"PROFILE", payload:result.profile})
            localStorage.setItem("user", JSON.stringify({...state, profile:result.profile}))
            setProfilePhoto(result.profile)
         })
      }
   }, [photoUrl])

   // Get Profile
   const [newProfile, setNewProfile] = useState()
   console.log(newProfile)
   useEffect(() => {
      fetch("http://localhost:3005/profile", {
         method:"GET",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         }
      })
      .then(res => res.json())
      .then(result => {
         setNewProfile(result)
      })
   }, [])


   return (
      <div className="container">
         <div className="row fullProfile">
            <div className="col-sm-0 col-md-1 col-lg-2"></div>
            <div className="col-sm-12 col-md-10 col-lg-8">
               <div className='row'>
                  <div className="profile col-4 col-sm-4 col-md-4 col-lg-5">
                     {
                        profilePhoto ? <div>
                        <form>
                           <label for="fileToUpload">
                              <div className="profile-pic" style={{backgroundImage: `url(${newProfile ? newProfile.profile : defaultProfile})`}}>
                                 <span className="update">Upload Image</span>
                              </div>
                           </label>
                           <input onChange={(event) => {setPhoto(event.target.files[0])}} type="File" name="fileToUpload" id="fileToUpload"/>
                        </form>
                        </div> : <div>
                        <form>
                           <label for="fileToUpload">
                              <div className="profile-pic" style={{backgroundImage: `url(${newProfile ? newProfile.profile : defaultProfile})`}}>
                                 <span className="update">Change Image</span>
                              </div>
                           </label>
                           <input onChange={(event) => {setPhoto(event.target.files[0])}} type="File" name="fileToUpload" id="fileToUpload"/>
                        </form>
                        </div>
                     }
                  </div>
                  <div className="col-sm-8 col-8 col-md-8 col-lg-7 box">
                     <div className="d-flex justify-content-between">
                        <h3> {state && state.name} </h3>
                        <div className="d-sm-none d-none d-md-block">
                           <button className="btn btn-danger" onClick={()=>logout()}>Logout</button>
                        </div>
                     </div>
                     <div className="d-flex">
                        <p className="px-2"><b>{myPost.length} Post</b></p>
                        <p className="px-2"><b> {newProfile && newProfile.followers.length} Follower</b></p>
                        <p className="px-2"><b> {newProfile && newProfile.following.length} Following</b></p>
                     </div>
                     <div className="d-sm-block d-md-none">
                           <button className="btn btn-danger" onClick={()=>logout()}>Logout</button>
                        </div>
                  </div>
               </div>
            </div>
            <div className="col-sm-0 col-md-1 col-lg-2"></div>
         </div>
         <div className="row">
            {
               !preloader && <h3 className="text-center m-auto">Loading, Please Wait</h3>
            }
            {
               myPost.map(post => {
                  return(
                     <div className="col-md-4" key={post._id}>
                        <img className="img-fluid" src={post.image} alt=""/>
                        <h4>{post.title}</h4>
                     </div>
                  )             
               })
            }
         </div>
      </div>
   );
};

export default Profile;