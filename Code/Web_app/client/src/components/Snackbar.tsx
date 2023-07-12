import { Snackbar as MuiSnackbar } from "@mui/material";
import { Alert } from "@mui/material";

import { useAlert } from "../hooks/useAlert";

const Snackbar = () => {
  const { alert, setAlert } = useAlert();

  // TODO: Fix fadeout animation
  const handleClose = () => {
    setAlert(null);
  };

  return alert ? (
    <MuiSnackbar
      open={!!alert}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={alert?.severity}
      >
        {alert?.message}
      </Alert>
    </MuiSnackbar>
  ) : null;
};

export default Snackbar;
