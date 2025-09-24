import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Button } from "react-bootstrap";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // Project Basic Info
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined"; // Technical / Material Info
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined"; // MSEB (Electricity Board)
import EvStationOutlinedIcon from "@mui/icons-material/EvStationOutlined"; // Net Metering
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined"; // Nodal Point
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined"; // Staff Assignment Info
import AddProjectInfo from "./Form/addProjectInfo";

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
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
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
    2: <BuildCircleOutlinedIcon fontSize="small" />,
    3: <FlashOnOutlinedIcon fontSize="small" />,
    4: <EvStationOutlinedIcon fontSize="small" />,
    5: <AccountTreeOutlinedIcon fontSize="small" />,
    6: <PeopleAltOutlinedIcon fontSize="small" />,
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
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

export default function CustomizedSteppers({
  formik,
  metaData,
  selectedMemberNames,
  setShowMembersModal,
  employee,
}) {
  // Stepper
  const steps = [
    "Project Info",
    "Material Info",
    "MSEB",
    "Net Metering",
    "Nodal Point",
    "Staff Assignment",
  ];

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AddProjectInfo
            formik={formik}
            metaData={metaData}
            selectedMemberNames={selectedMemberNames}
            setShowMembersModal={setShowMembersModal}
            employee={employee}
          />
        );
      case 1:
        return <div>Form Step 2: Address Details</div>;
      case 2:
        return <div>Review & Submit</div>;
      default:
        return "Unknown Step";
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

      <Box sx={{ mt: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => alert("Form Submitted")}
          >
            Submit
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Stack>
  );
}
