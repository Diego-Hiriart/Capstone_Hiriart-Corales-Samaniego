import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import axios from "../../services/axios";
import { AcademyConfig as Config } from "../../types";

const schema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  logoURL: z.string().optional(),
});

type AcademyConfigForm = z.infer<typeof schema>;

const AcademyConfig: FC = () => {
  const [config, setConfig] = useState<Config>(null!);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await axios.get("/dashboard/config/");
      setConfig(data.data[0]);
    };

    fetchConfig();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<AcademyConfigForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (config) {
      reset({
        name: config.name,
        phoneNumber: config.phoneNumber,
        logoURL: config.logoURL,
        address: config.address,
      });
    }
  }, [config]);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<AcademyConfigForm> = async (formData) => {
    try {
      await axios.put("/dashboard/config/" + config?.academyConfigID, {
        data: {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          logo: formData.logoURL,
        },
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error crear un combate",
        });
      }
    }
  };

  function handleChange() {
    setDisabled(false);
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Typography variant="h1">Configuración</Typography>
        <Box>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ my: 4, display: "flex", flexDirection: "column" }}
            onChange={handleChange}
          >
            <Avatar></Avatar>
            <TextField
              fullWidth
              margin="normal"
              id="name"
              label="Nombre"
              autoFocus
              InputLabelProps={{
                shrink: true,
              }}
              {...register("name")}
              helperText={errors.name?.message}
              defaultValue={config?.name}
            />
            <TextField
              fullWidth
              margin="normal"
              id="phoneNumber"
              label="Número de teléfono"
              autoFocus
              InputLabelProps={{
                shrink: true,
              }}
              {...register("phoneNumber")}
              helperText={errors.phoneNumber?.message}
              defaultValue={config?.phoneNumber}
            />
            <TextField
              fullWidth
              margin="normal"
              id="address"
              label="Dirección"
              autoFocus
              InputLabelProps={{
                shrink: true,
              }}
              {...register("address")}
              helperText={errors.address?.message}
              defaultValue={config?.address}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disabled}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AcademyConfig;
