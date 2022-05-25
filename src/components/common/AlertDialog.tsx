import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AlertDialogProps {
  isDialogOpen: boolean;
  handleCloseWithResponse: (resp: boolean) => void;
}

export default function AlertDialog(props: AlertDialogProps) {
  const { isDialogOpen, handleCloseWithResponse } = props;
  return (
    <div>
      <Dialog
        open={isDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Submit"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to end the test and submit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleCloseWithResponse(true)}
            variant="contained"
          >
            Yes
          </Button>
          <Button
            onClick={() => handleCloseWithResponse(false)}
            variant="outlined"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
