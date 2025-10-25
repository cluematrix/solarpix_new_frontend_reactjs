import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Button } from "react-bootstrap";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Basic Details
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined"; // Other Details
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"; // Address
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"; // Bank Details

import AddSupplierBasic from "./Form/AddSupplierBasic";
import AddSupplierOther from "./Form/AddSupplierOther";
import AddSupplierAddress from "./Form/AddSupplierAddress";
import AddSupplierBank from "./Form/AddSupplierBank";

// Created by: Sufyan 30 Sep 2025
const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#784af4",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgba(33, 113, 242, 1) 0%,rgba(64, 87, 233, 1) 50%,rgba(35, 136, 138, 1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgba(33, 113, 242, 1) 0%,rgba(64, 87, 233, 1) 50%,rgba(35, 136, 138, 1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 95deg,rgba(33, 113, 242, 1) 0%,rgba(64, 87, 233, 1) 50%,rgba(35, 136, 138, 1) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 95deg,rgba(33, 113, 242, 1) 0%,rgba(64, 87, 233, 1) 50%,rgba(35, 136, 138, 1) 100%)",
      },
    },
  ],
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <InfoOutlinedIcon fontSize="small" />,
    2: <AssignmentOutlinedIcon fontSize="small" />,
    3: <LocationOnOutlinedIcon fontSize="small" />,
    4: <AccountBalanceOutlinedIcon fontSize="small" />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

export default function CustomizedSteppers({
  formik,
  metaData,
  activeStep,
  setActiveStep,
  validationSchemas,
}) {
  const steps = ["Basic Details", "Other Details", "Address", "Bank Details"];

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddSupplierBasic formik={formik} />;
      case 1:
        return <AddSupplierOther formik={formik} metaData={metaData} />;
      case 2:
        return <AddSupplierAddress formik={formik} />;
      case 3:
        return <AddSupplierBank formik={formik} />;
      default:
        return "Unknown Step";
    }
  };

  const handleNextCustom = async () => {
    const valid = await formik.validateForm();
    if (Object.keys(valid).length === 0) {
      setActiveStep((prev) => prev + 1);
    } else {
      formik.setTouched(
        Object.keys(validationSchemas[activeStep].fields).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
    }
  };

  return (
    <Stack sx={{ width: "100%", mb: 2 }} spacing={2}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <hr />
      <Box sx={{ mt: 2 }}>{renderStepContent(activeStep)}</Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          className="me-1"
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="primary"
            type="submit"
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save"}
          </Button>
        ) : (
          <Button onClick={handleNextCustom}>Next</Button>
        )}
      </Box>
    </Stack>
  );
}
