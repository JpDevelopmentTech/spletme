import { Alert } from "flowbite-react";

const AlertComponent = ({ message, type }: { message: string, type:string }) => {
  return (
    <>
      {message && (
        <Alert className="fixed top-3 right-3 z-[999]"  color={type}>
          {message}
        </Alert>
      )}
    </>
  );
};

export default AlertComponent;
