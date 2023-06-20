import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  useTheme,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FlexBetween from "components/FlexBetween";

const styles = {
  myBackground: {
    //backgroundColor: "#4681f4!important",
    boxshadow: "grey 0px 0px 5px!important",
    backgroundColor: "rgb(0, 72, 190)!important",
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: "14px",
  },
  myBorder: {
    border: "2px solid green",
  },
  myFont: {
    color: "blue",
  },
};

const Popup = (props) => {
  const theme = useTheme();
  const {
    title,
    children,
    openPopup,
    setOpenPopup,
    width,
    handleYesBtnClick,
    handleNoBtnClick,
    yesBtn = false,
    noBtn = false,
  } = props;

  return (
    <Dialog
      open={openPopup}
      fullWidth={true}
      maxWidth={width}
      sx={{
        padding: theme.spacing(2),
        position: "absolute",
        top: theme.spacing(5),
      }}
    >
      <DialogTitle sx={{ paddingRight: "0px" }}>
        <FlexBetween>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Button
            color="secondary"
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <CloseIcon />
          </Button>
        </FlexBetween>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {yesBtn && (
          <Button
            sx={styles.myBackground}
            style={styles.myBorder}
            onClick={handleYesBtnClick}
          >
            Yes
          </Button>
        )}
        {noBtn && (
          <Button
            sx={styles.myBackground}
            style={styles.myBorder}
            onClick={handleNoBtnClick}
            autoFocus
          >
            No
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
