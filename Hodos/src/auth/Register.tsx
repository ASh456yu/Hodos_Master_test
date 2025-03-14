import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../components/utils";
import "../styles/Register.css";
import axios from "axios";


const Register: React.FC = () => {
    const [signupInfo, setSignupInfo] = useState({
        name: "",
        email: "",
        password: "",
        company: "",
        employee_id: "",
        position: "",
        department: "",
    });

    const navigate = useNavigate();

    const demoWorkflowCreate = (user_id: string, label: string) => {
        const nodeIDs: string[] = [];
        const edgeIDs: string[] = [];
        for (let index = 0; index < 3; index++) {
            nodeIDs.push(`node-${user_id}-${index}-${Math.floor(Math.random() * 1000)}`);
            edgeIDs.push(`edge-${user_id}-${index}-${Math.floor(Math.random() * 1000)}`);
        }

        const newNodes = nodeIDs.map((id, index) => ({
            id,
            type: "editableNode",
            position: { x: 200 + index * 50, y: 200 + index * 30 },
            data: { userId: user_id, label, action: index == 2 ? 3 : index },
        }));

        const newEdges = [
            {
                data: { condition: "Default Condition" },
                id: edgeIDs[0],
                source: nodeIDs[0],
                sourceHandle: "output-1",
                target: nodeIDs[1],
                targetHandle: "input-1",
                type: "customEdge",
            },
            {
                data: { condition: "Default Condition" },
                id: edgeIDs[1],
                source: nodeIDs[1],
                sourceHandle: "output-2",
                target: nodeIDs[2],
                targetHandle: "input-1",
                type: "customEdge",
            },
        ];

        return { nodes: newNodes, edges: newEdges };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Remove the useDispatch hook from here - use the one defined at the top level

        const { name, email, password, company, employee_id, position, department } = signupInfo;
        if (!name || !email || !password || !company || !employee_id || !position || !department) {
            return handleError("Please fill all fields!!");
        }
        try {
            const url = `${import.meta.env.VITE_SERVER_LOCATION.split(",")[0]}/auth/signup`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupInfo),
            });
            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                const { nodes, edges } = demoWorkflowCreate(result.user_id, result.name);
                const payload = {
                    name: `demo-${result.user_id}-${Math.floor(Math.random() * 1000)}-workflow`,
                    nodes,
                    edges,
                    initiateTrip: [result.user_id],
                    tripApproval: [result.user_id],
                    claimApproval: [result.user_id],
                    finalClaimApproval: result.user_id,
                    user_id: result.user_id
                };

                const response2 = await axios.post(
                    `${import.meta.env.VITE_SERVER_LOCATION.split(",")[0]}/general/save-demo-workflow`,
                    payload,
                );

                if (response2.data.success) {
                    handleSuccess("Workflow saved successfully!");
                }
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err instanceof Error ? err.message : String(err));
        }
    };

    return (
        <div className="registerPage">
            <h1>Register</h1>
            <form onSubmit={handleSignup} className="registerForm">
                <input type="text" onChange={handleChange} name="name" value={signupInfo.name} placeholder="Enter Name" required />
                <input type="email" onChange={handleChange} name="email" value={signupInfo.email} placeholder="Enter Your Work Email" required />
                <input type="text" onChange={handleChange} name="company" value={signupInfo.company} placeholder="Enter Company" required />
                <input type="text" onChange={handleChange} name="employee_id" value={signupInfo.employee_id} placeholder="Enter Your Id" required />
                <input type="text" onChange={handleChange} name="position" value={signupInfo.position} placeholder="Enter Your Position" required />
                <input type="text" onChange={handleChange} name="department" value={signupInfo.department} placeholder="Enter Your Department" required />
                <input type="password" onChange={handleChange} name="password" value={signupInfo.password} placeholder="Enter Password" required />
                <button type="submit">Register</button>
                <span className="registerFooter">
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Register;