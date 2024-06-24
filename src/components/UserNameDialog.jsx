import { useUserAuth } from "../context/FirebaseAuthContext";
const UserNameDialog = ({
  setUserName,
  setOpenUserNameDialog,
  setShowUserName,
  userName,
}) => {
  const { setName } = useUserAuth();
  const handleSettingUserName = async (e) => {
    e.preventDefault();
    setName(userName);
    setShowUserName(true);
    setOpenUserNameDialog(false);
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Set Username</h2>
        <div>
          <input
            type="text"
            placeholder="Enter your User Name"
            onChange={(e) => setUserName(e.target.value)}
          ></input>
          <button onClick={handleSettingUserName}>Set User Name</button>
        </div>
      </div>
    </div>
  );
};

export default UserNameDialog;
