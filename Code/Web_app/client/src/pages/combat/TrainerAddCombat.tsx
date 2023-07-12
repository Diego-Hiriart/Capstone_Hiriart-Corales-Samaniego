import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AxiosError } from "axios";
import enGB from "date-fns/locale/en-GB";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import axios from "../../services/axios";
import { Fencer, MachineCombatData } from "../../types";
import TrainerCombatMachineData from "./TrainerCombatMachineData";

const schema = z.object({
  fencer1Name: z.string(),
  fencer2Name: z.string(),
  fencer1Score: z.string(),
  fencer2Score: z.string(),
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
  const [openModal, setOpenModal] = useState(false);
  const [machineData, setMachineData] = useState<MachineCombatData>(null!);
  const [fencer1ID, setFencer1ID] = useState<number>(null!);
  const [fencer2ID, setFencer2ID] = useState<number>(null!);

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
    reset,
    formState: { errors },
  } = useForm<TrainerAddCombatForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (machineData) {
      reset({
        fencer1Score: machineData.leftScore.toString(),
        fencer2Score: machineData.rightScore.toString(),
      });

      setSelectedWinner(setScore(machineData));
    }
  }, [machineData]);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TrainerAddCombatForm> = async (formData) => {
    try {
      await axios.post("/dashboard/training_combat/", {
        data: {
          fencer1ID: fencer1ID,
          fencer2ID: fencer2ID,
          fencer1Score: Number(formData.fencer1Score),
          fencer2Score: Number(formData.fencer2Score),
          dateTime: date,
          winnerFencerID: selectedWinner === "left" ? fencer1ID : fencer2ID,
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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleMachine = () => {
    setOpenModal(true);
  };

  const setMachineState = (data: MachineCombatData) => {
    setMachineData(data);
  };

  const setScore = (data: MachineCombatData): leftRight => {
    if (!machineData) return "";

    if (data.leftScore > data.rightScore) {
      return "left";
    } else if (data.leftScore < data.rightScore) {
      return "right";
    } else if (data.leftScore === data.rightScore && data.leftPriority) {
      return "left";
    } else {
      return "right";
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
        <DialogTitle>Crear combate</DialogTitle>
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
                  <FormLabel required>Fecha</FormLabel>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enGB}
                  >
                    <DatePicker
                      value={
                        machineData ? new Date(machineData.dateTime) : date
                      }
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
                  options={fencers?.map((fencer) => ({
                    label: fencer.user.names + " " + fencer.user.lastNames,
                    id: fencer.fencerID,
                  }))}
                  sx={{ width: 300 }}
                  onChange={(e, value) => setFencer1ID(value?.id || 0)}
                  renderInput={(params) => (
                    <TextField
                      required
                      margin="normal"
                      label="Nombre"
                      autoFocus
                      {...register("fencer1Name")}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("fencer1Score")}
                  helperText={errors.fencer1Score?.message}
                  defaultValue={machineData?.leftScore}
                />

                <FormLabel>Esgrimista derecha</FormLabel>
                <Autocomplete
                  disablePortal
                  id="fencer"
                  options={fencers?.map((fencer) => ({
                    label: fencer.user.names + " " + fencer.user.lastNames,
                    id: fencer.fencerID,
                  }))}
                  sx={{ width: 300 }}
                  onChange={(e, value) => setFencer2ID(value?.id || 0)}
                  renderInput={(params) => (
                    <TextField
                      required
                      margin="normal"
                      label="Nombre"
                      autoFocus
                      {...register("fencer2Name")}
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                  {...register("fencer2Score")}
                  helperText={errors.fencer2Score?.message}
                  defaultValue={machineData?.rightScore}
                />

                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Ganador
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    value={selectedWinner}
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
                  onClick={handleMachine}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Traer datos de máquina
                </Button>

                <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.4)" }}></Divider>

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
      <TrainerCombatMachineData
        open={openModal}
        handleClose={handleCloseModal}
        setState={setMachineState}
        setDate={setDate}
      />
    </>
  );
};

export default TrainerAddCombat;
