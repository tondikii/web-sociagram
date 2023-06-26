import {useState} from "react";
interface Props {
  onOpen?: Function;
  onClose?: Function;
}
const useToggle = ({onOpen = () => {}, onClose = () => {}}: Props = {}) => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    if (!open) {
      onOpen();
    } else {
      onClose();
    }
    setOpen(!open);
  };
  return [open, toggle];
};

export default useToggle;
