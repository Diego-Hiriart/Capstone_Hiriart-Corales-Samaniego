import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import axios from "../../services/axios";

interface DeleteCombatProps {
  handleClose: () => void;
  open: boolean;
  id: number | undefined;
}

const DeleteCombat = ({ open, handleClose, id }: DeleteCombatProps) => {
  const navigate = useNavigate();

  const { setError, handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      await axios.delete("/dashboard/training_combat/" + id);
      navigate(-1);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al eliminar combate",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Eliminar combate</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>¿Seguro que desea eliminar el combate?</Typography>
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
                Eliminar combate
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

export default DeleteCombat;
