import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import RegisterForm from "./RegisterForm";

export default function RegisterDrawer({ open, onClose }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <RegisterForm />
    </Drawer>
  );
}
