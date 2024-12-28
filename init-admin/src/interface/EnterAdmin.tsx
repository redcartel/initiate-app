import { useNavigate } from "react-router";
import { AdminButton, AdminForm, AdminInput } from "../components/individual-components";
import { useState } from "react";

const EnterAdmin = () => {
    const [adminId, setAdminId] = useState('');
    const navigate = useNavigate();
    return <AdminForm onSubmit={() => {
        window.localStorage.setItem('adminId', adminId);
        navigate(`/${adminId.toLowerCase().split(/[-_\s]+/).join('-')}`);
    }} label="Enter Admin" description="Enter the admin ID to enter the admin interface." className="flex flex-col items-center justify-center gap-2">
        <AdminInput value={adminId} onChange={(e) => setAdminId(e.target.value)} />
        <AdminButton type="submit">Enter</AdminButton>
    </AdminForm>
}

export default EnterAdmin;