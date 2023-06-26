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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AxiosError } from "axios";
import enGB from "date-fns/locale/en-GB";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { z } from "zod";
import axios from "../../services/axios";
import { Fencer, TrainingCombatFull } from "../../types";

const schema = z.object({
  fencer1Name: z.string().optional(),
  fencer2Name: z.string().optional(),
  fencer1Score: z.string().optional(),
  fencer2Score: z.string().optional(),
});

type TrainerAddCombatForm = z.infer<typeof schema>;

interface TrainerAddCombatProps {
  handleClose: () => void;
  open: boolean;
  combat: TrainingCombatFull;
}

type leftRight = "left" | "right" | string;

const EditCombat = ({ open, handleClose, combat }: TrainerAddCombatProps) => {
  const [date, setDate] = useState<Date>(null!);
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [selectedWinner, setSelectedWinner] = useState<leftRight>(null!);
  const { id } = useParams();

  useEffect(() => {
    const fetchFencers = async () => {
      const { data } = await axios.get("/dashboard/fencer/");
      setFencers(data.data);
    };

    fetchFencers();
  }, []);

  useEffect(() => {
    setDate(combat?.dateTime);
    setSelectedWinner(
      combat?.winnerFencerID === combat?.fencer1ID ? "left" : "right"
    );
  }, [combat]);

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

      await axios.put("/dashboard/training_combat/" + id, {
        data: {
          fencer1ID: fencer1?.fencerID,
          fencer2ID: fencer2?.fencerID,
          fencer1Score: Number(formData.fencer1Score),
          fencer2Score: Number(formData.fencer2Score),
          dateTime: date,
          winner: selectedWinner,
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

  const handleRadioChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | SyntheticEvent<Element, Event>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | any
  ) => {
    setSelectedWinner(event.target.value);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar combate</DialogTitle>
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
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enGB}
                  >
                    <DatePicker
                      value={date ? new Date(date) : date}
                      onChange={(newValue: Date | null) => {
                        setDate(newValue || new Date());
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
                  defaultValue={`${combat?.fencer1.user.names} ${combat?.fencer1.user.lastNames}`}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      margin="normal"
                      label="Nombre"
                      autoFocus
                      {...register("fencer1Name")}
                      error={!errors.fencer1Name}
                      helperText={errors.fencer1Name?.message}
                      {...params}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="fencer1Score"
                  label="Puntaje"
                  type="number"
                  autoFocus
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("fencer1Score")}
                  error={!errors.fencer1Score}
                  helperText={errors.fencer1Score?.message}
                  defaultValue={combat?.fencer1Score}
                />

                <FormLabel>Esgrimista derecha</FormLabel>
                <Autocomplete
                  disablePortal
                  id="fencer"
                  options={fencers?.map(
                    (fencer) => fencer.user.names + " " + fencer.user.lastNames
                  )}
                  defaultValue={`${combat?.fencer2.user.names} ${combat?.fencer2.user.lastNames}`}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      margin="normal"
                      label="Nombre"
                      autoFocus
                      {...register("fencer2Name")}
                      error={!errors.fencer2Name}
                      helperText={errors.fencer2Name?.message}
                      {...params}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="fencer2Score"
                  label="Puntaje"
                  type="number"
                  autoFocus
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("fencer2Score")}
                  error={!errors.fencer2Score}
                  helperText={errors.fencer2Score?.message}
                  defaultValue={combat?.fencer2Score}
                />

                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Ganador
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    value={selectedWinner}
                    // {...register("winner")}
                  >
                    <FormControlLabel
                      value={"left"}
                      control={<Radio />}
                      label="Esgrimista izquierda"
                      checked={selectedWinner === "left"}
                      onChange={handleRadioChange}
                    />
                    <FormControlLabel
                      value={"right"}
                      control={<Radio />}
                      label="Esgrimista derecha"
                      checked={selectedWinner === "right"}
                      onChange={handleRadioChange}
                    />
                  </RadioGroup>
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Editar
                </Button>
                <Button fullWidth variant="outlined" onClick={handleClose}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCombat;
