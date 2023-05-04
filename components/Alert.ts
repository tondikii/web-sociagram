import Swal from "sweetalert2";

export const Error = (text: string) =>
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: text,
  });

export const Success = (text: string) =>
  Swal.fire({
    icon: "success",
    title: "Success",
    text: text,
  });
