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
}: CombatProps) => (
  <Grid container spacing={2} columns={16}>
    <Grid item xs={7}>
      <Box
        sx={{
          px: 1,
          display: "flex",
        }}
      >
        <ListItemAvatar>
          <Avatar></Avatar>
        </ListItemAvatar>
        <ListItemText primary={`${fencer1Name}`} />
        {winnerFencerID === fencer1ID && <WinnerIcon text="GANADOR" />}
      </Box>
    </Grid>
    <Grid item xs={2} sx={{ textAlign: "center" }}>
      <Typography sx={{ marginX: "4px" }}>VS</Typography>
    </Grid>
    <Grid item xs={7}>
      <Box
        sx={{
          px: 1,
          display: "flex",
        }}
      >
        {winnerFencerID === fencer2ID && <WinnerIcon text="GANADOR" />}
        <ListItemText
          sx={{ textAlignLast: "end", marginRight: 2 }}
          primary={`${fencer2Name}`}
        />
        <ListItemAvatar>
          <Avatar></Avatar>
        </ListItemAvatar>
      </Box>
    </Grid>
  </Grid>
);
