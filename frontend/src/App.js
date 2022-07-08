import { useState } from 'react'
import axios from 'axios'

import './App.css'

async function postImage({image, description}) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
  return result.data
}


function App() {

  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({image: file, description})
    setImages([result.image, ...images])
  }

  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)
	}

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      { images.map( image => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}
    {/* this call to the express server route images */}
    <div>with server</div>
      <img src="images/8a7a8ae26fa60401e0ecc1fd69bf7fa9"></img>
      <div>directly</div>
      <img src='https://rao-s3-direct-upload.s3.us-west-2.amazonaws.com/8a7a8ae26fa60401e0ecc1fd69bf7fa9' />
    </div>
  );
}

export default App;
