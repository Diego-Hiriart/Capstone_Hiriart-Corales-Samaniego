import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Avatar,
  Box,
  Grid,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

interface CombatProps {
  fencer1Name: string;
  fencer2Name: string;
  winnerFencerID: number;
  fencer1ID: number;
  fencer2ID: number;
  leftScore: number;
  rightScore: number;
}

interface WinnerIconProps {
  text: string;
}

export const WinnerIcon = ({ text }: WinnerIconProps) => (
  <Typography
    sx={{
      backgroundColor: "gray",
      color: "white",
      padding: "8px",
      borderRadius: "0.2rem",
    }}
  >
    {text}
  </Typography>
);

export const CombatEntry = ({
  fencer1Name,
  fencer2Name,
  fencer1ID,
  fencer2ID,
  winnerFencerID,
  leftScore,
  rightScore,
}: CombatProps) => (
  <Grid container spacing={2} columns={15} sx={{ pt: 2, pl: 2 }}>
    <Grid
      item
      xs={6}
      sx={{
        px: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      style={{ padding: 0 }}
    >
      <AccountCircleIcon
        color="action"
        sx={{ fontSize: 50 }}
      ></AccountCircleIcon>
      <Box
        sx={{
          display: "flex",
          gap: 5,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ListItemText primary={`${fencer1Name}`} />
        {winnerFencerID === fencer1ID && <WinnerIcon text="GANADOR" />}
      </Box>
    </Grid>

    {/* SCORE VS SCORE */}
    <Grid
      item
      xs={3}
      className="ADSAD"
      columns={10}
      style={{ padding: 0 }}
      sx={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid xs={4}>
        <Typography variant="h6">{leftScore}</Typography>
      </Grid>

      <Grid xs={2}>
        <Typography sx={{ backgroundColor: "lightGray", borderRadius: 1 }}>
          VS
        </Typography>
      </Grid>

      <Grid xs={4}>
        <Typography variant="h6">{rightScore}</Typography>
      </Grid>
    </Grid>

    <Grid
      item
      xs={6}
      sx={{
        px: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      style={{ padding: 0 }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 5,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {winnerFencerID === fencer2ID && <WinnerIcon text="GANADOR" />}
        <ListItemText
          sx={{ textAlignLast: "end" }}
          primary={`${fencer2Name}`}
        />
      </Box>
      <AccountCircleIcon
        color="action"
        sx={{ fontSize: 50 }}
      ></AccountCircleIcon>
    </Grid>
  </Grid>
);
