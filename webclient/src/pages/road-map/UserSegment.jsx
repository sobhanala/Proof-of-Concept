import AddUserModal from "./AddUserModal";
import UserCard from "./UserCard";
import { useState, useRef } from "react";

function UserSegment({ onSelectUser }) {

    const [showModal, setShowModal] = useState(false)

    const [users, setUsers] = useState([
        {
            id: 1, name: "رضا حسینی", role: "مدیر فنی",
            description: "دارای تجربه قوی در برنامه‌نویسی و مدیریت فنی پروژه‌ها بوده و توانمند در طراحی معماری سیستم‌ها است. برای ورود به حوزه هوش مصنوعی نیاز به کسب دانش در مفاهیم پایه و مدل‌های یادگیری ماشین دارد.",
            neededModules: { python_basics: "نیاز است", data_structures: "نیاز است", sql_database: "نیاز است", machine_learning: "نیاز است", deep_learning: "نیاز است" },
            isSelected: false
        },
        {
            id: 2, name: "محسن ملایری", role: "مدیر پروژه",
            description: "مدیر پروژه با تجربه در هماهنگی تیم‌های نرم‌افزاری و مدیریت چرخه توسعه. برای نقش‌آفرینی در پروژه‌های مبتنی بر هوش مصنوعی نیازمند آشنایی با مفاهیم یادگیری ماشین و ساختار داده‌ها است.",
            neededModules: { data_structures: "نیاز است", sql_database: "نیاز است", machine_learning: "نیاز است", deep_learning: "نیاز است" },
            isSelected: false
        },
        {
            id: 3, name: "احمد راد", role: "کارشناس ارشد نرم افزار",
            description: "متخصص توسعه نرم‌افزار با دانش فنی بالا در برنامه‌نویسی و طراحی سیستم‌ها. برای توسعه راهکارهای هوشمند نیازمند یادگیری مفاهیم هوش مصنوعی و مدل‌های یادگیری ماشین است.",
            neededModules: { python_basics: "نیاز است", data_structures: "نیاز است", machine_learning: "نیاز است", deep_learning: "نیاز است" },
            isSelected: false
        },
        {
            id: 4, name: "نوید نویدبخش", role: "کارشناس نرم افزار",
            description: "توسعه‌دهنده نرم‌افزار با توانایی در برنامه‌نویسی و تحلیل سیستم. برای توسعه راهکارهای داده‌محور و هوشمند نیاز به تقویت مهارت‌های مرتبط با هوش مصنوعی دارد.",
            neededModules: { python_basics: "نیاز است", data_structures: "نیاز است", sql_database: "نیاز است" },
            isSelected: false
        }
    ]);

    const nextUserIdRef = useRef(5);

    const onSelectCard = (id) => {
        const selectedUser = users.find(u => u.id === id);
        onSelectUser(selectedUser.neededModules);
        users.forEach(u => u.isSelected = false);
        selectedUser.isSelected = true;
        setUsers(users);
    }

    const onAddUser = (user) => {
        user.id = nextUserIdRef.current;
        nextUserIdRef.current++;
        user.isSelected = false;
        setUsers([user, ...users]);
        setShowModal(false);
    }

    return (
        <>
            <button onClick={() => setShowModal(true)} className="btn btn-lg btn-success fw-bold ms-auto">+</button>
            <div className="d-flex flex-wrap justify-content-end">
                {users.map(u => <UserCard key={u.id} id={u.id} name={u.name} role={u.role} description={u.description} neededModules={u.neededModules} isSelected={u.isSelected} onSelect={onSelectCard} />)}
            </div>
            <AddUserModal show={showModal} onClose={() => setShowModal(false)} onSave={onAddUser} />
        </>
    );
}

export default UserSegment;
