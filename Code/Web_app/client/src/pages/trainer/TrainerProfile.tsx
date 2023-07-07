import { useLocation, useParams } from "react-router-dom";
import axios from "../../services/axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAlert } from "../../hooks/useAlert";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { User } from "../../types";
import AuthContext from "../../contexts/AuthContext";
import ChangePasswordDialog from "../../components/Dialog/ChangePasswordDialog";
import ControlledCheckbox from "../../components/Form/ControlledCheckbox";
import useAuth from "../../hooks/useAuth";

const schema = z.object({
  names: z.string().nonempty({ message: "Campo requerido" }),
  lastNames: z.string().nonempty({ message: "Campo requerido" }),
  email: z.string().email({ message: "Email inválido" }),
  experience: z.string().optional(),
  weapon: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

type UpdateTrainerForm = z.infer<typeof schema>;

type TrainerAPIResponse = {
  experience: string;
  weapon: string;
  pictureURL: string | null;
  user: Partial<User>;
};

const TrainerProfile = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useAlert();
  // const [image, setImage] = useState<File | null>(null);
  // const [previewImageURL, setPreviewImageURL] = useState<string | null>(null);
  const [trainer, setTrainer] = useState<TrainerAPIResponse | null>(null);
  const { pathname } = useLocation();
  const { user } = useAuth() as { user: User };
  const trainerID = pathname === "/profile" ? user?.trainer?.trainerID : id;
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  useEffect(() => {
    const fetchTrainer = async () => {
      const { data } = await axios.get(`/dashboard/trainer/${trainerID}`);
      setTrainer(data.data as TrainerAPIResponse);
      //replace when backend is ready:
      // setPreviewImageURL(data.data.pictureURL);
    };
    fetchTrainer();
  }, []);

  useEffect(() => {
    if (pathname === "/profile") {
      reset({
        names: user?.names,
        lastNames: user?.lastNames,
        email: user?.email,
        experience: user?.trainer?.experience,
        weapon: user?.trainer?.weapon,
        isAdmin: user?.roles?.includes("admin"),
      });
    } else {
      reset({
        names: trainer?.user.names,
        lastNames: trainer?.user.lastNames,
        email: trainer?.user.email,
        experience: trainer?.experience,
        weapon: trainer?.weapon,
        isAdmin: trainer?.user.roles?.includes("admin"),
      });
    }
  }, [trainer]);

  // useEffect(() => {
  //   if (!image) return;
  //   const reader = new FileReader();
  //   reader.readAsDataURL(image);
  //   reader.onloadend = () => {
  //     setPreviewImageURL(reader.result as string);
  //   };
  // }, [image]);

  // const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setImage(e.target.files?.[0] || null);
  // };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, dirtyFields },
    control,
    reset,
  } = useForm<UpdateTrainerForm>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    setIsChangePasswordDialogOpen(false);
  };

  const handleOpen = () => {
    setIsChangePasswordDialogOpen(true);
  };

  interface IObjectKeys {
    [key: string]: any;
  }

  const onSubmit: SubmitHandler<UpdateTrainerForm> = async (formData) => {
    try {
      // TODO: extract to helper function
      // take only the dirty/changed fields
      const updatedData = Object.keys(dirtyFields).reduce<IObjectKeys>(
        (acc, key) => {
          acc[key] = formData[key as keyof UpdateTrainerForm];
          return acc;
        },
        {}
      );

      // if image was changed, send it to the backend
      // image && (updatedData.pictureURL = image);

      // if no fields were changed, don't send the request
      if (Object.keys(updatedData).length === 0) return;

      const url = `/dashboard/trainer/${trainerID}`;
      let body = { data: updatedData };

      // if an admin is updating a trainer, send roles too
      if (user?.roles?.includes("admin") && updatedData.isAdmin !== undefined) {
        if (!trainer?.user.roles) return;
        const roles = [...trainer.user.roles];
        if (formData.isAdmin && !roles.includes("admin")) {
          roles.push("admin");
        } else if (!formData.isAdmin && roles.includes("admin")) {
          roles.splice(roles.indexOf("admin"), 1);
        }
        body = { data: { ...updatedData, roles } };
      }
      await axios.put(url, body);
      showSuccess("Entrenador actualizado exitosamente");
      reset({}, { keepValues: true });
      // setImage(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "manual",
            message: "El email ingresado ya está en uso",
          });
        } else {
          showError("Ha ocurrido un error al actualizar el entrenador");
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box mt={{ xs: 4, sm: 8 }}>
        <Typography variant="h1" alignSelf="start">
          Perfil
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          {/* <Stack alignItems="center" spacing={2} margin={2}>
            <Avatar src={previewImageURL || ""} sx={{ width: 100, height: 100 }} />
            <Button
              variant="outlined"
              component="label"
              endIcon={<PhotoCameraIcon />}
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
              Cambiar Foto
            </Button>
          </Stack> */}
          <TextField
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            margin="normal"
            id="names"
            label="Nombres"
            autoFocus
            {...register("names")}
            error={!!errors.names}
            helperText={errors.names?.message}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            margin="normal"
            id="lastNames"
            label="Apellidos"
            {...register("lastNames")}
            error={!!errors.lastNames}
            helperText={errors.lastNames?.message}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            margin="normal"
            type="email"
            id="email"
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Trayectoria"
            id="trayectoria"
            {...register("experience")}
          />
          <Controller
            name="weapon"
            control={control}
            defaultValue={trainer?.weapon || ""}
            render={({ field }) => (
              <FormControl>
                <FormLabel>Arma</FormLabel>
                <RadioGroup
                  {...field}
                  row
                  onChange={(e) => field.onChange(e.target.value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value="Espada"
                    control={<Radio />}
                    label="Espada"
                  />
                  <FormControlLabel
                    value="Sable"
                    control={<Radio />}
                    label="Sable"
                  />
                  <FormControlLabel
                    value="Florete"
                    control={<Radio />}
                    label="Florete"
                  />
                </RadioGroup>
              </FormControl>
            )}
          />
          {user?.roles?.includes("admin") && (
            <ControlledCheckbox
              label="Es Admin"
              name="isAdmin"
              control={control}
              defaultValue={!!trainer?.user.roles?.includes("admin")}
            />
          )}
          <Button
            sx={{ mt: 3 }}
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleOpen}
          >
            Cambiar Contraseña
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!!dirtyFields && Object.keys(dirtyFields).length === 0}
          >
            Guardar Cambios
          </Button>
        </Box>
        <ChangePasswordDialog
          open={isChangePasswordDialogOpen}
          handleClose={handleClose}
        />
      </Box>
    </Container>
  );
};

export default TrainerProfile;
