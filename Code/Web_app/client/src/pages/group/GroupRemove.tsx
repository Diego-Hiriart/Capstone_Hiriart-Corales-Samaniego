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

interface GroupRemove {
  groupID: number;
  groupName: string;
  handleClose: () => void;
  open: boolean;
}

const GroupRemove = ({
  open,
  handleClose,
  groupID,
  groupName,
}: GroupRemove) => {
  const navigate = useNavigate();

  const { setError } = useForm();

  const onSubmit = async () => {
    try {
      await axios.delete("/dashboard/training_group/" + groupID);
      navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("root", {
          type: "manual",
          message: "Ha ocurrido un error al remover el grupo",
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
              ¿Seguro que desea remover el grupo &quot;{groupName}&quot;?
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

export default GroupRemove;
