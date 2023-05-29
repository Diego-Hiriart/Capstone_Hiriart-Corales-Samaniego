import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import axios from "../../services/axios";
import { Fencer, TrainingGroupFull } from "../../types";

interface GroupRemoveFencer {
  fencer: Fencer;
  group: TrainingGroupFull;
  handleClose: () => void;
  open: boolean;
}

const GroupRemoveFencer = ({
  open,
  handleClose,
  fencer,
  group,
}: GroupRemoveFencer) => {
  const navigate = useNavigate();

  const { setError } = useForm();

  const onSubmit = async () => {
    try {
      await axios.put("/dashboard/fencer/group/" + fencer.fencerID);
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al remover integrante",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Remover Integrante</DialogTitle>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography>
              ¿Seguro que desea remover a {fencer?.user?.names}{" "}
              {fencer?.user?.lastNames} del Grupo: {group?.name}?
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Remover del grupo
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

export default GroupRemoveFencer;
