import Spinner from "@/components/Spinner";
import axios from "axios";
import { Eye, EyeOff, Trash2, X } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  postId: number;
  isActive: boolean;
  postTitle: string;
  setHidePost: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPosts: (r: number) => void;
}

const ConfirmHide: NextPage<Props> = ({
  postId,
  postTitle,
  setHidePost,
  isActive,
  fetchPosts,
}: Props) => {
  const [hiding, setHiding] = useState(false);

  const handleHiding = async () => {
    try {
      setHiding(true);
      const res = await axios.post(`/api/v1/post/hide/${postId}`);
      if (res.data.status === "success") {
        setHidePost(false);
        fetchPosts(1);
        toast.success("Post deleted successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setHiding(false);
    }
  };

  console.log(isActive);

  return (
    <div className="bg-black/80 text-dark p-6 flex justify-center items-center fixed z-100 top-0 left-0 w-full h-screen">
      <ToastContainer />
      <div className="bg-white h-fit gap-10 flex flex-col w-full md:w-fit rounded-lg shadow-xl  py-10 md:px-20 px-4">
        <div className="flex flex-col">
          <h1 className="md:text-xl font-bold text-center">
            Are you sure you want to hide post titled: {postTitle}?
          </h1>
          <p className="text-center md:text-sm text-xs">
            Seller's wont be able to see this post unless you unhide it.
          </p>
        </div>
        <div className="flex justify-center">
          {hiding ? (
            <div className="bg-transparent flex ring-1 ring-dark justify-center items-center gap-2 text-white hover:bg-transparent font-bold py-2 px-8 rounded-lg">
              <Spinner light={false} />
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleHiding}
                className="bg-dark transition-all duration-300 cursor-pointer flex ring-1 ring-dark justify-center items-center gap-2 hover:text-dark text-white hover:bg-transparent font-bold py-2 px-4 rounded-lg"
              >
                <div className="flex justify-center items-center gap-1">
                  <EyeOff size={20} /> Hide/Unhide Post
                </div>
              </button>
              <button
                onClick={() => setHidePost(false)}
                className="bg-dark cursor-pointer transition-all duration-300 hover:bg-transparent text-white hover:text-dark ring-1 ring-dark flex justify-center items-center gap-2 font-bold py-2 px-4 rounded-lg ml-2"
              >
                <X size={20} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmHide;
