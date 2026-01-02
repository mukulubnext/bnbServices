import { ArrowBigLeft, ArrowBigRight, ArrowRight } from "lucide-react";
import { NextPage } from "next";

interface Props {
  active: number;
  invert?: Boolean;
}

const RegisterStep: NextPage<Props> = ({ active, invert }: Props) => {
  return (
    <div className="flex justify-center absolute bottom-1/12 items-center">
      <StepNumber num={1} active={active} invert={invert} />
      <ArrowRight className={`${invert ? "text-dark": "text-highlight"}`} />
      <StepNumber num={2} active={active} invert={invert} />
      <ArrowRight className={`${invert ? "text-dark": "text-highlight"}`} />
      <StepNumber num={3} active={active} invert={invert} />
    </div>
  );
};

export default RegisterStep;

interface StepNumberProps {
  num: number;
  active: number;
  invert?: Boolean;
}

const StepNumber = ({ num, active, invert }: StepNumberProps) => {
  const isActive = num === active;
  return (
    <>
      {invert ? (
        <div
          className={`${
            isActive
              ? "bg-dark transition-all duration-300 text-highlight"
              : "border border-dark text-dark"
          } w-10 h-10 font-bold text-center flex justify-center items-center rounded-full`}
        >
          {num}
        </div>
      ) : (
        <div
          className={`${
            isActive
              ? "bg-highlight transition-all duration-300 text-dark"
              : "border border-highlight text-highlight"
          } w-10 h-10 font-bold text-center flex justify-center items-center rounded-full`}
        >
          {num}
        </div>
      )}
    </>
  );
};
