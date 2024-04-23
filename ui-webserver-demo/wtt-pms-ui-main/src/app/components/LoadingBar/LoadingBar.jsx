import { Box, styled, CircularProgress } from "@mui/material";
import React from "react";

export default function LoadingBar(props) {
  const LoaderBox = styled(Box)(() => ({
    position: "fixed",
    width: "100%",
    left: "0",
    height: "100%",
    top: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0, 0, 0, 0.17)",
  }));

  return (
    <>
      {props.loading ? (
        <LoaderBox>
          <CircularProgress />
        </LoaderBox>
      ) : (
        ""
      )}
    </>
  );
}
