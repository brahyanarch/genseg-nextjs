'use client'
import {CircleAlert, CircleCheck, MessageSquareWarning, TriangleAlert} from 'lucide-react';
import {useState} from 'react';
import clsx from 'clsx';

interface avisoProps {
  type?: String;
  content?: String;
  fixed?:Boolean;
}

const Aviso = ({type, content,fixed}:avisoProps) =>{

  return(
  <div className={clsx("py-2",{
    "bg-red-100": type === "warning",
    "bg-yellow-100": type === "important",
    "bg-green-100": type === "succefull",
    "bg-blue-100": type != "warning" && type != "important" && type != "succefull" ,
  })}>
    <div className={clsx("w-1 h-full absolute top-0 left-0",{
    "bg-red-800": type === "warning",
    "bg-yellow-600": type === "important",
    "bg-green-800": type === "succefull",
    "bg-blue-800": type != "warning" && type != "important" && type != "succefull" ,
  })}></div>
    <section className="text-md pl-5 pr-10 ml-2">
      {
        type === "warning"?
        (<TriangleAlert color="#dd222c"  className="inline"/>): type==="important"? 
        (<MessageSquareWarning color="#f5b505" className="inline"/>):  type==="succefull"?
        (<CircleCheck color="#128a0a" className="inline"/>):
        (<CircleAlert color="blue" className="inline"/>)
      }
    <section className= {clsx("inline ml-2 text-md",{
    " text-red-700": type === "warning",
    "text-yellow-700": type === "important",
    "text-green-700": type === "succefull",
    "text-blue-700": type != "warning" && type != "important" && type != "succefull" ,
  })}>{type}</section>
    </section>
    <p className={clsx("py-2 px-5 ml-2 rounded-lg",{
    " text-red-500": type === "warning",
    "text-yellow-500": type === "important",
    "text-green-500": type === "succefull",
    "text-blue-500": type != "warning" && type != "important" && type != "succefull" ,
  })}>{content}</p>
  </div>
  );
}

export default Aviso;