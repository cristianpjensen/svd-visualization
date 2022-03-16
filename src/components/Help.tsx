import { useCallback, useState } from "react";
import { GithubIcon } from "./icons/Github";
import { QuestionIcon } from "./icons/Question";

export const Help = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    console.log(1);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <a
        href="https://github.com/cristianpjensen/svd-visualisation"
        target="_blank"
        style={{ position: "absolute", top: 16, left: 16 }}
      >
        <GithubIcon />
      </a>
      <button
        style={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
        onClick={handleOpen}
      >
        <QuestionIcon />
      </button>
      {isOpen && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            onClick={handleClose}
          >
            <div
              style={{
                backgroundColor: "black",
                zIndex: 2,
                maxWidth: 500,
                width: "100%",
                maxHeight: 500,
                borderRadius: 16,
                borderColor: "grey",
                borderStyle: "solid",
                borderWidth: 2,
                padding: 32,
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              }}
            >
              <h2 style={{ textAlign: "center" }}>
                Singular Value Decomposition
              </h2>
              <div style={{ textAlign: "justify", fontSize: 20 }}>
                <p>
                  You can change the matrix input by clicking on the green
                  matrix values and changing them like any other input. The
                  components of the SVD will adjust dynamically to your input.
                  When you have put in your desired matrix, you can click on the
                  matrices one-by-one to apply them to the cube of vectors
                  (visualised as colourful spheres).
                </p>
                <p>
                  Click on the refresh arrow to reset the vectors to their
                  original positions.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
