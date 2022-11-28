import React, { useEffect, useState } from "react";
import fire from "../../Utils/firebase.config"
import "./finishedTasks.style.css";
import Sidebar from "../../Common/Sidebar/sidebar.component";
import Dashboard from "../../Common/DashboardFolder/dashboard.component";
import HolderCentralniDio from "../../Common/HolderCentralniDio/holderCentralniDio.component";
import Notification from "../../Common/NotificationFolder/notification.component";
import Button from "../../Common/ButtonFolder/button.component";
import defaultImage from "../../imagesFolder/defaultImage.svg";




const FinishedTasks = () => {
    const [finishedTasks, setFinishedTasks] = useState([]);
    const [notificationConfig, setNotificationConfig] = useState({
        visible: false,
        severity: "",
        text: "",
    });

    const fetchFinishedTasks = async() => {
        const db = fire.firestore();
        const response = db.collection("finishedTasks");
        const data = await response.get();
        const newFinishedTasks = data.docs.map((finishedTask) => {
            const finishedTaskData = finishedTask.data();
            const singleFinishedTask = {
                name: finishedTaskData.name,
                description: finishedTaskData.description,
                priority: finishedTaskData.priority,
                image: finishedTaskData.image,
                id: finishedTask.id,
            };
            return singleFinishedTask;
        });
        setFinishedTasks([...newFinishedTasks]);
    };

    useEffect(() => {
        fetchFinishedTasks();
    }, []);

    const OneFinishedTask = ({name, description, image, id, priority, finishedTask}) => {
        return(
            <div className="finishedTaskCard">
                <span className="closeIt" onClick={() => handleDeleteFinishedTask(name, id)}>X</span>
                <img src={image?.length !==0 ? image : defaultImage}/>
                <span className={priority === "low" ? "finishedTaskPriorityLow" : "finishedTaskPriorityHigh"}>{priority}</span>
                <div className="finishedTaskNameAndDescription">
                    <h2 className="finishedTaskName">{name}</h2>
                    <p className="finishedTaskDescription">{description}</p>
                </div>
                <Button buttonText="View Task" customClassName="customStyle" />
                <Button onClick={() => handleRestoreFinishedTask(finishedTask)} buttonText="Restore Task" customClassName="restoreFinishedTaskButtonStyle" />
            </div>
        )
    }

    const handleDeleteFinishedTask = async (finishedTask) => {
        const db = fire.firestore();
        await db.collection("finishedTasks").doc(finishedTask.id).delete();
        fetchFinishedTasks();
        setNotificationConfig({
            visible: true,
            severity: "error",
            text: "Task successfully deleted!"
        });
    };


    const handleRestoreFinishedTask = async (taskName, taskId) => {
        const db = fire.firestore();
        db.collection("tasks/").add({
            name: taskName,
            /* image: restoreTask.image,
            description: restoreTask.description, */
            id: taskId,
           /*  priority: restoreTask.priority, */
        });
        await db.collection("finishedTasks").doc(taskId).delete();
        fetchFinishedTasks();
        setNotificationConfig({
            visible: true,
            severity: "success",
            text: "Task successfully restored!",
        });
    }

    return(
        <>
            {notificationConfig.visible && 
                <Notification         
                    notificationConfig={notificationConfig}
                    setNotificationConfig={setNotificationConfig}
                />
            }
            <HolderCentralniDio>
            <Sidebar />
                <Dashboard mainHeadingTitle="Finished Tasks">            
                    <div className="titleAndFinishedTasks">
                        <div className="titleFinishedTasksList">
                            <h1>List of finished tasks</h1>
                        </div>
                        <div className="finishedTaskCards">
                        {finishedTasks.map(finishedTask => <OneFinishedTask
                                image={finishedTask.image}
                                priority={finishedTask.priority}
                                name={finishedTask.name}
                                description={finishedTask.description}
                                id={finishedTask.id}
                            />)}
                        </div>
                    </div>
                </Dashboard>
            </HolderCentralniDio>
        </>                
    )
}

export default FinishedTasks;