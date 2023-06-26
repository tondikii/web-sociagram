import {Button} from "@mui/material";
import type {NextComponentType, NextPageContext} from "next";

interface Props {
  text: string;
  onClick: Function;
}

const ButtonPrimary: NextComponentType<NextPageContext, {}, Props> = ({
  text = "",
  onClick = () => {},
}: Props) => {
  return (
    <Button
      variant="contained"
      style={{textTransform: "none"}}
      className="bg-primary"
      onClick={() => onClick()}
    >
      {text}
    </Button>
  );
};

export default ButtonPrimary;
