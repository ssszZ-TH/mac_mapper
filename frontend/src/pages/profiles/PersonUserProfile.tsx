import React, { useState, useEffect, useContext } from "react";
import { Box, Container, Typography, Paper, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getMyProfile } from "../../services/auth";
import { useTheme } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import AppBarCustom from "../../components/AppBarCustom";
import { formatDateTime } from "../../utils/time_util";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string | null;
  personal_id_number?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  nick_name?: string | null;
  birth_date?: string;
  gender_type_id?: number | null;
  marital_status_type_id?: number | null;
  country_id?: number | null;
  height?: number;
  weight?: number;
  racial_type_id?: number | null;
  income_range_id?: number | null;
  about_me?: string | null;
}

export default function PersonUserProfile() {
  const { isDarkMode } = useTheme();
  const { setIsAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          logout();
          navigate("/login");
          return;
        }
        const data = await getMyProfile(token);
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, logout]);

  const handleHome = () => {
    navigate("/homes/person-user");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBarCustom title="Person User Profile" />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "shape.borderRadius", bgcolor: "background.paper" }}>
          <Typography variant="h4" sx={{ color: "text.primary", mb: 2 }}>
            Profile
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>ID:</strong> {profile.id}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Username:</strong> {profile.username}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Role:</strong> {profile.role}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Personal ID Number:</strong> {profile.personal_id_number || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>First Name:</strong> {profile.first_name || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Middle Name:</strong> {profile.middle_name || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Last Name:</strong> {profile.last_name || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Nick Name:</strong> {profile.nick_name || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Birth Date:</strong> {formatDate(profile.birth_date)}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Gender Type ID:</strong> {profile.gender_type_id || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Marital Status Type ID:</strong> {profile.marital_status_type_id || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Country ID:</strong> {profile.country_id || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Height:</strong> {profile.height || "N/A"} cm
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Weight:</strong> {profile.weight || "N/A"} kg
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Racial Type ID:</strong> {profile.racial_type_id || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Income Range ID:</strong> {profile.income_range_id || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>About Me:</strong> {profile.about_me || "N/A"}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Created At:</strong> {formatDateTime(profile.created_at)}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              <strong>Updated At:</strong> {profile.updated_at ? formatDateTime(profile.updated_at) : "N/A"}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={handleHome}
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": { backgroundColor: "primary.dark" },
                textTransform: "none",
                borderRadius: "shape.borderRadius",
              }}
            >
              Home
            </Button>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "error.main",
                color: "error.contrastText",
                "&:hover": { backgroundColor: "error.dark" },
                textTransform: "none",
                borderRadius: "shape.borderRadius",
              }}
            >
              Logout
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}