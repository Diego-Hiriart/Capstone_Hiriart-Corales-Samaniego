import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import axios from "../../services/axios";
import { DailyPlan, MesoCycle, MicroCycle } from "../../types";
import { formatDate } from "../../utils/formatDate";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const MesoCycleDetails = () => {
  const { id } = useParams();
  const [microCycles, setMicroCycles] = useState<MicroCycle[]>(null!);
  const [mesoCycle, setMesoCycle] = useState<MesoCycle>(null!);
  const [currentCycle, setCurrentCycle] = useState<MicroCycle>(null!);
  const [cyclePlans, setCyclePlans] = useState<DailyPlan[]>(null!);
  const [days, setDays] = useState<Date[]>(null!);

  console.log(mesoCycle);
  console.log(microCycles);
  console.log(currentCycle);

  console.log(cyclePlans);
  console.log(days);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data } = await axios.get("/dashboard/meso_cycle/" + id);

      setMesoCycle(data.data);
      setMicroCycles(data.data.microCycle);
      setCurrentCycle(data.data.microCycle[0]);
      setCyclePlans(data.data.microCycle[0].dailyPlan);
      setDays(
        dateRange(
          new Date(data.data.microCycle[0].startDate),
          new Date(data.data.microCycle[0].endDate)
        )
      );
    };

    fetchGroup();
  }, []);

  const dateRange = (startDate: Date, endDate: Date, steps = 1) => {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getDate() + steps);
    }

    return dateArray;
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box py={{ xs: 2, lg: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {currentCycle ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Typography variant="h1" alignSelf="start" sx={{ mb: 4 }}>
                  {formatDate(currentCycle.startDate)} -{" "}
                  {formatDate(currentCycle.endDate)}
                </Typography>
                <Button>
                  <ArrowBackIosIcon />
                </Button>
                <Button>
                  <ArrowForwardIosIcon />
                </Button>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    "--Grid-borderWidth": "1px",
                    borderTop: "var(--Grid-borderWidth) solid",
                    borderLeft: "var(--Grid-borderWidth) solid",
                    borderColor: "divider",
                    "& > div": {
                      borderRight: "var(--Grid-borderWidth) solid",
                      borderBottom: "var(--Grid-borderWidth) solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  {days.map((item) => {
                    return (
                      <Grid item xs={12 / days.length}>
                        <Typography>
                          {item
                            .toLocaleDateString("es-mx", {
                              weekday: "long",
                            })
                            .toUpperCase()}{" "}
                          {item.getDate()}
                        </Typography>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default MesoCycleDetails;
