import { useEffect, useState } from "react";
import { editProfile, getProfile } from "../utils/api";
import InlineLoader from "../components/InlineLoader";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { updateField } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [semester, setSemester] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data.data);
      setForm(response.data.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (course) => {
    setSemester([]);
    if (!course) return;
    if (course === "bca") {
      setSemester([1, 2, 3, 4, 5, 6, 7, 8]);
    } else if (course === "mca") {
      setSemester([1, 2, 3, 4]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "course") fetchSemesters(value);
  };

  const handleQualificationChange = (index, field, value) => {
    const updatedQualifications = [...(form.educational_qualifications || [])];
    updatedQualifications[index][field] = value;
    setForm((prev) => ({
      ...prev,
      educational_qualifications: updatedQualifications,
    }));
  };

  const addQualification = () => {
    const updatedQualifications = [...(form.educational_qualifications || [])];
    updatedQualifications.push({ degree: "", institution: "" });
    setForm((prev) => ({
      ...prev,
      educational_qualifications: updatedQualifications,
    }));
  };

  const removeQualification = (index) => {
    const updatedQualifications = [...(form.educational_qualifications || [])];
    updatedQualifications.splice(index, 1);
    setForm((prev) => ({
      ...prev,
      educational_qualifications: updatedQualifications,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in form) {
        if (form[key] !== undefined && form[key] !== null) {
          if (key === "educational_qualifications") {
            formData.append(key, JSON.stringify(form[key]));
          } else {
            formData.append(key, form[key]);
          }
        }
      }

      if (profilePic) {
        formData.append("avatar", profilePic);
      }

      await editProfile(formData);
      setEditing(false);
      fetchProfile();
      dispatch(updateField({ key: "user.avatar", value: `${profilePic}` }));
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <InlineLoader />;
  if (!profile)
    return <div className="p-4 text-red-600">Profile not found</div>;

  return (
    <Card
      sx={{ maxWidth: 900, margin: "auto", mt: 4, p: 3, position: "relative" }}
    >
      <div className="flex items-center justify-items-start">
        <IconButton onClick={() => navigate(-1)} color="primary">
          <FaArrowLeft />
        </IconButton>

        <Typography variant="h5" fontWeight="bold">
          My Profile
        </Typography>
      </div>

      <Grid container spacing={3}>
        {/* Profile Pic */}
        <Grid item xs={12} sm={6}>
          {editing && (
            <>
              <Typography variant="body1" fontWeight="medium">
                Profile Picture
              </Typography>
              <input
                type="file"
                onChange={(e) => setProfilePic(e.target.files[0])}
                disabled={!editing}
                style={{ marginTop: 8 }}
              />
            </>
          )}
          <Box mt={2}>
            <Avatar sx={{ width: 80, height: 80, fontSize: 36 }}>
              {profile.avatar ? (
                <img
                  src={
                    profilePic
                      ? URL.createObjectURL(profilePic)
                      : profile.avatar
                  }
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                profile.name?.charAt(0)
              )}
            </Avatar>
          </Box>
        </Grid>

        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            fullWidth
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={form.email || ""}
            disabled
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            fullWidth
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </Grid>

        {/* Student Fields */}
        {profile.role === "student" && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Roll No"
                fullWidth
                name="roll_no"
                value={form.roll_no || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Registration No"
                fullWidth
                name="reg_no"
                value={form.reg_no || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="course"
                value={form.course || ""}
                onChange={handleChange}
                disabled={!editing}
                displayEmpty
              >
                <MenuItem value="">Select Course</MenuItem>
                <MenuItem value="bca">BCA</MenuItem>
                <MenuItem value="mca">MCA</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="semester"
                value={form.semester || ""}
                onChange={handleChange}
                disabled={!editing}
                displayEmpty
              >
                <MenuItem value="">Select Semester</MenuItem>
                {semester.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Enrollment Year"
                type="number"
                name="enrollment_year"
                fullWidth
                value={form.enrollment_year || ""}
                onChange={handleChange}
                disabled={!editing}
                inputProps={{
                  min: 1980,
                  max: new Date().getFullYear(),
                }}
              />
            </Grid>
          </>
        )}

        {/* Teacher Fields */}
        {profile.role === "teacher" && (
          <>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                name="designation"
                value={form.designation || ""}
                onChange={handleChange}
                disabled={!editing}
                displayEmpty
                >
                  <MenuItem value="">Select Designation</MenuItem>
                  <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
                  <MenuItem value="Professor">Professor</MenuItem>
                </Select>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expertise"
                fullWidth
                name="expertise"
                value={form.expertise || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Educational Qualifications
              </Typography>
              {(form.educational_qualifications || []).map((qual, index) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={index}
                  mb={1}
                >
                  <Grid item xs={12} sm={5}>
                    <TextField
                      placeholder="Degree"
                      fullWidth
                      value={qual.degree}
                      onChange={(e) =>
                        handleQualificationChange(
                          index,
                          "degree",
                          e.target.value
                        )
                      }
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      placeholder="Institution"
                      fullWidth
                      value={qual.institution}
                      onChange={(e) =>
                        handleQualificationChange(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      disabled={!editing}
                    />
                  </Grid>
                  {editing && (
                    <Grid item xs={12} sm={2}>
                      <Button
                        color="error"
                        onClick={() => removeQualification(index)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}
              {editing && (
                <Button
                  variant="text"
                  onClick={addQualification}
                  sx={{ mt: 1 }}
                >
                  + Add Qualification
                </Button>
              )}
            </Grid>
          </>
        )}

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" gap={2} mt={2}>
            {!editing ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleUpdate}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditing(false);
                    setForm(profile);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProfilePage;
