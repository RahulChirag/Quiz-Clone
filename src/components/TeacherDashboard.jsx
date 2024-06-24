import React, { useEffect, useState } from "react";

import {
  Header,
  UserNameDialog,
  TopicSearch,
  ShowTopic,
  HostGame,
} from "../components/Components";

const TeacherDashboard = ({
  userName,
  showUserName,
  openUserNameDialog,
  setUserName,
  setOpenUserNameDialog,
  setShowUserName,
  gameData,
  isStarterContent,
}) => {
  const [topicData, setTopicData] = useState("");
  const [gameType, setGameType] = useState("");
  return (
    <>
      <main className="h-screen relative overflow-hidden">
        <div className="relative z-10">
          <Header
            showUserName={showUserName}
            userName={userName}
            role="Teacher"
          />
          {openUserNameDialog && (
            <UserNameDialog
              setUserName={setUserName}
              setOpenUserNameDialog={setOpenUserNameDialog}
              setShowUserName={setShowUserName}
              userName={userName}
            />
          )}
          {!gameData && !isStarterContent && (
            <>
              <TopicSearch setTopicData={setTopicData} />
              {topicData && (
                <ShowTopic topicData={topicData} setGameType={setGameType} />
              )}
            </>
          )}

          {gameData && isStarterContent && (
            <HostGame
              gameData={gameData}
              isStarterContent={isStarterContent}
              gameType={gameType}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default TeacherDashboard;
