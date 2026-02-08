import { NextPage } from "next";

interface Props {
  setConfirmMakeOffer: React.Dispatch<React.SetStateAction<boolean>>;
  handleMakeOffer: () => void;
}

const ConfirmMakeOffer: NextPage<Props> = ({
  setConfirmMakeOffer,
  handleMakeOffer,
}) => {
  return (
    <div className="bg-black/50 top-0 left-0 w-screen h-screen fixed z-200 flex justify-center items-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-dark/20 w-full max-w-sm px-8 py-6 rounded-xl flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95"
      >
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-dark font-semibold text-xl text-center">
            Confirm Offer
          </h1>
          <p className="text-dark/60 text-center text-sm leading-relaxed">
            Are you sure you want to make an offer?
          </p>
        </div>
        <div className="flex justify-center items-center gap-3 w-full pt-2">
          <button
            onClick={() => setConfirmMakeOffer(false)}
            className="w-full py-2.5 rounded-lg font-semibold border border-dark/30 text-dark bg-white hover:bg-dark/5 transition-all duration-200 cursor-pointer"
          >
            No
          </button>
          <button
            onClick={handleMakeOffer}
            className="w-full py-2.5 rounded-lg font-semibold border border-dark bg-dark text-white hover:bg-white hover:text-dark transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMakeOffer;
