import { Box, Container, Typography, css } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useAlert } from "../../../hooks/useAlert";
import axios from "../../../services/axios";
import { CycleFeedback } from "../../../types";
import dayjs from "dayjs";

const CycleFeedbackItem = () => {
  const { cycleId } = useParams();
  const { user } = useAuth();
  const { showError } = useAlert();
  const [cycleFeedback, setCycleFeedback] = useState<CycleFeedback>();

  useEffect(() => {
    const fetchCycleGoal = async () => {
      const fencerId = user?.fencer?.fencerID;
      const url = `/dashboard/fencer/${fencerId}/cycle_feedback/${cycleId}`;
      const { data } = await axios.get(url);
      setCycleFeedback(data.data);
    };
    fetchCycleGoal().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar el feedback del mesociclo");
    });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box my={{ xs: 3, sm: 8 }}>
        <Typography sx={{ flexGrow: 1 }} variant="h1">
          Feedback del mesociclo
        </Typography>
        <Typography css={contentStyles}>
          {cycleFeedback?.content}
        </Typography>
        <Typography paragraph variant="caption" sx={{textAlign: "end"}}>
            {dayjs(cycleFeedback?.date).format("DD MMMM YYYY")} por{" "}
            {cycleFeedback?.trainer?.user?.names} {cycleFeedback?.trainer?.user?.lastNames}
        </Typography>
      </Box>
    </Container>
  );
};

const contentStyles = css`
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
`

export default CycleFeedbackItem;
