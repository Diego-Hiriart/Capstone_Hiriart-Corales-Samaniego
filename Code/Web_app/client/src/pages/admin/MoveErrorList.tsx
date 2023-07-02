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
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { Error as MoveError } from "../../types";
import EditIcon from "@mui/icons-material/Edit";

const MoveErrorList = () => {
  const [moveErrors, setMoveErrors] = useState<MoveError[]>(null!);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchMoveErrors = async () => {
      const { data } = await axios.get("/dashboard/error");
      setMoveErrors(data.data);
    };
    fetchMoveErrors();
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
                <IconButton aria-label="comment">
                  <EditIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`${moveError.name}`} />
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Training Error</DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </Container>
  );
};

export default MoveErrorList;
