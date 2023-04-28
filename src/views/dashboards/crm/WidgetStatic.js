import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import { Card, Typography, Box, IconButton } from "@mui/material";
import { fShortenNumber } from "src/utils/formatNumber";
import Button from "@mui/material/Button";
import Iconify from "../../../component/Iconify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 2, 2, 3),
  height: "100%",
  flexDirection: "column",
  position: "relative",
}));

// ----------------------------------------------------------------------

WidgetStatic.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
  icon: PropTypes.any,
  title: PropTypes.string,
};

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(16),
  height: theme.spacing(16),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

export default function WidgetStatic({
  title,
  total,
  icon,
  isMoney = true,
  color = "success",
  actions = null,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <RootStyle>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ position: "absolute", right: 0, top: 0 }}>
            <MoreVertIcon onClick={handleClick} />
          </div>
          <div>
            <Typography variant="h3">
              {isMoney ? fShortenNumber(total) : total} {isMoney && "$"}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              {title}
              {actions && actions}
            </Typography>
          </div>
          <Box>
            <IconWrapperStyle
              sx={{
                color: (theme) => theme.palette[color].dark,
                bgcolor: "white",
                backgroundImage: (theme) =>
                  `linear-gradient(135deg, ${alpha(
                    theme.palette[color].dark,
                    0
                  )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
              }}
            >
              <Iconify icon={icon} width={35} height={35} />
            </IconWrapperStyle>
          </Box>
        </div>
        <Button>Turn On</Button>
        <Menu
            
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>On</MenuItem>
          <MenuItem onClick={handleClose}>Off</MenuItem>
        </Menu>
      </RootStyle>
    </>
  );
}
