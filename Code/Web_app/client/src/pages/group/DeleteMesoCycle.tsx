import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "../../services/axios";
import { MesoCycle } from "../../types";

interface DeleteMesoCycleProps {
  handleClose: () => void;
  open: boolean;
  cycle: MesoCycle;
}

const DeleteMesoCycle = ({
  open,
  handleClose,
  cycle,
}: DeleteMesoCycleProps) => {
  const navigate = useNavigate();

  const { setError } = useForm();

  const onSubmit = async () => {
    try {
      await axios.delete("/dashboard/training_group/cycle/", {
        data: {
          trainingGroupID: cycle.trainingGroupID,
          mesoCycleID: cycle.mesoCycleID,
        },
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al eliminar el meso ciclo",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Eliminar meso-ciclo</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>¿Seguro que desea eliminar el meso-ciclo?</Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Eliminar meso-ciclo
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

export default DeleteMesoCycle;
