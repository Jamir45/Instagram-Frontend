import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css'
import './Signup.css'

const Signup = () => {
   const history = useHistory()

   const { register, handleSubmit, errors } = useForm();
   const onSubmit = (data, event) => {
      

      fetch('http://localhost:3005/user-registration', {
         method:"POST",
         headers:{
            'Content-Type': 'application/json'
         },
         body:JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => {
         if (data.error) {
            M.toast({html: data.error, classes:"error"})
         }
         else{
            M.toast({html: data.success, classes:"success"})
            event.target.reset()
            history.push('/sign-in')
         }
      })
      // setTimeout( () => {
      //    setErrorTime(false)
      // }, 5000)

   };

   // Password Show and Hide Logic
   const [isPasswordShow, setIsPasswordShow] = useState(true)
   const showToggle = () => {
      setIsPasswordShow(false)
   }
   const hideToggle = () => {
      setIsPasswordShow(true)
   }

   const [confirmPasswordShow, setConfirmPasswordShow] = useState(true)
   const showConfirmPasswordToggle = () => {
      setConfirmPasswordShow(false)
   }
   const hideConfirmPasswordToggle = () => {
      setConfirmPasswordShow(true)
   }

   return (
      <div className="container">
         <div className="row fullDiv">
            <div className="col-md-3 col-sm-2 col-lg-4"></div>
            <div className="card shadow-sm col-md-6 col-sm-8 col-lg-4 signInForm">
               <form onSubmit={handleSubmit(onSubmit)}> 
                  <h2 className="text-center">Instagram Sign Up</h2>

                  <div className="my-4">
                     <input className="form-control" name="name" placeholder="Full Name" ref={register({ required: true })} />
                     {errors.Name && <span style={{color:'red'}}>Name is required</span>}
                  </div>
                  <div className="my-4">
                     <input className="form-control" name="email" placeholder="Email" ref={register({ required: true })} />
                     {errors.email && <span style={{color:'red'}}>Email is required</span>}
                  </div>
                  <div className="my-4">
                     <input className="form-control" name="dateOfBirth" placeholder="Date Of Birth" ref={register({ required: true })} />
                     {errors.dateOfBirth && <span style={{color:'red'}}>Date Of Birth is required</span>}
                  </div>
                  <div className="my-4 show">
                     <input type={!isPasswordShow ? "text" : "password"} className="form-control" name="password" placeholder="Password" ref={register({ required: true })} />
                     <div>
                        {
                           isPasswordShow ? <i onClick={ () => showToggle()} className="fas fa-eye-slash showIcon"></i> : <i onClick={ () => hideToggle()} class="fas fa-eye showIcon"></i>
                        }
                     </div>
                     {errors.password && <span style={{color:'red'}}>Password is required</span>}
                  </div>
                  <div className="my-4 show">
                     <input type={!confirmPasswordShow ? "text" : "password"} className="form-control" name="confirmPassword" placeholder="Confirm Password" ref={register({ required: true })} />
                     <div>
                        {
                           confirmPasswordShow ? <i onClick={ () => showConfirmPasswordToggle()} className="fas fa-eye-slash showIcon"></i> : <i onClick={ () => hideConfirmPasswordToggle()} class="fas fa-eye showIcon"></i>
                        }
                     </div>
                     {errors.confirmPassword && <span style={{color:'red'}}>Confirm Password is required</span>}
                  </div>

                  <div className="text-center mb-3">
                     <Link to="/sign-in" className="Link"> <h6>Already Have an Account ?</h6> </Link>
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

export default Signup;