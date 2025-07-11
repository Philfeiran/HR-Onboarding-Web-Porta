import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import EmployeeNavbar from "../../employeeNavbar/EmployeeNavbar";
import { fetchEmployeeByEmail } from "../../../../redux/slice/employeeSlice";
import { useAuth } from "../../../../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../../redux/store";
import type Employee from "../../../../types/employee.types";
import { employeeService } from "../../../../services/employeeService";

const PersonalInfoPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { currentEmployee } = useSelector((state: RootState) => state.employee);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
    getValues,
  } = useForm<Employee>({
    defaultValues: currentEmployee || {},
  });

  useEffect(() => {
    dispatch(fetchEmployeeByEmail(user?.email || ""));
  }, [dispatch, user?.email]);

  useEffect(() => {
    if (currentEmployee) {
      reset(currentEmployee);
    }
  }, [currentEmployee, reset]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const confirmDiscard = () => {
    reset(currentEmployee || {});
    setIsEditing(false);
    setShowCancelDialog(false);
  };

  const onSubmit = async (dataWithId: Partial<Employee>) => {
    const { _id, ...data } = dataWithId;
    console.log("Form data:", data);
    // 这里可以添加保存逻辑，比如调用API
    try {
      await employeeService.updateEmployeePersonalInformationByEmail(
        user?.email || "",
        data
      );
      dispatch(fetchEmployeeByEmail(user?.email || ""));
    } catch (error) {
      console.error("Error submitting form:", error);
      // 可以在这里添加错误处理逻辑，比如显示错误提示
    }
    setIsEditing(false);
  };

  const handleAddressChange = (field: string, value: string) => {
    // 处理嵌套对象的更新
    const currentAddress = getValues("currentAddress") || {};
    return {
      ...currentAddress,
      [field]: value,
    };
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  const formData = getValues();

  return (
    <>
      <EmployeeNavbar />
      <Box p={10}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Personal Information
          </Typography>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant="outlined"
              color="primary"
              size="small"
            >
              Edit
            </Button>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                color="success"
                size="small"
              >
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outlined"
                color="error"
                size="small"
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name & Identity Section */}
          <Box bgcolor="white" p={3} borderRadius={2} boxShadow={2} mb={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Name & Identity</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={6}>
                {isEditing ? (
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                ) : (
                  <Typography>First Name: {formData.firstName}</Typography>
                )}
              </Grid>
              <Grid size={6}>
                {isEditing ? (
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                ) : (
                  <Typography>Last Name: {formData.lastName}</Typography>
                )}
              </Grid>
              <Grid size={6}>
                {isEditing ? (
                  <Controller
                    name="middleName"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Middle Name" />
                    )}
                  />
                ) : (
                  <Typography>Middle Name: {formData.middleName}</Typography>
                )}
              </Grid>
              <Grid size={6}>
                {isEditing ? (
                  <Controller
                    name="preferredName"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Preferred Name" />
                    )}
                  />
                ) : (
                  <Typography>
                    Preferred Name: {formData.preferredName}
                  </Typography>
                )}
              </Grid>
              <Grid size={6}>
                <Typography>Email: {formData.email}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography>SSN: {formData.ssn}</Typography>
              </Grid>
              <Grid size={6}>
                {isEditing ? (
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                ) : (
                  <Typography>DOB: {formData.dateOfBirth}</Typography>
                )}
              </Grid>
              <Grid size={6}>
                {isEditing ? (
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth label="Gender" />
                    )}
                  />
                ) : (
                  <Typography>Gender: {formData.gender}</Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Address Section */}
          <Box bgcolor="white" p={3} borderRadius={2} boxShadow={2} mb={4}>
            <Typography variant="h6" mb={2}>
              Address
            </Typography>
            <Grid container spacing={2}>
              {["building", "street", "city", "state", "zip"].map((field) => (
                <Grid size={6} key={field}>
                  {isEditing ? (
                    <Controller
                      name={`currentAddress.${field}` as keyof Employee}
                      control={control}
                      render={({ field: controllerField }) => (
                        <TextField
                          {...controllerField}
                          fullWidth
                          label={field[0].toUpperCase() + field.slice(1)}
                        />
                      )}
                    />
                  ) : (
                    <Typography>
                      {field[0].toUpperCase() + field.slice(1)}:{" "}
                      {(formData.currentAddress as any)?.[field]}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Documents Section */}
          <Box bgcolor="white" p={3} borderRadius={2} boxShadow={2}>
            <Typography variant="h6" mb={2}>
              Documents
            </Typography>
            <Box>
              {formData.driversLicense?.driversLicenseCopy && (
                <Box mb={1}>
                  <Typography component="span">Driver's License:</Typography>
                  <Button
                    onClick={() => openInNewTab("")}
                    size="small"
                    color="primary"
                  >
                    View
                  </Button>
                  <Button
                    href={formData.driversLicense.driversLicenseCopy}
                    download
                    size="small"
                    color="success"
                  >
                    Download
                  </Button>
                </Box>
              )}
              {formData.workAuthorization?.optReceipt && (
                <Box mb={1}>
                  <Typography component="span">OPT Receipt:</Typography>
                  <Button
                    onClick={() => openInNewTab("")}
                    size="small"
                    color="primary"
                  >
                    View
                  </Button>
                  <Button
                    href={formData.workAuthorization.optReceipt}
                    download
                    size="small"
                    color="success"
                  >
                    Download
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </form>

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
        >
          <DialogTitle>Discard Changes?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to discard all changes?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmDiscard} color="error">
              Yes
            </Button>
            <Button
              onClick={() => setShowCancelDialog(false)}
              color="primary"
              autoFocus
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default PersonalInfoPage;
