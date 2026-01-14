import Spinner from "@/components/Spinner";
import axios from "axios";
import { Trash2, X } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  postId: number;
  postTitle: string;
  setDeletePost: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPosts: (r: number) => void;
}

const ConfirmDelete: NextPage<Props> = ({
  postId,
  postTitle,
  setDeletePost,
  fetchPosts
}: Props) => {
  const [optionSelected, setOptionSelected] = useState("");
  const [reason, setReason] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (optionSelected === "") {
      toast.error("Please select a reason");
      return;
    }
    try {
      setDeleting(true);
      const body =
        optionSelected === "Other"
          ? { reason: `Other: ${reason}` }
          : { reason: optionSelected };
      const res = await axios.delete(`/api/v1/post/delete/${postId}`, {
        data: body,
      });
      if (res.data.status === "success") {
        setDeletePost(false);
        fetchPosts(1);
        toast.success("Post deleted successfully");
      }
      else{
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-black/10 text-dark p-6 backdrop-blur-2xl flex justify-center items-center fixed z-100 top-0 left-0 w-full h-screen">
      <ToastContainer />
      <div className="bg-white h-fit gap-10 flex flex-col w-full md:w-fit rounded-lg shadow-xl  py-10 md:px-20 px-4">
        <div className="flex flex-col">
          <h1 className="md:text-xl font-bold text-center">
            Are you sure you want to delete titled: {postTitle}?
          </h1>
          <p className="text-center md:text-[16px] text-sm">
            This step is irreversible and cannot be undone.
          </p>
        </div>
        <div>
          <h1 className="font-medium">Please tell the reason of deletion:</h1>
          <select
            onChange={(e) => setOptionSelected(e.target.value)}
            name="reason"
            id=""
            defaultValue={""}
            className="border p-2 border-dark rounded w-full focus:outline-none"
          >
            <option value={""} disabled>
              Select a reason
            </option>
            <option value="Request fulfilled by BnB's seller">
              Request fulfilled by BnB's seller
            </option>
            <option value="Request fulfilled by other seller">
              Request fulfilled by other seller
            </option>
            <option value="No longer needed">No longer needed</option>
            <option value="Other">Other</option>
          </select>
          {optionSelected === "Other" && (
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              type="text"
              placeholder="Please write your reason here"
              className="border mt-2 p-2 border-dark rounded w-full focus:outline-none"
            />
          )}
        </div>
        <div className="flex justify-center">
          {deleting ? (
            <div className="bg-transparent flex ring-1 ring-dark justify-center items-center gap-2 text-white hover:bg-transparent font-bold py-2 px-8 rounded-lg">
              <Spinner light={false} />
            </div>
          ) : (
            <>
              {optionSelected === "" ||
              (optionSelected === "Other" && reason === "") ? (
                <button className="bg-red-500 brightness-50 flex ring-1 ring-red-500 justify-center items-center gap-2 text-white font-bold py-2 px-4 rounded-lg">
                  <Trash2 size={20} /> Delete
                </button>
              ) : (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 cursor-pointer flex ring-1 ring-red-500 justify-center items-center gap-2 hover:text-red-500 text-white hover:bg-transparent font-bold py-2 px-4 rounded-lg"
                >
                  <Trash2 size={20} /> Delete
                </button>
              )}
              <button
                onClick={() => setDeletePost(false)}
                className="bg-dark cursor-pointer hover:bg-transparent text-white hover:text-dark ring-1 ring-dark flex justify-center items-center gap-2 font-bold py-2 px-4 rounded-lg ml-2"
              >
                <X size={20} /> Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
