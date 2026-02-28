"use client"
import { NextPage } from "next";

interface Props {}

const Submit: NextPage<Props> = ({}) => {
  return (
    <>
      <button
        onClick={() => {
          return alert("Feature under development");
        }}
        className="text-dark font-medium bg-highlight/80 hover:bg-highlight transition-all px-3 py-1 rounded border border-highlight"
      >
        Submit
      </button>
    </>
  );
};

export default Submit;
