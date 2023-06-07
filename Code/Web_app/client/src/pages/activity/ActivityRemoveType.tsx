import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "../../services/axios";
import { ActivityType } from "../../types";

interface ActivityRemoveTypeProps {
  activityType: ActivityType;
  handleClose: () => void;
  open: boolean;
}

const ActivityRemoveType = ({
  open,
  handleClose,
  activityType,
}: ActivityRemoveTypeProps) => {
  const navigate = useNavigate();

  const { setError } = useForm();

  const onSubmit = async () => {
    try {
      await axios.delete(
        "/dashboard/activity_type/" + activityType.activityTypeID
      );
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al remover tipo de actividad",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Eliminar tipo de actividad</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>
              ¿Seguro que desea eliminar la actividad: {activityType?.name}?
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Eliminar
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

export default ActivityRemoveType;
