import { Box, Container, css,Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAlert } from "../../../hooks/useAlert";
import useAuth from "../../../hooks/useAuth";
import axios from "../../../services/axios";
import { CycleFeedback } from "../../../types";

const CycleFeedbackItem = () => {
  const { cycleId } = useParams();
  const { user } = useAuth();
  const { showError } = useAlert();
  const [cycleFeedback, setCycleFeedback] = useState<CycleFeedback>();

  useEffect(() => {
    const fetchCycleFeedback = async () => {
      const fencerId = user?.fencer?.fencerID;
      const url = `/dashboard/fencer/${fencerId}/cycle_feedback/${cycleId}`;
      const { data } = await axios.get(url);
      setCycleFeedback(data.data);
    };
    fetchCycleFeedback().catch((error) => {
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
        {cycleFeedback ? (
          <Box>
            <Typography css={contentStyles}>
              {cycleFeedback?.content}
            </Typography>
            <Typography paragraph variant="caption" sx={{ textAlign: "end" }}>
              {dayjs(cycleFeedback?.date).format("DD MMMM YYYY")} por{" "}
              {cycleFeedback?.trainer?.user?.names}{" "}
              {cycleFeedback?.trainer?.user?.lastNames}
            </Typography>
          </Box>
        ) : (
          <Typography>No hay feedback para este mesociclo</Typography>
        )}
      </Box>
    </Container>
  );
};

const contentStyles = css`
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1rem;
`;

export default CycleFeedbackItem;