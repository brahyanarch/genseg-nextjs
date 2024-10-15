
interface avisoProps {
  type?: String;
  content?: String;
}

const aviso = ({type, content}: avisoProps) =>{
  function getMessage() {
      switch (type) {
          case "warning":
              return (
                  <p className="text-red-500 bg-red-300 py-2 px-10 rounded-lg">{content}</p>
              );
              break;
          case "important":
              return (
                  <p className="text-yellow-500 bg-yellow-300 py-2 px-10 rounded-lg">{content}</p>
              );
              break;
          case "succefull":
              return (
                  <p className="text-green-500 bg-green-300 py-2 px-10 rounded-lg">{content}</p>
              );
              break;
      
          default:
              return (
                  <p className="text-blue-500 bg-blue-300 py-2 px-10 rounded-lg">{content}</p>
              );
              break;
      }
  }

return(
  <>
      <div>
          {getMessage()}
      </div>
  </>
);
}
export default aviso;