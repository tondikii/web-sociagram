import Swal from "sweetalert2";

export const Error = (props: {text: string}) =>
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: `${props.text}!`,
  });

export const Success = (props: {text: string}) =>
  Swal.fire({
    icon: "success",
    title: "Success",
    text: props.text,
  });
