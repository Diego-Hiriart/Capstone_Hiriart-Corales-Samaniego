import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import axios from "../../services/axios";

interface FencerDeactivateProps {
  userID: number;
  userName: string;
  handleClose: () => void;
  open: boolean;
}

const FencerDeactivate = ({
  open,
  handleClose,
  userID,
  userName,
}: FencerDeactivateProps) => {
  const navigate = useNavigate();

  const { setError, handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      await axios.delete("/dashboard/user/" + userID);
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al desactivar usuario",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Desactivar usuario</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>
              ¿Seguro que desea desactivar la cuenta de &quot;{userName}&quot;?
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Desactivar
              </Button>
              <Button fullWidth variant="outlined" onClick={handleClose}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default FencerDeactivate;
