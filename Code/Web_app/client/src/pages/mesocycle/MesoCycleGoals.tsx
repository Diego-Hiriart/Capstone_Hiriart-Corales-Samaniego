import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MesoCycleFull } from "../../types";
import AuthContext from "../../contexts/AuthContext";
import axios from "../../services/axios";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { formatDate } from "../../utils/formatDate";

const schema = z.object({
  content: z.string(),
});

type CycleGoalForm = z.infer<typeof schema>;

const MesoCycleGoals = () => {
  const { id } = useParams();
  const [mesoCycle, setMesoCycle] = useState<MesoCycleFull>(null!);
  const [openAddActivity, setOpenAddActivity] = useState(false);
  const [openLoad, setOpenLoad] = useState(false);
  const [index, setIndex] = useState<number>(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCycle = async () => {
      const { data } = await axios.get("/dashboard/meso_cycle/" + id);
      setMesoCycle(data.data);
    };

    fetchCycle();
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CycleGoalForm>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CycleGoalForm> = async (formData) => {
    try {
      await axios.post("/dashboard/cycle_goal/", {
        data: {
          content: formData.content,
          date: new Date(),
        },
      });
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al crear ciclo",
        });
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box py={{ xs: 2, lg: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h1" alignSelf="start">
            Objetivo
          </Typography>
        </Box>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <TextField
            fullWidth
            multiline
            defaultValue={mesoCycle?.cycleGoal?.content || "  "}
            disabled={!user?.roles?.includes("trainer")}
            id="content"
            autoFocus
            {...register("content")}
          />
          <Typography>
            Modificado por última vez:{" "}
            {formatDate(new Date(mesoCycle?.cycleGoal?.date)) || ""}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Actualizar
          </Button>
        </Box>

        <Typography></Typography>
      </Box>
    </Container>
  );
};

export default MesoCycleGoals;
