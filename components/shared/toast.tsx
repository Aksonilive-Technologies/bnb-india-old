interface ToastProps {
    setstate: boolean,
    msg: string
  }

export default function Toast({setstate= false , msg} : ToastProps){
    return(
        <div className="fixed bottom-0 right-0 p-4 py-6 text-sm rounded-xl m-4 drop-shadow-2xl bg-white z-[100]">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</div>
    )
    
}