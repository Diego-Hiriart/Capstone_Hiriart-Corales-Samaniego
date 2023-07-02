import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import axios from "../../services/axios";
import { Error as MoveError } from "../../types";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAlert } from "../../hooks/useAlert";
import MoveErrorCreate from "./MoveErrorCreate";

const MoveErrorList = () => {
  const [moveErrors, setMoveErrors] = useState<MoveError[]>(null!);
  const { showError, showSuccess } = useAlert();
  const [open, setOpen] = useState(false);

  const url = "/dashboard/error";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${url}/${id}`);
      showSuccess("Error de entrenamiento eliminado correctamente");
      fetchMoveErrors();
    } catch (error) {
      console.error(error);
      showError("Hubo un error al eliminar el error de entrenamiento");
    }
  };

  const fetchMoveErrors = useCallback(async () => {
    const { data } = await axios.get(url);
    setMoveErrors(data.data);
  }, []);

  useEffect(() => {
    fetchMoveErrors().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los errores de entrenamiento");
    });
  }, []);

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
            Errores de entrenamiento
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Crear nuevo
          </Button>
        </Box>
        <List sx={{ mt: 1 }}>
          {moveErrors?.map((moveError) => (
            <ListItem
              key={moveError.errorID}
              disablePadding
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  onClick={(e) => handleDelete(moveError.errorID)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`${moveError.name}`} />
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <MoveErrorCreate
        open={open}
        handleClose={handleClose}
        fetchMoveErrors={fetchMoveErrors}
      />
    </Container>
  );
};

export default MoveErrorList;
