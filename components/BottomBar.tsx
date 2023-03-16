import * as React from "react";
import Box from "@mui/material/Box";
import {BottomNavigation, BottomNavigationAction} from "@mui/material";
import {
  Restore as RestoreIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import {NextComponentType, NextPageContext} from "next";

interface Props {}

const BottomBar: NextComponentType<NextPageContext, {}, Props> = () => {
  const [value, setValue] = React.useState(0);

  return (
    <nav className="sticky top-0">
      <Box sx={{width: 500}}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </Box>
    </nav>
  );
};

export default BottomBar;
