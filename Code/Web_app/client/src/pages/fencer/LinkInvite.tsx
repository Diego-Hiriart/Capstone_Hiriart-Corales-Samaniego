import { Button, DialogActions, TextField } from "@mui/material";

import { useAlert } from "../../hooks/useAlert";

interface LinkInviteProps {
  inviteLink: string;
  handleClose: () => void;
}

const LinkInvite = ({ inviteLink, handleClose }: LinkInviteProps) => {
  const { showInfo } = useAlert();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showInfo("Link copiado al portapapeles");
  }

  return (
    <div>
      <TextField variant="outlined" inputProps={{readOnly: true}} defaultValue={inviteLink}></TextField>
      <DialogActions sx={{ mt: 3 }}>
        <Button fullWidth variant="outlined" onClick={handleClose}>
          Aceptar
        </Button>
        <Button fullWidth variant="contained" onClick={() => handleCopy(inviteLink)}>
          Copiar
        </Button>
      </DialogActions>
    </div>
  );
};

export default LinkInvite;
