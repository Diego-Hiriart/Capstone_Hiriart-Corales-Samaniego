/* eslint-disable @typescript-eslint/no-explicit-any */
import DeleteIcon from "@mui/icons-material/Delete";
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
import { MachineCombatData } from "../../types";
import AcademyDeleteMachine from "./AcademyDeleteMachine";

const AcademyMachines = () => {
  const [machines, setMachines] = useState<MachineCombatData[]>(null!);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<string>(null!);

  useEffect(() => {
    const fetchMachines = async () => {
      const { data } = await axios.get("/dashboard/machine_combat_data/");

      function filterObjectsByRepeatedValue<T extends keyof MachineCombatData>(
        objects: MachineCombatData[],
        filterKey: T
      ): MachineCombatData[] {
        const valueCounts: any = {};
        const includedIndices: any = {};

        objects.forEach((obj, index) => {
          const propertyValue = obj[filterKey];
          if (propertyValue) {
            valueCounts[propertyValue] = (valueCounts[propertyValue] || 0) + 1;
            if (valueCounts[propertyValue] === 1) {
              includedIndices[propertyValue] = index;
            }
          }
        });

        return Object.values(includedIndices).map(
          (index: any) => objects[index]
        );
      }

      setMachines(filterObjectsByRepeatedValue(data.data, "machineName"));
    };

    fetchMachines();
  }, []);

  const handleRemoveClose = () => {
    setRemoveDialogOpen(false);
  };

  const handleRemoveOpen = (name: string) => {
    setSelectedName(name);
    setRemoveDialogOpen(true);
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
            Máquinas Disponibles
          </Typography>
        </Box>
        <List sx={{ mt: 1 }}>
          {machines?.map((machine) => (
            <ListItem key={machine.machineCombatDataID} disablePadding>
              <ListItemButton sx={{ px: 1 }}>
                <ListItemAvatar>
                  <Avatar></Avatar>
                </ListItemAvatar>
                <ListItemText primary={machine.machineName} />
              </ListItemButton>
              <Button
                variant="text"
                onClick={() => handleRemoveOpen(machine.machineName)}
              >
                <DeleteIcon />
              </Button>
            </ListItem>
          ))}
        </List>
        {/* TODO: Add pagination */}
      </Box>
      <AcademyDeleteMachine
        machineName={selectedName}
        handleClose={handleRemoveClose}
        open={removeDialogOpen}
      />
    </Container>
  );
};

export default AcademyMachines;
