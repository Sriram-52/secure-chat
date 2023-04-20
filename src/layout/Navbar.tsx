import { useEffect, useState } from "react";
import ChatProvider from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { E2eeManger } from "../utils/e2ee";
import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";

export default function Navbar({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      await E2eeManger.instance.generateKeyPair();
      console.log("Key pair generated");
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#596d9e" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat App
          </Typography>
          <Typography variant="h6" component="div">
            <Tooltip title={user?.name}>
              <Avatar sx={{ bgcolor: "#e3ebf6", color: "#596d9e" }}>
                {user?.name?.[0]}
              </Avatar>
            </Tooltip>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main">
        {loading ? (
          <Typography variant="h6" component="div" sx={{ textAlign: "center" }}>
            Generating key pair...
          </Typography>
        ) : (
          <ChatProvider>{children}</ChatProvider>
        )}
      </Box>
    </>
  );
}
