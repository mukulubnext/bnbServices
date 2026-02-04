import { NextPage } from "next";

interface Props {
    setConfirmMakeOffer: React.Dispatch<React.SetStateAction<boolean>>;
    handleMakeOffer: () => void;
}

const ConfirmMakeOffer: NextPage<Props> = ({setConfirmMakeOffer, handleMakeOffer}) => {
  return (
    <div className="bg-black/40 top-0 left-0 w-screen flex justify-center items-center fixed h-screen z-200 ">
      <div onClick={(e)=> e.stopPropagation()} className="bg-white border-2 border-dark w-fit px-10 rounded-md flex flex-col justify-around h-fit gap-6 py-5">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-dark font-bold text-xl text-center">
            Confirm Offer
          </h1>
          <p className="text-dark/50 text-center">
            Are you sure you want to make an offer?
          </p>
        </div>
        <div className="flex justify-center items-center gap-2 w-full">
          <button onClick={()=>setConfirmMakeOffer(false)} className="bg-dark text-white font-bold py-2 px-4 rounded border border-dark hover:bg-white hover:text-dark transition-all duration-300 cursor-pointer">
            No
          </button>
          <button onClick={handleMakeOffer} className="bg-dark text-white font-bold py-2 px-4 rounded border border-dark hover:bg-white hover:text-dark transition-all duration-300 cursor-pointer">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMakeOffer;
