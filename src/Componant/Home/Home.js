import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import postImg from '../RE4wySj.jpg'
import './Home.css'

const Home = () => {
   const [state, dispatch] = useContext(UserContext)
   const [posts, setPosts] = useState([])

   // To get All post
   useEffect( () => {
      fetch('http://localhost:3005/all-post', {
         method:"GET",
         headers:{
            'Content-Type':'application/json',
            'Authorization': localStorage.getItem('jwt')
         }
      })
      .then(res => res.json())
      .then(result => {
         console.log(result)
         setPosts(result)
      })
   }, [])

   // Like on the post 
   const like = (id) => {
      fetch('http://localhost:3005/like', {
         method:"PUT",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         },
         body:JSON.stringify({postId:id})
      })
      .then(res => res.json())
      .then(result => {
         const updatePost = posts.map( post => {
            if (post._id === result._id) {
               return result
            }else{
               return post
            }
         })
         setPosts(updatePost)
      })
   }

   // Unlike on the post 
   const Unlike = (id) => {
      fetch('http://localhost:3005/unlike', {
         method:"PUT",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         },
         body:JSON.stringify({postId:id})
      })
      .then(res => res.json())
      .then(result => {
         const updatePost = posts.map( post => {
            if (post._id === result._id) {
               return result
            }else{
               return post
            }
         })
         setPosts(updatePost)
      })
   }

   // Make comments on the post 
   const comment = (text, id) => {
      console.log(text)
      fetch('http://localhost:3005/comment', {
         method:"PUT",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         },
         body:JSON.stringify({comment:text, postId:id})
      })
      .then(res => res.json())
      .then(result => {
         console.log(result)
         const updatePost = posts.map( post => {
            if (post._id === result._id) {
               return result
            }else{
               return post
            }
         })
         setPosts(updatePost)
      })
   }

   // Delete Post 
   const deletePost = (postId) => {
      fetch(`http://localhost:3005/delete-post/${postId}`, {
         method:"delete",
         headers:{
            'Content-Type':'application/json',
            'Authorization':localStorage.getItem('jwt')
         }
      })
      .then(res => res.json())
      .then(result => {
         console.log(result)
         const newPosts = posts.filter(post => {
            return post._id !== result._id
         })
         setPosts(newPosts)
      })
   }


   return (
      <div className="container">
         {
            posts.map(post => {
               return(
                  <div className='row mb-3' key={post._id}>
                     <div className="col-1 col-sm-2 col-md-2 col-lg-3"></div>
                     <div className="card col-10 col-sm-8 col-md-8 col-lg-6">
                        <div>
                           <div>
                              <Link to={post.postedBy._id === state._id ? '/profile' : `/user-profile/${post.postedBy._id}`}>
                                 <h3 className="mx-3 mt-3"> {post.postedBy.name} </h3>
                              </Link>
                              {
                                 post.postedBy._id === state._id && <span style={{float:"right", cursor:'pointer'}} onClick={() =>{deletePost(post._id)}}><i class="fas fa-trash"></i></span>
                              }
                           </div>
                           <img className="card-img-top" src={post.image} alt=""/>
                        </div>
                        <div className="row likeCount">
                           <p className="col-6 px-4"> Likes {post.likes.length} </p>
                           <p className="text-right col-6 px-4">0 Love React</p>
                        </div>
                        <div className="row likeSection">
                           {
                              post.likes.includes(state._id) ?<div className="col-6"  onClick={() => {Unlike(post._id)}}>
                              <div className="customBtn"><i className="fas fa-thumbs-down text-success"></i> <span className="word">Like</span ></div>
                           </div> :
                           <div className="col-6" onClick={() => {like(post._id)}}>
                              <div className="customBtn"><i className="fas fa-thumbs-up text-success"></i> <span className="word">Like</span ></div>
                           </div>
                           }
                           
                           <div className="col-6 customBtn">
                              <i className="fas fa-heart icon"></i> <span className="word">Love</span>
                           </div>
                        </div>
                        <div className="py-3">
                           <h5 className="card-title"> {post.title} </h5>
                           <p className="card-text">
                           {post.postBody}
                              {/* {
                                 descriptionCollapse ? details : 
                                 details.substr(0,210)
                              } */}
                              {/* {
                                 details.length >= 210 && 
                                 <div>
                                 {
                                    descriptionCollapse ? <span style={{cursor:'pointer'}} onClick={seeLess} className="card-link collapse-btn text-success readMore">See Less <i className="fas fa-arrow-circle-left"></i></span>
                                    :
                                    <span style={{cursor:'pointer'}} onClick={seeMore} className="card-link collapse-btn text-success readMore">See More <i className="fas fa-arrow-circle-right"></i></span>
                                 }
                                 </div>
                              } */}
                           </p>
                           {/* {
                              post.comments.length ? <p className="commentTitle"><b>All Comments</b></p> :
                              <p className="commentTitle"><b>No Have Comments</b></p>
                           } */}
                           {
                              post.comments.map(comment => {
                                 return(
                                    <div>
                                       <span><b>{comment.commentedBy.name}</b></span> <span>{comment.text}</span>
                                    </div>
                                 )
                              })
                           }
                           <form onSubmit={(event) =>{
                              event.preventDefault()
                              comment(event.target[0].value, post._id)
                              event.target.reset()
                           }}>
                              <input className="form-control" type="text" placeholder="Comment"/>
                           </form>
                        </div>
                     </div>                            
                  <div className="col-1 col-sm-2 col-md-2 col-lg-3"></div>
                  </div>
               )
            })
         }
      </div>
   );
};

export default Home;