import { Progress } from "@chakra-ui/react";
import React, { FC } from "react";
import "./Loader.scss";

interface ILoader {
  label?: string;
  valueProgressBar?: number;
  isIndeterminateProgressBar?: boolean
}

const Loader: FC<ILoader> = ({ label, valueProgressBar, isIndeterminateProgressBar= false }) => {
  return (
    <div className="container__loader">
      <div className="icon">
        <div className="flex flex-column">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ gap: ".15rem" }}
          >
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <div className="bar bar4"></div>
            <div className="bar bar5"></div>
            <div className="bar bar6"></div>
            <div className="bar bar7"></div>
            <div className="bar bar8"></div>
          </div>
          {valueProgressBar !== undefined && (
            <Progress
              w={200}
              mt={3}
              size={"xs"}
              hasStripe
              // style={{transition: "width 2s xlinear"}}
              colorScheme={"orange"}
              isAnimated
              isIndeterminate={isIndeterminateProgressBar}
              value={valueProgressBar}
            />
          )}
          {label && <span className="description">{label}</span>}
        </div>
      </div>
    </div>
  );
};

export default Loader;
