'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
//import {API_FORMS} from '@/config/apiconfig"'

function ModalForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(false);
  const router = useRouter()
  // función para controlar el modal (oculto, visible)

  const handleModal = ()=>{
    setVisible(true);
  }

  return (
    <>
    <div>
      <button onClick={handleModal} >Editar Formulario</button>
    </div>
    { visible &&
     (   
    <div  className=" fixed top-10 right-[20%] z-50 bg-gray-400 border-2 p-6 border-gray-950" >
       <form
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch('/api/notes',{
            method: 'POST',
            body: JSON.stringify({title, content}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json();
        console.log(data);
        router.refresh();
      }}
    >
      <input
        type="text"
        name="title"
        autoFocus
        placeholder="Title"
        className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 my-2"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        name="title"
        autoFocus
        placeholder="Content"
        className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 my-2"
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button className="px-5 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Create
      </button>
    </form>
    </div>
    )}
    </>
    
  );
}

export default ModalForm;
