import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { Fencer, TrainingGroupFull } from "../../types";

const schema = z.object({
  fencer1Name: z.string(),
  fencer2Name: z.string(),
  fencer1Score: z.string(),
  fencer2Score: z.string(),
  winner: z.string(),
});

type TrainerAddCombatForm = z.infer<typeof schema>;

interface TrainerAddCombatProps {
  handleClose: () => void;
  open: boolean;
}

type leftRight = "left" | "right" | string;

const TrainerAddCombat = ({ open, handleClose }: TrainerAddCombatProps) => {
  const [date, setDate] = useState<Date>(null!);
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [selectedWinner, setSelectedWinner] = useState<leftRight>(null!);

  useEffect(() => {
    const fetchFencers = async () => {
      const { data } = await axios.get("/dashboard/fencer/");
      setFencers(data.data);
    };

    fetchFencers();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TrainerAddCombatForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TrainerAddCombatForm> = async (formData) => {
    try {
      const fencer1 = fencers.find(
        (fencer) =>
          fencer.user.names + " " + fencer.user.lastNames ===
          formData.fencer1Name
      );
      const fencer2 = fencers.find(
        (fencer) =>
          fencer.user.names + " " + fencer.user.lastNames ===
          formData.fencer2Name
      );

      await axios.post("/dashboard/training_combat/", {
        data: {
          fencer1ID: fencer1?.fencerID,
          fencer2ID: fencer2?.fencerID,
          fencer1Score: Number(formData.fencer1Score),
          fencer2Score: Number(formData.fencer2Score),
          dateTime: date,
          winnerFencerID:
            selectedWinner === "left" ? fencer1?.fencerID : fencer2?.fencerID,
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedWinner(event.target.value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Crear meso-ciclo</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1, display: "flex", flexDirection: "column" }}
            >
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    onChange={(newValue: Date | null) => {
                      setDate(newValue ?? new Date());
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormLabel>Esgrimista izquierda</FormLabel>
              <Autocomplete
                disablePortal
                id="fencer"
                options={fencers?.map(
                  (fencer) => fencer.user.names + " " + fencer.user.lastNames
                )}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    margin="normal"
                    label="Nombre"
                    autoFocus
                    {...register("fencer1Name")}
                    error={!!errors.fencer1Name}
                    helperText={errors.fencer1Name?.message}
                    {...params}
                  />
                )}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="fencer1Score"
                label="Puntaje"
                type="number"
                autoFocus
                {...register("fencer1Score")}
                error={!!errors.fencer1Score}
                helperText={errors.fencer1Score?.message}
              />

              <FormLabel>Esgrimista derecha</FormLabel>
              <Autocomplete
                disablePortal
                id="fencer"
                options={fencers?.map(
                  (fencer) => fencer.user.names + " " + fencer.user.lastNames
                )}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    margin="normal"
                    label="Nombre"
                    autoFocus
                    {...register("fencer2Name")}
                    error={!!errors.fencer2Name}
                    helperText={errors.fencer2Name?.message}
                    {...params}
                  />
                )}
              />
              <TextField
                required
                fullWidth
                margin="normal"
                id="fencer2Score"
                label="Puntaje"
                type="number"
                autoFocus
                {...register("fencer2Score")}
                error={!!errors.fencer2Score}
                helperText={errors.fencer2Score?.message}
              />

              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Ganador
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={selectedWinner}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value={"left"}
                    control={<Radio />}
                    label="Esgrimista izquierda"
                    {...register("winner")}
                  />
                  <FormControlLabel
                    value={"right"}
                    control={<Radio />}
                    label="Esgrimista derecha"
                    {...register("winner")}
                  />
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Crear
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

export default TrainerAddCombat;
