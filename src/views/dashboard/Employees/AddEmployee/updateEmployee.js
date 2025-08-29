import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Card } from "react-bootstrap";
import * as Yup from "yup";
import api from "../../../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { successToast } from "../../../../components/Toast/successToast";
import { errorToast } from "../../../../components/Toast/errorToast";


const UpdateEmployee = () => {

   const initialValues = {
    emp_id: "",
    salutation: "",
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    gender: "",
    dob: "",
    maritial_status: "",
    role_id: "1", // default
    department_id: "",
    designation_id: "",
    employment_type_id: "",
    skill: "",
    probation_end_date: "",
    city: "",
    state: "",
    pincode: "",
    joining_date: "",
    reporting_to: "",
    // isActive: true, // default
    // isDelete: false, // default
    photo: null,
    notice_start_date: "",
    notice_end_date: "",
    shift_id: "",
  };

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [shift, setShift] = useState([]);
    const [employeeType, setEmployeeType] = useState([]);
  const [employee, setEmployee] = useState([])
  const [employeeById, setEmployeeById] = useState([])
  const {id} = useParams()


  const navigate = useNavigate();
  
 const validationSchema = Yup.object().shape({
     emp_id: Yup.string().required("Employee ID is required"),
     salutation: Yup.string().required("Salutation is required"),
     name: Yup.string().required("Name is required"),
     gender: Yup.string().required("Gender is required"),
     address: Yup.string().required("Address is required"),
     dob: Yup.date()
       .required("Date of Birth is required")
       .typeError("Invalid Date of Birth"),
     // maritial_status: Yup.string().required("Marital Status is required"),
     probation_end_date: Yup.date()
       .required("Probation End Date is required")
       .typeError("Invalid date"),
     notice_start_date: Yup.date()
       .required("Notice Period Start Date is required")
       .typeError("Invalid date"),
     notice_end_date: Yup.date()
       .required("Notice Period End Date is required")
       .typeError("Invalid date"),
     employment_type_id: Yup.string().required("Employment Type is required"),
     joining_date: Yup.string().required("Joining date is required"),
     reporting_to: Yup.string().required("Reporting date is required"),
    //  photo: Yup.mixed()
    //    .nullable()
    //    .test(
    //      "fileType",
    //      "Only JPG, JPEG, PNG, or GIF files are allowed",
    //      (value) => {
    //        if (!value) return true;
    //        return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
    //          value.type
    //        );
    //      }
    //    ),
    contact: Yup.string()
   .required("Mobile number is required")
   .matches(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
 
     email: Yup.string()
       .required("Email is required")
       .email("Enter a valid email address"),
     department_id: Yup.string().required("Department is required"),
     designation_id: Yup.string().required("Designation is required"),
     shift_id: Yup.string().required("Shift is required"),
     password: Yup.string()
       .required("Password is required")
       .min(8, "Password must be at least 6 characters long"),
     city: Yup.string().required("City is required"),
     state: Yup.string().required("State is required"),
     pincode: Yup.string()
       .required("Pincode is required")
       .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
     // skill: Yup.string().required("Skill is required"),
   });

   // fetch employee
    const fetchEmployeeById = async () => {
      try {
        const res = await api.get(`/api/v1/admin/employee/${id}`);
        setEmployeeById(res.data.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
   const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/v1/admin/department");
        if (res.data && Array.isArray(res.data)) {
          const activeDepartments = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setDepartments(activeDepartments);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    // fetch employee type
    const fetchEmployeeType = async () => {
      try {
        const res = await api.get("/api/v1/admin/employmentType");
        if (res.data && Array.isArray(res.data)) {
          const activeEmployee = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setEmployeeType(activeEmployee);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    // fetch employee
    const fetchEmployee = async () => {
      try {
        const res = await api.get("/api/v1/admin/employee");
        console.log("activeEmployeeResData", res.data);
        if (res.data.data && Array.isArray(res.data.data)) {
          const activeEmployee = res.data.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          console.log("activeEmployee", activeEmployee);
          setEmployee(activeEmployee);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    const fetchShift = async () => {
      try {
        const res = await api.get("/api/v1/admin/shift");
        if (res.data && Array.isArray(res.data)) {
          // console.log(res.data)
          const activeShift = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setShift(activeShift);
        }
      } catch (err) {
        console.error("Error fetching Shift:", err);
      }
    };

    const fetchDesignations = async () => {
      try {
        const res = await api.get("/api/v1/admin/designation");
        if (res.data && Array.isArray(res.data)) {
          const activeDesignations = res.data.filter(
            (item) => item.isActive === true || item.isActive === 1
          );
          setDesignations(activeDesignations);
        }
      } catch (err) {
        console.error("Error fetching designations:", err);
      }
    };

    useEffect(() => {
    fetchDepartments();
    fetchDesignations();
    fetchShift();
    fetchEmployeeType();
    fetchEmployee()
      fetchEmployeeById();
    }, []);

    console.log("employeeById",employeeById)

 const onSubmit = async (values) => {
  try {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key] || "");
    });

    const res = await api.put(`/api/v1/admin/employee/${id}`, formData);
    console.log("resPut",res)
    if (res.status === 200) {
      successToast(res.data.message);
      console.log("res.data.message",res.data.message)
      navigate("/employee-list");
    }
  } catch (error) {
    errorToast(error.response?.data?.message || "Internal Server Error");
    console.error("Error updating employee:", error);
  }
};

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setValues
  } = formik;

  useEffect(() => {
  if (employeeById) {
    // Create an object to map API data to Formik fields
    const updatedValues = { ...initialValues };

    Object.keys(updatedValues).forEach((key) => {
      updatedValues[key] = employeeById[key] || "";
    });

    setValues({
      ...updatedValues,
      notice_start_date: employeeById.notice_start_date
        ? employeeById.notice_start_date.split("T")[0]
        : "",
      notice_end_date: employeeById.notice_end_date
        ? employeeById.notice_end_date.split("T")[0]
        : "",
      probation_end_date: employeeById.probation_end_date
        ? employeeById.probation_end_date.split("T")[0]
        : "",
      joining_date: employeeById.joining_date
        ? employeeById.joining_date.split("T")[0]
        : "",
    });
  }
}, [employeeById, setValues, setFieldValue]);

  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  const maxDOB = today.toISOString().split("T")[0]; // Format YYYY-MM-DD

  return (
     <Card>
         <Card.Header>
           <h4 className="mb-0">Add Employee</h4>
         </Card.Header>
         <Card.Body>
           <Form onSubmit={handleSubmit}>
             {/* Row 1 */}
             <Row>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Employee ID<span>*</span></Form.Label>
                   <Form.Control
                     type="text"
                     name="emp_id"
                     value={values.emp_id}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter EmployeeID"
                      className={
                       touched.emp_id && errors.emp_id ? "is-invalid" : ""
                     }
                   />
                   {touched.emp_id && errors.emp_id && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.emp_id}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Salutation<span>*</span></Form.Label>
                   <Form.Select
                     name="salutation"
                     value={values.salutation}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     className={
                       touched.salutation && errors.salutation ? "is-invalid" : ""
                     }
                   >
                     <option value="">Select</option>
                     <option value="Mr">Mr</option>
                     <option value="Mrs">Mrs</option>
                     <option value="Dr">Dr</option>
                     <option value="Sir">Sir</option>
                     <option value="Mam">Mam</option>
                   </Form.Select>
                   {touched.salutation && errors.salutation && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.salutation}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Name<span>*</span>
                   </Form.Label>
                   <Form.Control
                     type="text"
                     name="name"
                     value={values.name}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Name"
                     className={touched.name && errors.name ? "is-invalid" : ""}
                   />
                   {touched.name && errors.name && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.name}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 2 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Gender<span>*</span></Form.Label>
                   <Form.Select
                     name="gender"
                     value={values.gender}
                     onChange={handleChange}
                     className={
                       touched.gender && errors.gender ? "is-invalid" : ""
                     }
                   >
                     <option value="">Select</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                   </Form.Select>
                   {touched.gender && errors.gender && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.gender}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Mobile Number<span>*</span></Form.Label>
                   <Form.Control
                     type="number"
                     name="contact"
                     value={values.contact}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Mobile Number"
                     className={touched.contact && errors.contact ? "is-invalid" : ""}
                   />
                   {touched.contact && errors.contact && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.contact}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Email<span>*</span>
                   </Form.Label>
                   <Form.Control
                     type="email"
                     name="email"
                     value={values.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Email"
                     className={touched.email && errors.email ? "is-invalid" : ""}
                   />
                   {touched.email && errors.email && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.email}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 3 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Password<span>*</span>
                   </Form.Label>
                   <Form.Control
                     type="password"
                     name="password"
                     value={values.password}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Password"
                     className={
                       touched.password && errors.password ? "is-invalid" : ""
                     }
                     readOnly
                   />
                   {touched.password && errors.password && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.password}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Address<span>*</span></Form.Label>
                   <Form.Control
                     type="text"
                     name="address"
                     value={values.address}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Address"
                     className={
                       touched.address && errors.address ? "is-invalid" : ""
                     }
                   />
                   {touched.address && errors.address && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.address}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Date of Birth<span>*</span></Form.Label>
                   <Form.Control
                     type="date"
                     name="dob"
                     value={values.dob}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter DOB"
                     className={touched.dob && errors.dob ? "is-invalid" : ""}
                     max={maxDOB}
                   />
                   {touched.dob && errors.dob && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.dob}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 4 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>State<span>*</span></Form.Label>
                   <Form.Control
                     type="text"
                     name="state"
                     value={values.state}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter State"
                     className={touched.state && errors.state ? "is-invalid" : ""}
                   />
                   {touched.state && errors.state && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.state}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>City<span>*</span></Form.Label>
                   <Form.Control
                     type="text"
                     name="city"
                     value={values.city}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter City"
                     className={touched.city && errors.city ? "is-invalid" : ""}
                   />
                   {touched.city && errors.city && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.city}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Pin Code<span>*</span></Form.Label>
                   <Form.Control
                     type="text"
                     name="pincode"
                     value={values.pincode}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Pincode"
                     className={
                       touched.pincode && errors.pincode ? "is-invalid" : ""
                     }
                   />
                   {touched.pincode && errors.pincode && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.pincode}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 5 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Marital Status</Form.Label>
                   <Form.Select
                     name="maritial_status"
                     value={values.maritial_status}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Select Marital Status"
                     // className={
                     //   touched.maritial_status && errors.maritial_status
                     //     ? "is-invalid"
                     //     : ""
                     // }
                   >
                     <option value="">Select</option>
                     <option value="Single">Single</option>
                     <option value="Married">Married</option>
                     <option value="Divorced">Divorced</option>
                     <option value="Widowed">Widowed</option>
                   </Form.Select>
                   {/* {touched.maritial_status && errors.maritial_status && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.maritial_status}
                     </div>
                   )} */}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Probation End Date<span>*</span></Form.Label>
                   <Form.Control
                     type="date"
                     name="probation_end_date"
                     value={values.probation_end_date}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Probation End Date"
                     min={new Date().toISOString().split("T")[0]}
                     className={
                       touched.probation_end_date && errors.probation_end_date
                         ? "is-invalid"
                         : ""
                     }
                   />
                   {touched.probation_end_date && errors.probation_end_date && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.probation_end_date}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Notice Period Start Date<span>*</span></Form.Label>
                   <Form.Control
                     type="date"
                     name="notice_start_date"
                     value={values.notice_start_date}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Select Notice Period Start Date"
                     min={new Date().toISOString().split("T")[0]}
                     className={
                       touched.notice_start_date && errors.notice_start_date
                         ? "is-invalid"
                         : ""
                     }
                   />
                   {touched.notice_start_date && errors.notice_start_date && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.notice_start_date}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 6 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Notice Period End Date<span>*</span></Form.Label>
                   <Form.Control
                     type="date"
                     name="notice_end_date"
                     value={values.notice_end_date}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Notice Period End Date"
                     min={new Date().toISOString().split("T")[0]}
                     className={
                       touched.notice_end_date && errors.notice_end_date
                         ? "is-invalid"
                         : ""
                     }
                   />
                   {touched.notice_end_date && errors.notice_end_date && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.notice_end_date}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Employment Type<span>*</span>
                   </Form.Label>
                   <Form.Select
                     name="employment_type_id"
                     value={values.employment_type_id}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     className={
                       touched.employment_type_id && errors.employment_type_id
                         ? "is-invalid"
                         : ""
                     }
                   >
                     <option value="">Select Employement Type</option>
                     {employeeType &&
                       employeeType?.map((emp) => (
                         <option key={emp.id} value={emp.id}>
                           {emp.emp_type}
                         </option>
                       ))}
                   </Form.Select>
                   {touched.employment_type_id && errors.employment_type_id && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.employment_type_id}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Joining Date<span>*</span></Form.Label>
                   <Form.Control
                     type="date"
                     name="joining_date"
                     value={values.joining_date}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     min={new Date().toISOString().split("T")[0]}
                     className={
                       touched.joining_date && errors.joining_date
                         ? "is-invalid"
                         : ""
                     }
                   />
                   {touched.joining_date && errors.joining_date && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.joining_date}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 7 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Reporting To<span>*</span>
                   </Form.Label>
                   <Form.Select
                     name="reporting_to"
                     value={values.reporting_to}
                     onChange={handleChange}
                     className={
                       touched.reporting_to && errors.reporting_to
                         ? "is-invalid"
                         : ""
                     }
                   >
                     <option value="">Select Reporting To</option>
                     {employee &&
                       employee?.map((emp) => (
                         <option key={emp.id} value={emp.id}>
                           {emp.name}
                         </option>
                       ))}
                   </Form.Select>
                   {touched.reporting_to && errors.reporting_to && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.reporting_to}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Department<span>*</span>
                   </Form.Label>
                   <Form.Select
                     name="department_id"
                     value={values.department_id}
                     onChange={handleChange}
                     className={
                       touched.department_id && errors.department_id
                         ? "is-invalid"
                         : ""
                     }
                   >
                     <option value="">Select Department</option>
                     {departments &&
                       departments?.map((dept) => (
                         <option key={dept.id} value={dept.id}>
                           {dept.name}
                         </option>
                       ))}
                   </Form.Select>
                   {touched.department_id && errors.department_id && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.department_id}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>
                     Designation<span>*</span>
                   </Form.Label>
                   <Form.Select
                     name="designation_id"
                     value={values.designation_id}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     className={
                       touched.designation_id && errors.designation_id
                         ? "is-invalid"
                         : ""
                     }
                   >
                     <option value="">Select Designation</option>
                     {designations &&
                       designations?.map((desig) => (
                         <option key={desig.id} value={desig.id}>
                           {desig.name}
                         </option>
                       ))}
                   </Form.Select>
                   {touched.designation_id && errors.designation_id && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.designation_id}
                     </div>
                   )}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Row 8 */}
             <Row className="mt-3">
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Shift<span>*</span></Form.Label>
                   <Form.Select
                     name="shift_id"
                     value={values.shift_id}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     className={
                       touched.shift_id && errors.shift_id ? "is-invalid" : ""
                     }
                   >
                     <option value="">Select Shift</option>
                     {shift &&
                       shift?.map((shifts) => (
                         <option key={shifts.id} value={shifts.id}>
                           {shifts.shift_name}
                         </option>
                       ))}
                   </Form.Select>
                   {touched.shift_id && errors.shift_id && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.shift_id}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Profile Picture</Form.Label>
                   <Form.Control
                     type="file"
                     name="photo"
                     accept="image/*"
                     onChange={(e) =>
                       setFieldValue("photo", e.currentTarget.files[0])
                     }
                     className={touched.photo && errors.photo ? "is-invalid" : ""}
                   />
                   {touched.photo && errors.photo && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.photo}
                     </div>
                   )}
                 </Form.Group>
               </Col>
               <Col md={4}>
                 <Form.Group>
                   <Form.Label>Skill</Form.Label>
                   <Form.Control
                     type="text"
                     name="skill"
                     value={values.skill}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder="Enter Skills"
                     // className={touched.skill && errors.skill ? "is-invalid" : ""}
                   />
                   {/* {touched.skill && errors.skill && (
                     <div
                       className="invalid-feedback"
                       style={{ fontSize: "11px" }}
                     >
                       {errors.skill}
                     </div>
                   )} */}
                 </Form.Group>
               </Col>
             </Row>
   
             {/* Submit + Cancel */}
             <div className="mt-4 text-end">
               <Button type="submit" variant="primary">
                 Save
               </Button>
               <Button
                 variant="secondary"
                 className="ms-2"
                 onClick={() => navigate("/employee-list")}
               >
                 Cancel
               </Button>
             </div>
           </Form>
         </Card.Body>
       </Card>
  );
};

export default UpdateEmployee;
