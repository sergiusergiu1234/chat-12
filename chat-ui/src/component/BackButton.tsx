import { IoArrowBackCircleSharp } from "react-icons/io5";

interface BackButton {
    mobileOnly: boolean
    onCLick : () => void
}

const BackButton:React.FC<BackButton> = ({onCLick,mobileOnly}) =>{
    
    return (
        <button className={`${mobileOnly ? `hidden maxsm:block maxsm:visible` : `flex  `} self-start ml-[10%] mt-[2%] m-1  z-50 text-red-500 text-4xl bg-black rounded-3xl hover:text-red-600`}
             onClick={onCLick}> <IoArrowBackCircleSharp />
        </button>
    )
}


export default BackButton;