import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AxiosError } from "axios";
import enGB from "date-fns/locale/en-GB";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";

const schema = z.object({
  name: z.string().nonempty({ message: "Campo requerido" }),
  description: z.string(),
});

type AcademyAddActivityForm = z.infer<typeof schema>;

interface AcademyAddActivityProps {
  handleClose: () => void;
  open: boolean;
}

const defaultDuration = new Date(
  new Date(new Date().setMinutes(10)).setSeconds(0)
);

const AcademyAddActivity = ({ open, handleClose }: AcademyAddActivityProps) => {
  const [duration, setDuration] = useState<Date>(defaultDuration);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AcademyAddActivityForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<AcademyAddActivityForm> = async (formData) => {
    try {
      await axios.post("/dashboard/activity/", {
        data: {
          name: formData.name,
          description: formData.description,
          duration: duration,
        },
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al añadir la actividad",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir actividad</DialogTitle>
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
                label="Nombre de la actividad"
                autoFocus
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="description"
                label="Descripción de la actividad"
                autoFocus
                multiline
                minRows={5}
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
              <FormControl>
                <FormLabel required>Duración</FormLabel>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={enGB}
                >
                  <TimePicker
                    views={["minutes", "seconds"]}
                    format="mm:ss"
                    defaultValue={defaultDuration}
                    onChange={(newValue: Date | null) => {
                      setDuration(newValue!);
                    }}
                  />
                </LocalizationProvider>
              </FormControl>

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

export default AcademyAddActivity;
