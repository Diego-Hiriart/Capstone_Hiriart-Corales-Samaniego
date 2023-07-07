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
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { Fencer, TrainingGroupFull } from "../../types";

const schema = z.object({
  fencer: z.string().nonempty({ message: "Campo requerido" }),
});

type GroupAddFencerForm = z.infer<typeof schema>;

interface GroupAddFencerProps {
  group: TrainingGroupFull;
  handleClose: () => void;
  open: boolean;
}

const GroupAddFencer = ({ open, handleClose, group }: GroupAddFencerProps) => {
  const [fencers, setFencers] = useState<Fencer[]>(null!);
  const [fencerID, setFencerID] = useState<number>(null!);

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
  } = useForm<GroupAddFencerForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<GroupAddFencerForm> = async (formData) => {
    try {
      if (!fencerID) return;
      console.log(fencerID);

      await axios.put("/dashboard/fencer/", {
        id: fencerID,
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
                options={fencers
                  ?.filter(
                    (fencer) =>
                      !group?.fencer.find(
                        (groupFencer) =>
                          groupFencer.fencerID === fencer.fencerID
                      )
                  )
                  .map((fencer) => ({
                    label: fencer.user.names + " " + fencer.user.lastNames,
                    id: fencer.fencerID,
                  }))}
                sx={{ width: 300 }}
                onChange={(e, value) => setFencerID(value?.id || 0)}
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
