import LearningModules from "./LearningModules";
import { useState } from "react";
import UserSegment from "./UserSegment";

function RoadMap() {
    const [neededModules, setNeededModules] = useState({});

    return (
        <div className="container mt-3 p-3 bg-light rounded d-flex flex-column">
            <LearningModules neededModules={neededModules}/>
            <UserSegment onSelectUser={setNeededModules} />
        </div>
    );
}

export default RoadMap;
