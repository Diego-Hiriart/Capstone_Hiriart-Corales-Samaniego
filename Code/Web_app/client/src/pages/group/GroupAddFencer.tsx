import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { Fencer } from "../../types";

const schema = z.object({
  fencer: z.string().nonempty({ message: "Campo requerido" }),
});

type GroupAddFencerForm = z.infer<typeof schema>;

interface GroupAddFencerProps {
  groupID: number;
  handleClose: () => void;
  open: boolean;
}

const GroupAddFencer = ({ open, handleClose }: GroupAddFencerProps) => {
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [fencers, setFencers] = useState<Fencer[]>(null!);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm<GroupAddFencerForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<GroupAddFencerForm> = async (formData) => {
    try {
      const { data } = await axios.get("/dashboard/fencer/search/" + formData);
      setFencers(data.data);
      await axios.put("/dashboard/fencer/", { data: formData });
      // TODO: redirect to groups list
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al crear el grupo",
        });
      }
    }
  };

  // TODO: add root error component
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
              <TextField
                required
                fullWidth
                margin="normal"
                id="fencer"
                label="Nombre del integrante"
                autoFocus
                {...register("fencer")}
                error={!!errors.fencer}
                helperText={errors.fencer?.message}
                onChange={() => {
                  setDisableButton(false);
                }}
              />
              <Button
                type="submit"
                fullWidth
                disabled={disableButton}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  // navigate(0);
                }}
              >
                Crear Grupo
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
