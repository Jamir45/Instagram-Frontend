import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import M from 'materialize-css'
import { useHistory } from 'react-router-dom';


const CreatePost = () => {
   const history = useHistory()
   const [image, setImage] = useState()
   const [imageUrl, setImageUrl] = useState()
   const [formData, setFormData] = useState()
   console.log(formData)
   const [event, setEvent] = useState()
   console.log(imageUrl)

   // Post Full Object in Database
   useEffect( () => {
      if (imageUrl) {
         fetch('http://localhost:3005/create-post', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': localStorage.getItem('jwt')
         },
         // formData.image = imgUrl
         body: JSON.stringify({...formData, image:imageUrl})
         })
         .then(response => response.json())
         .then(result => {
            console.log(result)
            if (result.error) {
               M.toast({html: result.error, classes:"error"})
            }
            else{
               M.toast({html: result.success, classes:"success"})
               history.push('/')
               event.target.reset()
            }
         })
      }
   }, [imageUrl])

   // Upload image and Pass Full Object in setFormData state
   const { register, handleSubmit, errors } = useForm();
   const onSubmit = (data, event) => {
      console.log(data)

      // Upload Image in Cloudinary Cloud Storage
      if (image) {
         const imgData = new FormData()
         imgData.append('file', image)
         imgData.append('upload_preset', 'instagram-file')
         imgData.append('cloud_name', 'dj7k9b8ps')
         fetch('https://api.cloudinary.com/v1_1/dj7k9b8ps/image/upload', {
            method:"POST",
            body:imgData
         })
         .then(res => res.json())
         .then(result => {
            console.log(result)
            setImageUrl(result.url)
         })
         // Post Data in Database
         // data.image = imageUrl
         setFormData(data)
         setEvent(event)
      }
   };
   return (
      <div className="container">
         <div className="row">
            <div className="col-1 col-sm-2 col-md-3"></div>

            <div className="card text-center shadow-sm col-10 col-sm-8 col-md-6">
               <div className="mt-4">
                  <h1 className="title">Create Post</h1>
               </div>
               <div className="card-body">
               <form onSubmit={handleSubmit(onSubmit)}>

                  <input className="form-control my-4" placeholder="Title" name="title" ref={register()} />
                  {errors.title && <span>Title field is required</span>}

                  <textarea className="form-control my-4" placeholder="Description" name="postBody" ref={register()}></textarea>
                  {errors.postBody && <span>Body field is required</span>}

                  <div className="text-left">
                     <label for="file">Please Select Your Photo.</label>
                     <input onChange={(event) =>setImage(event.target.files[0])} className="form-control-file" name="image" type="file"  id="file"/>
                  </div>

                  <button className="btn btn-success my-4 px-5" type="submit">Post</button>
               </form>
               </div>

               <div className="col-1 col-sm-2 col-md-3"></div>
            </div>
         </div>
      </div>
   );
};

export default CreatePost;