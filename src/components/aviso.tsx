import {CircleAlert, CircleCheck, MessageSquareWarning, TriangleAlert} from 'lucide-react'
interface avisoProps {
  type?: String;
  content?: String;
}

const aviso = ({type, content}: avisoProps) =>{
  function getMessage() {
      switch (type) {
          case "warning":
              return (
                <>
                 <div className="bg-red-100 py-2">
                  <div className="w-1 h-full bg-red-800 absolute top-0 left-0"></div>
                  <section className=" text-md pl-5 pr-10 ml-2"><TriangleAlert color="#dd222c"  className="inline"/>
                  <section className="inline text-red-700 ml-2 text-md">{type}</section>
                  </section>
                  <p className="text-red-500  py-2 px-5  ml-2 rounded-lg">{content}</p>
                  </div>
                </>
                
              );
              break;
          case "important":
              return (
                  <>
                  <div className="bg-yellow-100 py-2">
                   <div className="w-1 h-full bg-yellow-600 absolute top-0 left-0"></div>
                   <section className=" text-md pl-5 pr-10 ml-2"><MessageSquareWarning color="#f5b505" className="inline"/>
                   <section className="inline text-yellow-700 ml-2 text-md">{type}</section>
                   </section>
                   <p className="text-yellow-500 py-2 px-10 rounded-lg">{content}</p>
                   </div>
                 </>
              );
              break;
          case "succefull":
              return (
                  
                  <>
                  <div className="bg-green-100 py-2">
                   <div className="w-1 h-full bg-green-800 absolute top-0 left-0"></div>
                   <section className=" text-md pl-5 pr-10 ml-2"><CircleCheck color="#128a0a" className="inline"/>
                   <section className="inline text-green-700 ml-2 text-md">{type}</section>
                   </section>
                   <p className="text-green-500  py-2 px-10 rounded-lg">{content}</p>
                   </div>
                 </>
                  
              );
              break;
      
          default:
              return (
                  <>
                  <div className="bg-blue-100 py-2">
                   <div className="w-1 h-full bg-blue-800 absolute top-0 left-0"></div>
                   <section className=" text-md pl-5 pr-10 ml-2"><CircleAlert color="blue" className="inline"/>
                   <section className="inline text-blue-700 ml-2 text-md">{type}</section>
                   </section>
                   <p className="text-blue-500  py-2 px-10 rounded-lg">{content}</p>
                   </div>
                 </>
              );
              break;
      }
  }

return(
  <>
      <div className="relative w-[80%] mx-auto ">
          {getMessage()}
      </div>
  </>
);
}
export default aviso;