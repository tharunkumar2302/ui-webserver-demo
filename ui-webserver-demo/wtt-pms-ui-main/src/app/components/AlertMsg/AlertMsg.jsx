import { Snackbar, Alert } from "@mui/material";
import { value100Per } from "app/utils/constant";
import React from "react";
export default function AlertMsg({
  open,
  severity,
  handle,
  Msg
}) {
  const alertStyle = {
    top: "70px",
    bottom: "auto",
    left: "auto",
    right: "1.3rem"
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handle}
        style={alertStyle}
        id="alert"
      >
        <Alert
          onClose={handle}
          severity={severity}
          sx={{
            width: value100Per,
          }}
          variant="filled"
        >
          {JSON.parse(JSON.stringify(Msg))}
        </Alert>
      </Snackbar>
    </>
  );
}
