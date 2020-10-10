import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css'
import './Signin.css'
import { UserContext } from '../../App';

const Signin = () => {
   const history = useHistory()
   const [state, dispatch] = useContext(UserContext)

   const { register, handleSubmit, errors } = useForm();
   const onSubmit = data => {
      console.log(data)

      fetch('http://localhost:3005/login', {
         method:'POST',
         headers:{
            'Content-Type': 'application/json'
         },
         body:JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
         console.log(data)
         if (data.error) {
            M.toast({html: data.error, classes:"error"})
         }
         else{
            localStorage.setItem('jwt', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch({type:"USER", payload:data.user})
            M.toast({html: data.success, classes:"success"})
            history.push('/')
         }
      })
   };

   // Password Show and Hide Logic
   const [isPasswordShow, setIsPasswordShow] = useState(true)
   const showToggle = () => {
      setIsPasswordShow(false)
   }
   const hideToggle = () => {
      setIsPasswordShow(true)
   }
   

   return (
      <div className="container">
         <div className="row">
            <div className="col-md-3 col-sm-2 col-lg-4"></div>
            <div className="card shadow-sm col-md-6 col-sm-8 col-lg-4 signInForm">
               <h2 className="text-center">Instagram Sign In</h2>
               <form onSubmit={handleSubmit(onSubmit)}>
                  
                  <div className="my-4">
                     <input className="form-control" name="email" placeholder="Email" ref={register({ required: true })} />
                     {errors.email && <span style={{color:'red'}}>Email is required</span>}
                  </div>
                  <div className="my-4 show">
                     <input type={!isPasswordShow?"text":"password"} className="form-control" name="password" placeholder="Password" ref={register({ required: true })} />
                     <div>
                        {
                           isPasswordShow ? <i onClick={ () => showToggle()} className="fas fa-eye-slash showIcon"></i> : <i onClick={ () => hideToggle()} class="fas fa-eye showIcon"></i>
                        }
                     </div>
                     {errors.password && <span style={{color:'red'}}>Email is required</span>}
                  </div>

                  <div className="text-center mb-3">
                     <Link to="/signup" className="Link"> <h6>No Have an Account ?</h6> </Link>
                  </div>
                  
                  <div className="text-center">
                     <input className="btn btn-success" type="submit" />
                  </div>
               </form>
            </div>
            <div className="col-md-3 col-sm-2 col-lg-4"></div>
         </div>
      </div>
   );
};

export default Signin;