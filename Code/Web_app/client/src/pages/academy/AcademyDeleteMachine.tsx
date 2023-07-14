import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import axios from "../../services/axios";

interface AcademyDeleteMachineProps {
  handleClose: () => void;
  open: boolean;
  machineName: string | undefined;
}

const AcademyDeleteMachine = ({
  open,
  handleClose,
  machineName,
}: AcademyDeleteMachineProps) => {
  const navigate = useNavigate();

  const { setError, handleSubmit } = useForm();

  const onSubmit = async () => {
    try {
      await axios.delete("/dashboard/machine_combat_data/" + machineName);
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al eliminar la máquina",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Eliminar máquina</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>¿Seguro que desea eliminar la máquina?</Typography>
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
                Eliminar máquina
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

export default AcademyDeleteMachine;
