import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { TrainingGroupWithFencers } from "../../types";

const schema = z.object({
  fencer: z.string().nonempty({ message: "Campo requerido" }),
});

type GroupAddFencerForm = z.infer<typeof schema>;

interface GroupAddFencerProps {
  group: TrainingGroupWithFencers;
  handleClose: () => void;
  open: boolean;
}

const GroupAddFencer = ({ open, handleClose, group }: GroupAddFencerProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GroupAddFencerForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<GroupAddFencerForm> = async (formData) => {
    try {
      const fencer = group.fencer.find(
        (fencer) =>
          fencer.user.names + " " + fencer.user.lastNames === formData.fencer
      );

      await axios.put("/dashboard/fencer/", {
        id: fencer?.fencerID,
        groupID: group.trainingGroupID,
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al añadir integrante",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir Integrante</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <Autocomplete
                disablePortal
                id="fencer"
                options={group?.fencer?.map(
                  (fencer) => fencer.user.names + " " + fencer.user.lastNames
                )}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    margin="normal"
                    label="Nombre del integrante"
                    autoFocus
                    {...register("fencer")}
                    error={!!errors.fencer}
                    helperText={errors.fencer?.message}
                    {...params}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Añadir
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

export default GroupAddFencer;