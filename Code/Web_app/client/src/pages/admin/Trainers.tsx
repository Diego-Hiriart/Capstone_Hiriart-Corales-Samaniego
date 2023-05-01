import {
  Avatar,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../services/axios";
import { User } from "../../types";
import { Link } from "react-router-dom";

const Trainers = () => {
  const [trainers, setTrainers] = useState<User[]>(null!);

  useEffect(() => {
    //   const fetchTrainers = async () => {
    //     const { data } = await axios.get("/api/trainers");
    //     setTrainers(data.data);
    //   }
    //   fetchTrainers();
    setTrainers([
      {
        userID: 24,
        email: "mscott@gmail.com",
        password: "password123",
        names: "Michael",
        lastNames: "Scott",
        roles: ["trainer"],
        createdAt: new Date("2023-04-29 05:45:32.797"),
        updatedAt: null,
      },
      {
        userID: 24,
        email: "mscott@gmail.com",
        password: "password123",
        names: "Michael",
        lastNames: "Scott",
        roles: ["trainer"],
        createdAt: new Date("2023-04-29 05:45:32.797"),
        updatedAt: null,
      },
      {
        userID: 24,
        email: "mscott@gmail.com",
        password: "password123",
        names: "Michael",
        lastNames: "Scott",
        roles: ["trainer"],
        createdAt: new Date("2023-04-29 05:45:32.797"),
        updatedAt: null,
      },
    ]);
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box py={{xs: 2, lg: 4}}>
        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap"}}>
          <Typography variant="h1" alignSelf="start">Trainers</Typography>
          {/* TODO: icon button on mobile */}
          <Button component={Link} to="create" variant="contained" sx={{mt: 2}}>Agregar entrenador</Button>
        </Box>
        <List sx={{mt: 1}}>
          {trainers?.map((trainer) => (
            <ListItem key={trainer.userID} disablePadding>
              {/* TODO: add link to trainer profile */}
              <ListItemButton sx={{px: 1}}>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${trainer.names} ${trainer.lastNames}`}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Trainers;
