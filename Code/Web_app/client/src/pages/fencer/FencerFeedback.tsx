import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { SingleFeedback } from "../../types";
import axios from "../../services/axios";
import { useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import AddFeedbackDialog from "./AddFeedbackDialog";
import FeedbackDialog from "./FeedbackDialog";
import useAuth from "../../hooks/useAuth";
import { useAlert } from "../../hooks/useAlert";

interface feedbacksResponse {
  data: SingleFeedback[] | null;
  count: number;
}

const FencerFeedback = () => {
  const resultsPerPage = 5; //Has to be the same as the one in the backend constants.ts file
  const { id } = useParams();
  const { showError } = useAlert();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [feedbacks, setFeedbacks] = useState<feedbacksResponse>({
    data: null,
    count: 0,
  });
  const [showAddFeedbackDialog, setShowAddFeedbackDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<SingleFeedback | null>(null);

  const handleAddFeedbackDialogOpen = () => {
    setShowAddFeedbackDialog(true);
  };

  const handleFeedbackDialogOpen = (feedback: SingleFeedback | null) => {
    setShowFeedbackDialog(true);
    setSelectedFeedback(feedback);
  };

  const handleClose = () => {
    setShowAddFeedbackDialog(false);
    setShowFeedbackDialog(false);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
    setPage(value);
  };

  const fetchFeedbacks = useCallback(async () => {
    const fencerId = user?.roles.includes("fencer") ? user?.fencer?.fencerID : id;
    const url = `/dashboard/fencer_single_feedback/${fencerId}`;
    const { data } = await axios.get(
      url,
      { params: { page } }
    );
    setFeedbacks(data);
  }, [page]);

  useEffect(() => {
    fetchFeedbacks().catch((error) => {
      console.error(error);
      showError("Hubo un error al cargar los feedbacks");
    });
  }, [fetchFeedbacks, page]);

  const showPagination = feedbacks?.count > resultsPerPage;

  return (
    <Container component="main" maxWidth="sm">
      <Box my={{ xs: 3, sm: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ flexGrow: 1 }} variant="h1">
            Feedbacks
          </Typography>
          {user?.roles.includes("trainer") && (
            <Button variant="contained" onClick={handleAddFeedbackDialogOpen}>
              Crear nuevo
            </Button>
          )}
        </Box>
        <List>
          {feedbacks?.data?.map((feedback) => (
            <ListItem
              key={feedback.singleFeedbackID}
              alignItems="flex-start"
              divider
              disablePadding
            >
              <ListItemButton
                sx={{ px: 1 }}
                onClick={() => handleFeedbackDialogOpen(feedback)}
              >
                <ListItemText
                  primary={dayjs(feedback.date).format("DD MMMM YYYY")}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {feedback.content}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* TODO: add pagination */}
      </Box>
      <AddFeedbackDialog
        open={showAddFeedbackDialog}
        handleClose={handleClose}
        fetchFeedbacks={fetchFeedbacks}
      />
      <FeedbackDialog
        open={showFeedbackDialog}
        handleClose={handleClose}
        feedback={selectedFeedback}
      />
      {showPagination && (
        <Pagination
          sx={{ display: "flex", justifyContent: "center" }}
          count={Math.ceil(feedbacks?.count / resultsPerPage)}
          page={Number(page)}
          onChange={(e, value) => handlePageChange(e, value)}
        />
      )}
    </Container>
  );
};

export default FencerFeedback;
