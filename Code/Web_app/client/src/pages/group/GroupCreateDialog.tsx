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

const schema = z.object({
  name: z.string().nonempty({ message: "Campo requerido" }),
  weapon: z.string().nonempty({ message: "Campo requerido" }),
});

type CreateGroupForm = z.infer<typeof schema>;

interface CreateGroupDialogProps {
  handleClose: () => void;
  open: boolean;
}

const GroupCreateDialog = ({ open, handleClose }: CreateGroupDialogProps) => {
  const [disableButton, setDisableButton] = useState({
    groupName: false,
    weapon: false,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    control,
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreateGroupForm> = async (formData) => {
    try {
      await axios.post("/dashboard/training_group/", { data: formData });
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
  console.log(disableButton);

  // TODO: add root error component
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear Grupo de Entrenamiento</DialogTitle>
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
                id="name"
                label="Nombre del Grupo"
                autoFocus
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                onChange={() => {
                  setDisableButton({ ...disableButton, groupName: true });
                }}
              />
              <Controller
                name="weapon"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl>
                    <FormLabel>Arma</FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setDisableButton({ ...disableButton, weapon: true });
                      }}
                      value={field.value}
                    >
                      <FormControlLabel
                        value="espada"
                        control={<Radio />}
                        label="Espada"
                      />
                      <FormControlLabel
                        value="sable"
                        control={<Radio />}
                        label="Sable"
                      />
                      <FormControlLabel
                        value="florete"
                        control={<Radio />}
                        label="Florete"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
              <Button
                type="submit"
                fullWidth
                disabled={!(disableButton.groupName && disableButton.weapon)}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  navigate(0);
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

export default GroupCreateDialog;
