import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  FormLabel,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import axios from "../../services/axios";
import { MachineCombatData } from "../../types";

const schema = z.object({
  machineName: z.string(),
});

type TrainerCombatMachineDataForm = z.infer<typeof schema>;

interface TrainerCombatMachineDataProps {
  handleClose: () => void;
  open: boolean;
  setState: (data: MachineCombatData) => void;
}

const TrainerCombatMachineData = ({
  open,
  handleClose,
  setState,
}: TrainerCombatMachineDataProps) => {
  const [machines, setMachines] = useState<MachineCombatData[]>(null!);

  useEffect(() => {
    const fetchMachines = async () => {
      const { data } = await axios.get("/dashboard/machine_combat_data/");
      setMachines(data.data);
    };

    fetchMachines();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TrainerCombatMachineDataForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<TrainerCombatMachineDataForm> = async (
    formData
  ) => {
    try {
      const machine = machines.find(
        (machine) => machine.machineName === formData.machineName
      );
      setState(machine!);
      handleClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error añadiendo datos de maquina",
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Datos de máquina</DialogTitle>
        <DialogContent>
          <Container component="main" maxWidth="xs">
            <Box>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1, display: "flex", flexDirection: "column" }}
              >
                <FormLabel>Nombre de máquina</FormLabel>
                <Autocomplete
                  disablePortal
                  id="machine"
                  options={machines?.map((machine) => machine.machineName)}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      margin="normal"
                      label="Nombre"
                      autoFocus
                      {...register("machineName")}
                      error={!!errors.machineName}
                      helperText={errors.machineName?.message}
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
                  Añadir datos
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

export default TrainerCombatMachineData;
