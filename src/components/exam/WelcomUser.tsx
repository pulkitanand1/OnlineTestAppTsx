import { useState } from "react";
import RegistrationData from "../../dataTypes/RegistrationData";
import AlertDialog from "../common/AlertDialog";
import FancyButton from "../common/FancyButton";

interface WelcomeUserProps {
  registrationData: RegistrationData;
  handleLogOut: () => void;
}

const WelcomeUser = (props: WelcomeUserProps) => {
  const [isLogoutDialogOpen, setIsLogOutDialogOpen] = useState(false);
  const { handleLogOut, registrationData } = props;

  const handleCloseWithResponse = (resp: boolean) => {
    setIsLogOutDialogOpen(false);
    if (resp) {
      handleLogOut();
    }
  };

  const logoutDialogProps = {
    isDialogOpen: isLogoutDialogOpen,
    title: "Log",
    dialogContent: "Are you sure you want to log out?",
    handleCloseWithResponse,
  };

  return (
    <div className="userHeader">
      <div className="headerFlex">
        <h2>
          Welcome, {registrationData.fName} {registrationData.lName}
        </h2>
        <FancyButton
          buttonText={"LogOut"}
          onClickAction={() => setIsLogOutDialogOpen(true)}
        ></FancyButton>
      </div>
      <AlertDialog {...logoutDialogProps} />
    </div>
  );
};

export default WelcomeUser;
